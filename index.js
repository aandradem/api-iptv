const express = require('express');
const app = express();

app.get('/playlist.m3u', (req, res) => {
    // Lista fixa ou dinâmica dos seus canais favoritos
    const canais = [
        {
            nome: "Globo HD",
            grupo: "Canais Abertos",
            logo: "https://exemplo.com/logo-globo.png",
            url: "https://api.reidoscanais.si/channels/band"
        },
        {
            nome: "SBT HD",
            grupo: "Canais Abertos",
            logo: "https://exemplo.com/logo-sbt.png",
            url: "https://api.reidoscanais.si/channels/band"
        },
        {
            nome: "ESPN Brasil",
            grupo: "Esportes",
            logo: "https://exemplo.com/logo-espn.png",
            url: "https://api.reidoscanais.si/channels/band"
        }
    ];

    let m3uContent = '#EXTM3U\n';

    canais.forEach(canal => {
        m3uContent += `#EXTINF:-1 tvg-logo="${canal.logo}" group-title="${canal.grupo}",${canal.nome}\n`;
        m3uContent += `${canal.url}\n`;
    });

    res.setHeader('Content-Type', 'audio/x-mpegurl');
    res.send(m3uContent);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
