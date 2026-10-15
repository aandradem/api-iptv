const express = require('express');
const axios = require('axios');
const app = express();

app.get('/playlist.m3u', async (req, res) => {
    try {
        // Lista de slugs dos canais que deseja buscar na API deles
        const slugs = ['globo', 'sbt', 'band', 'record']; // Pode adicionar mais slugs conforme encontrar
        let m3uContent = '#EXTM3U\n';

        for (const slug of slugs) {
            try {
                const response = await axios.get(`https://api.reidoscanais.si/channels/${slug}`, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Referer': 'https://reidoscanais.si/',
                        'Origin': 'https://reidoscanais.si'
                    }
                });

                const canal = response.data;
                const nome = canal.name || canal.title || slug.toUpperCase();
                const logo = canal.logo || '';
                const urlStream = canal.url || canal.stream_url;

                if (urlStream) {
                    m3uContent += `#EXTINF:-1 tvg-logo="${logo}" group-title="Canais Abertos",${nome}\n`;
                    m3uContent += `${urlStream}\n`;
                }
            } catch (err) {
                console.error(`Erro ao buscar o canal ${slug}:`, err.message);
            }
        }

        res.setHeader('Content-Type', 'audio/x-mpegurl');
        res.send(m3uContent);
    } catch (error) {
        console.error("Erro geral:", error.message);
        res.status(500).send(`Erro ao gerar a lista: ${error.message}`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
