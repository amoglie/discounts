const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const url = 'https://www.passline.com/productora/nicetotickets';

  try {
    console.log('Fetching data from:', url);
    const { data } = await axios.get(url);
    console.log('Data fetched successfully');

    const $ = cheerio.load(data);
    console.log('HTML loaded into Cheerio');

    const events = [];

    $('.event-card').each((index, element) => {
      const eventTitle = $(element).find('.event-card-title').text().trim();
      const eventDate = $(element).find('.event-card-date').text().trim();
      const eventLink = $(element).find('a').attr('href');

      console.log(`Event ${index + 1}:`, {
        title: eventTitle,
        date: eventDate,
        link: eventLink ? `https://www.passline.com${eventLink}` : null,
      });

      events.push({
        title: eventTitle,
        date: eventDate,
        link: eventLink ? `https://www.passline.com${eventLink}` : null,
      });
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ error: 'Error scraping the website', details: error.message });
  }
};