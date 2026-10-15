const express = require('express');
const axios = require('axios');
const app = express();

app.get('/playlist.m3u', async (req, res) => {
    try {
        // Tentamos buscar com um User-Agent para fingir ser um navegador comum
        const response = await axios.get('https://reidoscanais.si/api/canais', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const canais = response.data;

        let m3uContent = '#EXTM3U\n';

        canais.forEach(canal => {
            const nome = canal.name || 'Canal';
            const logo = canal.logo || '';
            const urlStream = canal.url;

            m3uContent += `#EXTINF:-1 tvg-logo="${logo}" group-title="Geral",${nome}\n`;
            m3uContent += `${urlStream}\n`;
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
