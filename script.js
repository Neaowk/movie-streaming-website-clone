const apiUrl = "http://www.omdbapi.com/?apikey=80fe2db5&s="; // OMDb API URL with API key

// Function to fetch movie suggestions from OMDb
async function fetchMovieSuggestions(query) {
  try {
    const response = await fetch(apiUrl + query);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    
    if (data.Response === "True") {
      displayMovieSuggestions(data.Search);
    } else {
      console.error('No movies found or invalid search query');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to display movie suggestions
function displayMovieSuggestions(movies) {
  const suggestionList = document.getElementById('suggestionList');
  suggestionList.innerHTML = '';

  movies.forEach(movie => {
    const suggestionItem = document.createElement('div');
    suggestionItem.classList.add('suggestion-item');
    suggestionItem.innerHTML = `<p>${movie.Title} (${movie.Year})</p>`;
    suggestionItem.addEventListener('click', () => {
      document.getElementById('searchBar').value = movie.Title;
      document.getElementById('suggestionList').innerHTML = '';
      document.getElementById('suggestionList').style.display = 'none';
      document.getElementById('suggestionList').style.visibility = 'hidden';
    });
    suggestionList.appendChild(suggestionItem);
  });

  suggestionList.style.display = movies.length ? 'block' : 'none';
  suggestionList.style.visibility = movies.length ? 'visible' : 'hidden';
}

// Event listener for the search bar input to fetch suggestions
document.getElementById('searchBar').addEventListener('input', (event) => {
  const query = event.target.value.trim();
  if (query.length > 2) {
    fetchMovieSuggestions(query);
  } else {
    document.getElementById('suggestionList').innerHTML = '';
    document.getElementById('suggestionList').style.display = 'none';
    document.getElementById('suggestionList').style.visibility = 'hidden';
  }
  document.getElementById('searchBar').classList.remove('error');
});

// Function to fetch movie data from OMDb
async function fetchMovies(query) {
  try {
    const response = await fetch(apiUrl + query);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    
    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      console.error('No movies found or invalid search query');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to display movie results
function displayMovies(movies) {
  const movieList = document.getElementById('moviesContainer');
  movieList.innerHTML = '';

  if (movies.length > 0) {
    movieList.style.display = 'flex';
  } else {
    movieList.style.display = 'none';
  }

  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    movieElement.innerHTML = `
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <img src="${movie.Poster}" alt="${movie.Title} poster">
      <button class="read-more-btn" data-imdbid="${movie.imdbID}">Read More</button>
    `;
    movieList.appendChild(movieElement);

    // Add click event listener to toggle "Read More" button
    movieElement.addEventListener('click', () => {
      const currentlyActive = document.querySelector('.movie.show-read-more');
      if (currentlyActive && currentlyActive !== movieElement) {
        currentlyActive.classList.remove('show-read-more');
      }
      movieElement.classList.toggle('show-read-more');
    });
  });

  // Add event listeners to "Read More" buttons
  const readMoreButtons = document.querySelectorAll('.read-more-btn');
  readMoreButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const imdbID = event.target.getAttribute('data-imdbid');
      window.open(`https://www.imdb.com/title/${imdbID}/`, '_blank');
    });
  });
}

// Event listener for the Explore Now button to fetch full results
document.getElementById('exploreBtn').addEventListener('click', () => {
  const searchBar = document.getElementById('searchBar');
  const query = searchBar.value.trim();
  if (query) {
    fetchMovies(query);
  } else {
    searchBar.classList.add('error');
  }
  document.getElementById('suggestionList').innerHTML = '';
  document.getElementById('suggestionList').style.display = 'none';
  document.getElementById('suggestionList').style.visibility = 'hidden';
  scrollToMovies();
});

// Hero section background change
const heroImages = [
  "assets/superheroes.avif",
  "assets/thriller.webp",
  "assets/pixar.jpg",
  "assets/jurassic-world-rebirth.avif",
  "assets/kurayukaba_kuramerukagari.webp"
];

const heroSection = document.querySelector('.hero-section');
let currentIndex = 0;

