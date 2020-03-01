const request = require('request-promise');
const cheerio = require('cheerio');

async function scrapeTitlesRanksAndRatings() {
  const result = await request.get(
    'https://www.imdb.com/chart/moviemeter/?ref_=nv_mv_250'
  );
  const $ = await cheerio.load(result);
  const movies = $('td.titleColumn > a')
    .map((i, e) => {
      return $(e).text();
    })
    .get();
  console.log(movies);
}

scrapeTitlesRanksAndRatings();
