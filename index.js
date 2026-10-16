const express = require('express');
const axios = require('axios');
const app = express();

app.get('/playlist.m3u', async (req, res) => {
    try {
        // Consumindo a API oficial documentada do Rei dos Canais
        const response = await axios.get('https://api.reidoscanais.si/channels');
        const resultado = response.data;
        
        const canais = Array.isArray(resultado.data) ? resultado.data : [];

        let m3uContent = '#EXTM3U\n';

        if (canais.length === 0) {
            m3uContent += '#EXTINF:-1 tvg-logo="" group-title="Aviso",Nenhum canal encontrado na API\n';
            m3uContent += 'https://www.w3schools.com/html/mov_bbb.mp4\n';
        } else {
            canais.forEach(canal => {
                const nome = canal.name || 'Canal';
                const logo = canal.logo_url || '';
                const grupo = canal.category || 'Geral';
                
                // Extrai o link de embed/stream fornecido pela API oficial
                let urlStream = '';
                if (canal.embeds && canal.embeds.length > 0) {
                    urlStream = canal.embeds[0].embed_url;
                }

                if (urlStream) {
                    m3uContent += `#EXTINF:-1 tvg-logo="${logo}" group-title="${grupo}",${nome}\n`;
                    m3uContent += `${urlStream}\n`;
                }
            });
        }

        // Define o cabeçalho correto para a TV/player reconhecer como lista M3U
        res.setHeader('Content-Type', 'audio/x-mpegurl');
        res.send(m3uContent);
    } catch (error) {
        console.error("Erro ao buscar a API:", error.message);
        
        // Fallback de segurança caso a API oficial caia temporariamente
        let m3uFallback = '#EXTM3U\n';
        m3uFallback += '#EXTINF:-1 tvg-logo="" group-title="Sistema",Erro ao carregar API oficial\n';
        m3uFallback += 'https://www.w3schools.com/html/mov_bbb.mp4\n';
        
        res.setHeader('Content-Type', 'audio/x-mpegurl');
        res.send(m3uFallback);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
