const express = require('express');
const axios = require('axios');
const app = express();

app.get('/playlist.m3u', async (req, res) => {
    try {
        // Lista com os identificadores (slugs) exatos dos canais que queres na tua TV
        const canaisDesejados = [
            { slug: 'globo', nome: 'Globo SP', grupo: 'Canais Abertos' },
            { slug: 'sbt', nome: 'SBT', grupo: 'Canais Abertos' },
            { slug: 'record', nome: 'Record', grupo: 'Canais Abertos' },
            { slug: 'band', nome: 'Band', grupo: 'Canais Abertos' },
            { slug: 'sportv', nome: 'SporTV', grupo: 'Esportes' },
            { slug: 'premiereclubes', nome: 'Premiere', grupo: 'Esportes' },
            { slug: 'adultswim', nome: 'Adult Swim', grupo: 'Entretenimento' },
            { slug: 'cartoonnetwork', nome: 'Cartoon Network', grupo: 'Infantil' },
            { slug: 'hbo', nome: 'HBO', grupo: 'Filmes e Séries' },
            { slug: 'tnt', nome: 'TNT', grupo: 'Filmes e Séries' }
        ];

        let m3uContent = '#EXTM3U\n';

        for (const item of canaisDesejados) {
            try {
                // Consulta o endpoint específico de cada canal na API oficial
                const response = await axios.get(`https://api.reidoscanais.si/channels/${item.slug}`, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Referer': 'https://reidoscanais.si/',
                        'Origin': 'https://reidoscanais.si'
                    }
                });

                const canal = response.data;
                const logo = canal.logo_url || '';
                
                // Extrai o link do embed correspondente
                let urlStream = '';
                if (canal.embeds && canal.embeds.length > 0) {
                    urlStream = canal.embeds[0].embed_url;
                }

                if (urlStream) {
                    m3uContent += `#EXTINF:-1 tvg-logo="${logo}" group-title="${item.grupo}",${item.nome}\n`;
                    m3uContent += `${urlStream}\n`;
                }
            } catch (err) {
                console.error(`Erro ao buscar o canal ${item.slug}:`, err.message);
            }
        }

        res.setHeader('Content-Type', 'audio/x-mpegurl');
        res.send(m3uContent);
    } catch (error) {
        console.error("Erro geral:", error.message);
        res.status(500).send('Erro ao gerar a lista.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
