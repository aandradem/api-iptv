const express = require('express');
const axios = require('axios');
const app = express();

app.get('/playlist.m3u', async (req, res) => {
    try {
        // Usando o endpoint correto descoberto no DevTools com os headers exigidos
        const response = await axios.get('https://api.reidoscanais.si/channels', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://reidoscanais.si/',
                'Origin': 'https://reidoscanais.si'
            }
        });
        
        const canais = response.data;

        let m3uContent = '#EXTM3U\n';

        // Garante que percorre a lista de canais corretamente
        canais.forEach(canal => {
            const nome = canal.name || canal.title || 'Canal';
            const logo = canal.logo || '';
            const urlStream = canal.url || canal.stream_url;

            if (urlStream) {
                m3uContent += `#EXTINF:-1 tvg-logo="${logo}" group-title="Geral",${nome}\n`;
                m3uContent += `${urlStream}\n`;
            }
        });

        res.setHeader('Content-Type', 'audio/x-mpegurl');
        res.send(m3uContent);
    } catch (error) {
        console.error("Erro detalhado:", error.message);
        if (error.response) {
            console.error("Dados da resposta:", error.response.data);
        }
        res.status(500).send(`Erro ao gerar a lista: ${error.message}`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
