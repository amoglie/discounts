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
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    const $ = cheerio.load(response.data);
    
    // Imprimir los primeros 1000 caracteres del HTML
    console.log('HTML preview:', response.data.substring(0, 1000));

    // Buscar scripts que puedan contener datos JSON
    const scripts = $('script').map((i, el) => $(el).html()).get();
    const jsonData = scripts.find(script => script.includes('window.__NEXT_DATA__'));

    let items = [];
    if (jsonData) {
      const match = jsonData.match(/window\.__NEXT_DATA__ = (.+);/);
      if (match) {
        const data = JSON.parse(match[1]);
        // Aquí necesitarías navegar por el objeto data para encontrar la información relevante
        // Por ejemplo: items = data.props.pageProps.initialData.items;
        console.log('Found JSON data:', JSON.stringify(data, null, 2).substring(0, 1000));
      }
    }

    if (items.length === 0) {
      // Si no encontramos datos en JSON, intentamos scraping tradicional
      $('a').each((index, element) => {
        const $element = $(element);
        const link = $element.attr('href');
        const imageUrl = $element.find('img').attr('src');
        const alt = $element.find('img').attr('alt');

        if (link && imageUrl && alt) {
          items.push({ link, imageUrl, alt });
        }
      });
    }

    res.status(200).json({
      message: 'Scraping completed',
      itemsCount: items.length,
      items: items,
    });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Error scraping the website', 
      details: error.message,
    });
  }
};
