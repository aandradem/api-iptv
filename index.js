const express = require('express');
const axios = require('axios');
const app = express();

app.get('/playlist.m3u', async (req, res) => {
    try {
        // Tentativa de requisição na raiz ou endpoint base da API do serviço
        const response = await axios.get('https://api.reidoscanais.si/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://reidoscanais.si/',
                'Origin': 'https://reidoscanais.si'
            }
        });
        
        // Se a resposta retornar os dados ou uma lista de canais
        const data = response.data;
        const canais = Array.isArray(data) ? data : (data.channels || data.canais || []);

        let m3uContent = '#EXTM3U\n';

        if (canais.length === 0) {
            // Fallback caso a estrutura venha vazia ou em outro formato
            m3uContent += '#EXTINF:-1 tvg-logo="" group-title="Aviso",Canal de Teste - API Atualizando\n';
            m3uContent += 'https://www.w3schools.com/html/mov_bbb.mp4\n';
        } else {
            canais.forEach(canal => {
                const nome = canal.name || canal.title || 'Canal';
                const logo = canal.logo || '';
                const urlStream = canal.url || canal.stream_url;

                if (urlStream) {
                    m3uContent += `#EXTINF:-1 tvg-logo="${logo}" group-title="Geral",${nome}\n`;
                    m3uContent += `${urlStream}\n`;
                }
            });
        }

        res.setHeader('Content-Type', 'audio/x-mpegurl');
        res.send(m3uContent);
    } catch (error) {
        console.error("Erro detalhado:", error.message);
        
        // Gera um M3U de emergência caso a API externa caia, para a TV não ficar sem lista
        let m3uFallback = '#EXTM3U\n';
        m3uFallback += '#EXTINF:-1 tvg-logo="" group-title="Sistema",Erro ao contatar API de Canais\n';
        m3uFallback += 'https://www.w3schools.com/html/mov_bbb.mp4\n';
        
        res.setHeader('Content-Type', 'audio/x-mpegurl');
        res.send(m3uFallback);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
