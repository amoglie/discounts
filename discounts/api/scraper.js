// src/scraper.js

const axios = require('axios');
const cheerio = require('cheerio');

// URL que deseas scrapear
const url = 'https://www.passline.com/productora/nicetotickets';

async function scrapeWebsite() {
  try {
    // Hacer una solicitud HTTP GET a la URL
    const { data } = await axios.get(url);

    // Cargar el HTML en cheerio
    const $ = cheerio.load(data);

    // Aquí puedes comenzar a capturar la información que necesitas
    const events = [];

    // Selecciona los elementos que contienen la información de los eventos
    $('.event-card').each((index, element) => {
      const eventTitle = $(element).find('.event-card-title').text().trim();
      const eventDate = $(element).find('.event-card-date').text().trim();
      const eventLink = $(element).find('a').attr('href');

      events.push({
        title: eventTitle,
        date: eventDate,
        link: eventLink ? `https://www.passline.com${eventLink}` : null,
      });
    });

    // Mostrar la información capturada en la consola
    console.log(events);

  } catch (error) {
    console.error(`Error scraping the website: ${error}`);
  }
}

// Ejecutar la función de scraping
scrapeWebsite();