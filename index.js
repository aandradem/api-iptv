const express = require('express');
const app = express();

app.get('/playlist.m3u', (req, res) => {
    // Lista fixa otimizada para máxima velocidade e sem travamentos
    const canais = [
        // --- CANAIS ABERTOS / AO VIVO ---
        {
            nome: "Record HD (Live)",
            grupo: "Canais Abertos",
            logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Record_TV_logo_2016.svg",
            url: "https://tiktokcdn.live/live/secure/3cysvL8WcDcMcT7NpEti_fIkx8VSCJDkssIzGB-azZk/1792118220/7c70da7dcf50cd5d/record/index.m3u8"
        },
        {
            nome: "Globo HD",
            grupo: "Canais Abertos",
            logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/TV_Globo_logo_2021.svg",
            url: "EXEMPLO_LINK_M3U8_AQUI"
        },
        {
            nome: "SBT HD",
            grupo: "Canais Abertos",
            logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/SBT_logo_2022.svg",
            url: "EXEMPLO_LINK_M3U8_AQUI"
        }
    ];

    // Montagem do conteúdo no formato M3U padrão
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
