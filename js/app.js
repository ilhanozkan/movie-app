const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1';
const GENRES = 'https://api.themoviedb.org/3/genre/movie/list?api_key=04c35731a5ee918f014970082a0088b1&language=en-US';
const IMG_PATH = 'https://image.tmdb.org/t/p/original';

const inceptionImg = '../img/inception-backdrop-path.jpg';
const inceptionTitle = 'Inception';
const inceptionParag = `Cobb, a skilled thief who commits corporate
 espionage by infiltrating the subconscious of his targets is offered
 a chance to regain his old life as payment for a task considered to
 be impossible: "inception", the implantation of another person's
 idea into a target's subconscious.`;
const inceptionReview = 28756;
const inceptionStar = 8.3;

const sliderImgContainer = document.querySelector('.slider-imgs');
const sliderImgs = document.querySelectorAll('.slider-img');
const stars = document.querySelectorAll('.star');
const movieTitle = document.querySelector('.movie-title');
const movieParag = document.querySelector('.movie-p');
const movieReview = document.querySelector('.reviews');

async function getMovies(url) {
  const response = await fetch(url);
  const data = await response.json();

  setImages(data.results);
  addMovieDesc(data.results);
}

function setImages(movie) {
  let i = 0;
  
  movie[3].backdrop_path = inceptionImg;
  movie[3].title = inceptionTitle;
  movie[3].overview = inceptionParag;
  movie[3].vote_count = inceptionReview;
  movie[3].vote_average = inceptionStar;
  movie[3].overview = inceptionParag;

  sliderImgs.forEach((img) => {
    if (i == 3) sliderImgs[i].src = inceptionImg;
    else {
      img.src = IMG_PATH + movie[i].backdrop_path;
    }

    i++;
  });
}

function addMovieDesc(movie) {
  movieTitle.innerText = movie[0].title;
  movieParag.innerText = movie[0].overview;

  fillStars(movie, 0);

  if (movie[0].vote_count > 999)
    movieReview.innerText += `(${movie[0].vote_count / 1000} reviews)`;
  else
    movieReview.innerText += `(${movie[0].vote_count} reviews)`;

  document.querySelector('.slider-buttons').addEventListener('click', (btn) => {
    clearInterval(autoStart);

    const index = btn.target.dataset.id;

    sliderImgs.forEach((e) => imgTranslate(e, index));

    if (index) {
      movieTitle.innerText = movie[index].title;
      movieParag.innerText = movie[index].overview;
      
      if (movie[index].vote_count > 999) movieReview.innerText = `(${movie[index].vote_count / 1000} reviews)`;
      else movieReview.innerText = `(${movie[index].vote_count} reviews)`;
    }

    let startAgain = setInterval(autoTranslate, 5000);

    fillStars(movie, index);
  });
}

function fillStars(movie, index) {
  if (!movie[index]) return 0;

  const movieStar = movie[index].vote_average;
  const filledStar = Math.floor(movieStar / 2);
  const fraction = (movieStar - Math.floor(movieStar));


  stars.forEach(star => star.style.background = '');

  for (let filledIndex = 1; filledIndex <= filledStar; filledIndex++) {
    document.querySelector(`#star-${filledIndex}`).style.background = `#ffc107`;
  }

  document.querySelector(`#star-${filledStar + 1}`).style.background = 
    `linear-gradient(90deg, #ffc107 ${fraction.toFixed(2) * 100}%, rgba(179, 179, 179, 0.3)0%)`;

  console.log('filled', filledStar, 'fraction', fraction.toFixed(2) * 100);
}

let index = 1;

function autoTranslate() {
  if (index == sliderImgs.length) index = 0;

  sliderImgs.forEach(e => e.style.transform = `translate(-${index * 100}%, -30%)`);
  index++;
}

function imgTranslate(img, index) {
  img.style.transform = `translate(-${(index * 100)}%, -30%)`;
}

let autoStart = setInterval(autoTranslate, 5000);

getMovies(API_URL);