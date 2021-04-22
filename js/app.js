const POPULAR_MOVIES = 'https://api.themoviedb.org/3/movie/popular?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&page=1';
const POPULAR_TV = 'https://api.themoviedb.org/3/tv/popular?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&page=1';
const NOW_PLAYING = 'https://api.themoviedb.org/3/movie/now_playing?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&page=1';
const GENRES = 'https://api.themoviedb.org/3/genre/movie/list?api_key=04c35731a5ee918f014970082a0088b1&language=en-US';
const IMG_PATH = 'https://image.tmdb.org/t/p/original';
const CARD_PATH = 'https://image.tmdb.org/t/p/w200';

const sliderArticles = document.querySelectorAll('.slider-element');
const sliderImgs = document.querySelectorAll('.slider-img');
const movieTitles = document.querySelectorAll('.movie-title');
const movieParags = document.querySelectorAll('.movie-p');
const movieReviews = document.querySelectorAll('.reviews');

async function getMovies(url) {
  const response = await fetch(url);
  const data = await response.json();

  switch (url) {
    case NOW_PLAYING:
      setImages(data.results);
      addMovieDesc(data.results);
      break;
    case POPULAR_MOVIES:
      addMovieCard(data.results, 'popular-movies');
      break;
    case POPULAR_TV:
      addMovieCard(data.results, 'popular-tv-shows');
      break;
  }
}

function setImages(movie) {
  sliderImgs.forEach((img, index) => {
    img.src = IMG_PATH + movie[index].backdrop_path;
  });
}

function addMovieDesc(movie) {
  for (let index = 0; index < 5; index++) {
    let movieReview;
    
    if (movie[index].vote_count > 999)
      movieReview = movie[index].vote_count / 1000;
    else
      movieReview = movie[index].vote_count;

    movieTitles[index].innerText = movie[index].title;
    movieParags[index].innerText = movie[index].overview;
    movieReviews[index].innerText =
      `(${movieReview} reviews)`;

    fillStars(movie[index], index);
  }

  document.querySelector('.slider-buttons').addEventListener('click', (btn) => {
    const index = btn.target.dataset.id;
    
    if (!index) return null;

    clearInterval(autoStart);
    slideIndex = index;
    autoStart = setInterval(autoTranslate, 4000);
    sliderArticles.forEach(e => sliderTranslate(e, index));

    activeId = parseInt(index, 10) + 1;
    btnActive(activeId);
  });
}

function fillStars(movie, index) {
  const stars = document.querySelectorAll(`#article-${index + 1} .star`);
  const movieStar = movie.vote_average;
  const filledStar = Math.floor(movieStar / 2);
  const lastStar = filledStar;
  const fraction = movieStar - Math.floor(movieStar);

  for (let index = 0; index < filledStar; index++)
    stars[index].style.background = '#ffc107';

  stars[lastStar].style.background =
    `linear-gradient(90deg, #ffc107 ${fraction.toFixed(2) * 100}%, rgba(179, 179, 179, 0.3)0%)`;
}

let slideIndex = 1;

function autoTranslate() {
  if (slideIndex == sliderArticles.length) slideIndex = 0;

  sliderArticles.forEach(e => sliderTranslate(e, slideIndex));
  slideIndex++;

  btnActive(slideIndex);
}

function sliderTranslate(e, index) {
  e.style.transform = `translateX(-${(index * 100)}%)`;
}

document.querySelector('#slider-btn-1').classList.add('slider-btn-hover');

function btnActive(index) {
  const prev = document.querySelectorAll(`.slider-btn`);
  const active = document.querySelector(`#slider-btn-${index}`);
  
  prev.forEach(btn => btn.classList.remove('slider-btn-hover'));
  active.classList.add('slider-btn-hover');
}

function addMovieCard(movie, ulName) {
  let ul = document.querySelector(`.${ulName}`);

  for (let index = 0; index < 20; index++) {
    let li = document.createElement('li');
    let img = document.createElement('img');

    ul.appendChild(li);
    li.appendChild(img);
    li.classList.add('movie-card');
    img.classList.add('movie-card');
    img.src = CARD_PATH + movie[index].poster_path;
  }
}

let autoStart = setInterval(autoTranslate, 4000);

getMovies(POPULAR_MOVIES);
getMovies(POPULAR_TV);
getMovies(NOW_PLAYING);