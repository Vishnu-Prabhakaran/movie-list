const request = require('request-promise');
const cheerio = require('cheerio');

async function scrapeTitlesRanksAndRatings() {
  const result = await request.get(
    'https://www.imdb.com/chart/moviemeter/?ref_=nv_mv_250'
  );
  const $ = await cheerio.load(result);
  const movies = $('tr')
    .map((i, e) => {
      const title = $(e)
        .find('td.titleColumn > a')
        .text();
      const descriptionUrl =
        'https://www.imdb.com' +
        $(e)
          .find('td.titleColumn > a')
          .attr('href');
      const imdbRating = $(e)
        .find('td.ratingColumn.imdbRating')
        .text()
        .trim();
      // Rank is the index
      return { title, imdbRating, rank: i, descriptionUrl };
    })
    .get();
  console.log(movies);
}

scrapeTitlesRanksAndRatings();
