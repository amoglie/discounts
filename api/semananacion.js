const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const url = 'https://semananacion.com.ar/buscador?id=6643f4273aaa1b8564c85bd0';

  try {
    console.log('Fetching data from:', url);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      timeout: 10000 // 10 seconds timeout
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    const $ = cheerio.load(response.data);
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

    res.status(200).json({
      message: 'Scraping completed',
      itemsCount: items.length,
      items: items
    });
  } catch (error) {
    console.error('Error details:', error);
    
    let statusCode = 500;
    let errorMessage = 'Error scraping the website';
    
    if (error.response) {
      statusCode = error.response.status;
      errorMessage = `Received ${statusCode} status code from the target website`;
    } else if (error.request) {
      errorMessage = 'No response received from the target website';
    }

    res.status(statusCode).json({ 
      error: errorMessage, 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
