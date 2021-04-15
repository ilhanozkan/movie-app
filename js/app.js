const POPULAR_MOVIES = 'https://api.themoviedb.org/3/movie/popular?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&page=1';
const POPULAR_TV = 'https://api.themoviedb.org/3/tv/popular?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&page=1';
const NOW_PLAYING = 'https://api.themoviedb.org/3/movie/now_playing?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&page=1';
const GENRES = 'https://api.themoviedb.org/3/genre/movie/list?api_key=04c35731a5ee918f014970082a0088b1&language=en-US';
const IMG_PATH = 'https://image.tmdb.org/t/p/original';
const CARD_PATH = 'https://image.tmdb.org/t/p/w200';

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
  let i = 0;
  
  sliderImgs.forEach((img) => {
    img.src = IMG_PATH + movie[i].backdrop_path;
    i++;
  });
}

function addMovieDesc(movie) {
  for (let i = 0; i < 5; i++) {
    let movieReview;
    
    if (movie[i].vote_count > 999)
      movieReview = movie[i].vote_count / 1000;
    else
      movieReview = movie[i].vote_count;

    movieTitles[i].innerText = movie[i].title;
    movieParags[i].innerText = movie[i].overview;
    movieReviews[i].innerText =
      `(${movieReview} reviews)`;

    fillStars(movie[i], i);
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
  for (let i = 0; i < 20; i++) {
    let ul = document.querySelector(`.${ulName}`);
    let li = document.createElement('li');
    let img = document.createElement('img');

    ul.appendChild(li);
    li.appendChild(img)
    li.classList.add('movie-card')
    img.classList.add('movie-card')
    img.src = CARD_PATH + movie[i].poster_path;
    console.log(ul);
  }
}

let autoStart = setInterval(autoTranslate, 4000);

getMovies(POPULAR_MOVIES);
getMovies(POPULAR_TV);
getMovies(NOW_PLAYING);