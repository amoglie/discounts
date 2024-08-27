const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const targetUrl = 'https://semananacion.com.ar/buscador?id=6643f4273aaa1b8564c85bd0';
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const url = proxyUrl + targetUrl;

  try {
    console.log('Fetching data from:', url);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://semananacion.com.ar',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    console.log('Data fetched successfully');
    console.log('Response status:', response.status);
    
    const $ = cheerio.load(response.data);
    
    // Imprimir información de depuración
    console.log('HTML length:', $.html().length);
    console.log('First 500 characters of HTML:', $.html().substring(0, 500));
    
    const items = [];
    $('a').each((index, element) => {
      const $element = $(element);
      const link = $element.attr('href');
      const imageUrl = $element.find('img').attr('src');
      const alt = $element.find('img').attr('alt');

      if (link && imageUrl && alt) {
        items.push({ link, imageUrl, alt });
      }
    });

    console.log('Found items:', items.length);

    res.status(200).json({
      message: 'Scraping completed',
      itemsCount: items.length,
      items: items
    });
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ error: 'Error scraping the website', details: error.message });
  }
};
