// State management
let currentUser = null;
let movies = [];
let tvSeries = [];

// Event listeners
const listeners = {
    auth: [],
    movies: [],
    tvSeries: []
};

// State management functions
const state = {
    setUser: (user) => {
        currentUser = user;
        notifyListeners('auth');
    },

    setMovies: (newMovies) => {
        movies = newMovies;
        notifyListeners('movies');
    },

    setTVSeries: (newSeries) => {
        tvSeries = newSeries;
        notifyListeners('tvSeries');
    },

    getUser: () => currentUser,
    getMovies: () => movies,
    getTVSeries: () => tvSeries
};

// Event handling
const subscribe = (event, callback) => {
    if (!listeners[event]) return;
    listeners[event].push(callback);
    return () => {
        listeners[event] = listeners[event].filter(cb => cb !== callback);
    };
};

const notifyListeners = (event) => {
    if (!listeners[event]) return;
    listeners[event].forEach(callback => callback());
};

// UI Helper functions
const showLoading = () => {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
};

const hideLoading = () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.remove();
    }
};

const showError = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
};

const showSuccess = (message) => {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
};

// Form validation
const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
    return password.length >= 6;
};

// Formatting functions
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

const formatRating = (rating) => {
    return rating.toFixed(1);
};

// Export utilities
export {
    state,
    subscribe,
    showLoading,
    hideLoading,
    showError,
    showSuccess,
    validateEmail,
    validatePassword,
    formatDate,
    formatDuration,
    formatRating
}; 