const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const url = 'https://semananacion.com.ar/buscador?id=6643f4273aaa1b8564c85bd0';

  try {
    console.log('Fetching data from:', url);
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.google.com/',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    console.log('Data fetched successfully');

    const $ = cheerio.load(data);
    const items = [];

    $('.ItemV1_item__lN3MZ').each((index, element) => {
      const $element = $(element);
      const link = $element.attr('href');
      const imageUrl = $element.find('img').attr('src');
      const alt = $element.find('img').attr('alt');

      items.push({
        link,
        imageUrl,
        alt
      });
    });

    // Establecer headers para evitar caché en la respuesta
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    res.status(200).json(items);
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ error: 'Error scraping the website', details: error.message });
  }
};
