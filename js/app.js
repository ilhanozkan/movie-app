const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1';
const GENRES = 'https://api.themoviedb.org/3/genre/movie/list?api_key=04c35731a5ee918f014970082a0088b1&language=en-US';
const IMG_PATH = 'https://image.tmdb.org/t/p/original';

const sliderImgContainer = document.querySelector('.slider-imgs');
const sliderArticles = document.querySelectorAll('.slider-element');
const sliderImgs = document.querySelectorAll('.slider-img');
const stars = document.querySelectorAll('.star');
const movieTitles = document.querySelectorAll('.movie-title');
const movieParags = document.querySelectorAll('.movie-p');
const movieReviews = document.querySelectorAll('.reviews');

async function getMovies(url) {
  const response = await fetch(url);
  const data = await response.json();

  setImages(data.results);
  addMovieDesc(data.results);
}

function setImages(movie) {
  let i = 0;
  
  sliderImgs.forEach((img) => {
    img.src = IMG_PATH + movie[i].backdrop_path;
    i++;
  });
}

function addMovieDesc(movie) {
  for (let i = 0; i < 5; i++) {
    movieTitles[i].innerText = movie[i].title;
    movieParags[i].innerText = movie[i].overview;
    movieReviews[i].innerText = `(${movie[i].vote_count} reviews)`;

    if (movie[i].vote_count > 999)
      movie[i].vote_count = movie[i].vote_count / 1000;

    fillStars(movie[i], i);
  }

  document.querySelector('.slider-buttons').addEventListener('click', (btn) => {
    const index = btn.target.dataset.id;
    
    if (!index) return null;

    clearInterval(autoStart);
    slideIndex = index;
    autoStart = setInterval(autoTranslate, 5000);
    sliderArticles.forEach((e) => sliderTranslate(e, index));
  });
}

function fillStars(movie, i) {
  const stars = document.querySelectorAll(`#article-${i + 1} .star`);
  const movieStar = movie.vote_average;
  const filledStar = Math.floor(movieStar / 2);
  const lastStar = filledStar;
  const fraction = movieStar - Math.floor(movieStar);

  for (let i = 0; i < filledStar; i++)
    stars[i].style.background = '#ffc107';

  stars[lastStar].style.background =
  `linear-gradient(90deg, #ffc107 ${fraction.toFixed(2) * 100}%, rgba(179, 179, 179, 0.3)0%)`;
}

let slideIndex = 1;

function autoTranslate() {
  if (slideIndex == sliderArticles.length) slideIndex = 0;

  sliderArticles.forEach(e => sliderTranslate(e, slideIndex));
  slideIndex++;
}

function sliderTranslate(e, index) {
  e.style.transform = `translateX(-${(index * 100)}%)`;
}

let autoStart = setInterval(autoTranslate, 5000);

getMovies(API_URL);