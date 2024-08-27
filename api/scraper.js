const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  const url = 'https://www.passline.com/productora/nicetotickets';

  try {
    console.log('Launching browser');
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    console.log('Navigating to:', url);
    await page.goto(url, { waitUntil: 'networkidle0' });

    console.log('Scraping data');
    const events = await page.evaluate(() => {
      const eventElements = document.querySelectorAll('li');
      return Array.from(eventElements).map(element => {
        const title = element.querySelector('.titulo-tarjeta-buscador')?.textContent.trim();
        const date = element.querySelector('.icon-calendar')?.parentElement.textContent.trim();
        const price = element.querySelector('.price')?.textContent.trim();
        const location = element.querySelector('.icon-location')?.parentElement.textContent.trim();
        const imageUrl = element.querySelector('img')?.src;
        const ticketLink = element.querySelector('.btnbuy')?.href;

        return title ? { title, date, price, location, imageUrl, ticketLink } : null;
      }).filter(Boolean);
    });

    await browser.close();

    console.log('Scraping completed');
    res.status(200).json(events);
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ error: 'Error scraping the website', details: error.message });
  }
};
