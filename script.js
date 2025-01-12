// Replace with your actual TMDB API key
const apiKey = 'YOUR_API_KEY';
const apiUrl = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=';

// Select DOM elements
const searchBar = document.getElementById('searchBar');
const moviesContainer = document.getElementById('moviesContainer');
const exploreBtn = document.getElementById('exploreBtn');

// Function to fetch and display movie data
async function fetchMovies(query) {
    try {
        const response = await fetch(apiUrl + query);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to display movie results
function displayMovies(movies) {
    moviesContainer.innerHTML = ''; // Clear any previous search results
    if (movies.length === 0) {
        moviesContainer.innerHTML = '<p>No movies found.</p>';
    } else {
        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-card');
            movieElement.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movie.release_date}</p>
                <p>${movie.overview}</p>
            `;
            moviesContainer.appendChild(movieElement);
        });
    }
}

// Event listener for search input
searchBar.addEventListener('input', (event) => {
    const query = event.target.value.trim();
    if (query.length > 2) {
        fetchMovies(query); // Trigger search when input is greater than 2 characters
    } else {
        moviesContainer.innerHTML = ''; // Clear results if input is too short
    }
});

// Optional: Clicking on "Explore Now" button can also trigger search (e.g., search for popular movies or specific genres)
exploreBtn.addEventListener('click', () => {
    fetchMovies('action'); // Example: Search for action movies when the button is clicked
});

// Hero section and background change (unchanged)
const heroImages = [
    "assets/superheroes.webp",
    "assets/thriller.webp",
    "assets/pixar.jpg",
    "assets/jurassic-world-rebirth.jpg",
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