function changeBackground() {
  currentIndex = (currentIndex + 1) % heroImages.length;
  heroSection.style.backgroundImage = `url('${heroImages[currentIndex]}')`;
}

changeBackground();
setInterval(changeBackground, 5000);

// Function to display movie or show cards
function displayCards(type, results, targetElement) {
  results.forEach((item) => {
    const div = document.createElement('div');
    div.classList.add('card');
    const title = type === 'movie' ? item.title : item.name;
    const releaseDate = type === 'movie' ? item.release_date : item.first_air_date;
    const posterPath = item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : '../images/no-image.jpg';

    div.innerHTML = `
      <a href="${type}-details.html?id=${item.id}">
        <img src="${posterPath}" class="card-img-top" alt="${title}" />
      </a>
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text"><small class="text-muted">Release: ${releaseDate}</small></p>
      </div>
    `;
    document.querySelector(targetElement).appendChild(div);
  });
}

// Function to display popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  displayCards('movie', results, '#popular-movies');
}

// Function to display popular shows
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');
  displayCards('tv', results, '#popular-shows');
}

// Function to display movie or show details
async function displayDetails(type, id) {
  const data = await fetchAPIData(`${type}/${id}`);
  const { backdrop_path, poster_path, title, name, vote_average, release_date, first_air_date, overview, genres, budget, revenue, runtime, status, production_companies } = data;

  const div = document.createElement('div');
  div.innerHTML = `
    <div class="details-top">
      <div>
        <img src="${poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : '../images/no-image.jpg'}" class="card-img-top" alt="${title || name}" />
      </div>
      <div>
        <h2>${title || name}</h2>
        <p><i class="fas fa-star text-primary"></i> ${vote_average.toFixed(1)} / 10</p>
        <p class="text-muted">${type === 'movie' ? 'Release' : 'Last Air'} Date: ${type === 'movie' ? release_date : first_air_date}</p>
        <p>${overview}</p>
        <h5>Genres</h5>
        <ul class="list-group">${genres.map((genre) => `<li>${genre.name}</li>`).join('')}</ul>
        <a href="${data.homepage}" target="_blank" class="btn">Visit ${type === 'movie' ? 'Movie' : 'Show'} Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>${type === 'movie' ? 'Movie' : 'Show'} Info</h2>
      <ul>
        <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(budget)}</li>
        <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(revenue)}</li>
        <li><span class="text-secondary">Runtime:</span> ${runtime} minutes</li>
        <li><span class="text-secondary">Status:</span> ${status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}</div>
    </div>
  `;

  document.querySelector(`#${type}-details`).appendChild(div);
  displayBackgroundImage(type, backdrop_path);
}

// Function to display movie details
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  displayDetails('movie', movieId);
}

// Function to display show details
async function displayShowDetails() {
  const showId = window.location.search.split('=')[1];
  displayDetails('tv', showId);
}

// Function to scroll to movie results
function scrollToMovies() {
  const moviesContainer = document.getElementById('moviesContainer');
  if (moviesContainer) {
    moviesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Fetch movies and scroll to results
document.getElementById('exploreBtn').addEventListener('click', () => {
  const searchBar = document.getElementById('searchBar');
  const query = searchBar.value.trim();
  if (query) {
    fetchMovies(query);
  } else {
    searchBar.classList.add('error');
  }
  document.getElementById('suggestionList').innerHTML = '';
  document.getElementById('suggestionList').style.display = 'none';
  document.getElementById('suggestionList').style.visibility = 'hidden';
  scrollToMovies();
});

// Trigger search on input and optionally scroll to results
document.getElementById('searchBar').addEventListener('input', (event) => {
  const query = event.target.value.trim();
  if (query.length > 2) {
    fetchMovieSuggestions(query);
  } else {
    document.getElementById('suggestionList').innerHTML = '';
    document.getElementById('suggestionList').style.display = 'none';
    document.getElementById('suggestionList').style.visibility = 'hidden';
  }
  document.getElementById('searchBar').classList.remove('error');
});