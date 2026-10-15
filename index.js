const express = require('express');
const axios = require('axios');
const app = express();

app.get('/playlist.m3u', async (req, res) => {
    try {
        // Faz a requisição na API original
        const response = await axios.get('https://reidoscanais.si/api/canais'); // Ajuste a rota se necessário
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
        res.status(500).send('Erro ao gerar a lista.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
