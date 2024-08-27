const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const url = 'https://www.passline.com/productora/nicetotickets';

  try {
    console.log('Fetching data from:', url);
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.google.com/'
      },
      timeout: 10000
    });
    console.log('Data fetched successfully');

    const $ = cheerio.load(data);
    const events = [];

    $('li').each((index, element) => {
      const $element = $(element);
      const title = $element.find('.titulo-tarjeta-buscador').text().trim();
      const date = $element.find('.icon-calendar').parent().text().trim();
      const price = $element.find('.price').text().trim();
      const location = $element.find('.icon-location').parent().text().trim();
      const imageUrl = $element.find('img').attr('src');
      const ticketLink = $element.find('.btnbuy').attr('href');

      if (title) {
        events.push({
          title,
          date,
          price,
          location,
          imageUrl,
          ticketLink
        });
      }
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ error: 'Error scraping the website', details: error.message });
  }
};
