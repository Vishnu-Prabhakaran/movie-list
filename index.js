const request = require('request-promise');
const cheerio = require('cheerio');
// Nightmare
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });

async function scrapeTitlesRanksAndRatings() {
  const result = await request.get(
    'https://www.imdb.com/chart/moviemeter/?ref_=nv_mv_mpm'
  );
  const $ = await cheerio.load(result);
  const movies = $('tr')
    .map((i, e) => {
      try {
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
      } catch (err) {
        console.log(err);
      }
    })
    .get();
  return movies;
}

async function scrapePosterUrl(movies) {
  const moviesWithPosterUrls = await Promise.all(
    movies.map(async movie => {
      try {
        const html = await request.get(movie.descriptionUrl);
        const $ = await cheerio.load(html);

        const movieUrl = $('div.poster > a').attr('href');
        movie.posterUrl = 'https://www.imdb.com' + movieUrl;
        return movie;
      } catch (err) {
        console.log(err);
      }
    })
  );
  return moviesWithPosterUrls;
}
// Get Poster
async function scrapePosterImageUrl(movies) {
  for (var i = 0; i < movies.length; i++) {
    try {
      const posterImageUrl = await nightmare
        .goto(movies[i].posterUrl)
        .evaluate(() =>
          $(
            '#photo-container > div > div:nth-child(3) > div > div.pswp__scroll-wrap > div.pswp__container > div:nth-child(2) > div > img:nth-child(2)'
          ).attr('src')
        );
      movies[i].posterImageUrl = posterImageUrl;
      console.log(movies[i]);
    } catch (err) {
      console.log(err);
    }
  }
  return movies;
}

async function main() {
  let movies = await scrapeTitlesRanksAndRatings();
  movies = await scrapePosterUrl(movies);
  movies = await scrapePosterImageUrl(movies);
  console.log(movies);
}

main();
