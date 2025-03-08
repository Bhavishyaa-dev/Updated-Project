import { moviesAPI } from './api.js';
import { state, showError, showSuccess, showLoading, hideLoading, formatDuration, formatRating } from './utils.js';
import auth from './auth.js';

// Movie handler
const movies = {
    // Load all movies
    loadMovies: async (params = {}) => {
        try {
            showLoading();
            const movies = await moviesAPI.getAll(params);
            state.setMovies(movies);
            return movies;
        } catch (error) {
            showError(error.message || 'Failed to load movies');
            return [];
        } finally {
            hideLoading();
        }
    },

    // Load single movie
    loadMovie: async (id) => {
        try {
            showLoading();
            const movie = await moviesAPI.getById(id);
            return movie;
        } catch (error) {
            showError(error.message || 'Failed to load movie');
            return null;
        } finally {
            hideLoading();
        }
    },

    // Add movie to watchlist
    addToWatchlist: async (movieId) => {
        if (!auth.isAuthenticated()) {
            showError('Please login to add movies to your watchlist');
            return false;
        }

        try {
            await moviesAPI.addToWatchlist(movieId);
            showSuccess('Added to watchlist');
            return true;
        } catch (error) {
            showError(error.message || 'Failed to add to watchlist');
            return false;
        }
    },

    // Remove movie from watchlist
    removeFromWatchlist: async (movieId) => {
        if (!auth.isAuthenticated()) {
            showError('Please login to manage your watchlist');
            return false;
        }

        try {
            await moviesAPI.removeFromWatchlist(movieId);
            showSuccess('Removed from watchlist');
            return true;
        } catch (error) {
            showError(error.message || 'Failed to remove from watchlist');
            return false;
        }
    },

    // Get user's watchlist
    getWatchlist: async () => {
        if (!auth.isAuthenticated()) {
            showError('Please login to view your watchlist');
            return [];
        }

        try {
            showLoading();
            const watchlist = await moviesAPI.getWatchlist();
            return watchlist;
        } catch (error) {
            showError(error.message || 'Failed to load watchlist');
            return [];
        } finally {
            hideLoading();
        }
    },

    // Add comment to movie
    addComment: async (movieId, comment) => {
        if (!auth.isAuthenticated()) {
            showError('Please login to comment');
            return false;
        }

        try {
            await moviesAPI.addComment(movieId, comment);
            showSuccess('Comment added successfully');
            return true;
        } catch (error) {
            showError(error.message || 'Failed to add comment');
            return false;
        }
    },

    // Like movie
    like: async (movieId) => {
        if (!auth.isAuthenticated()) {
            showError('Please login to like movies');
            return false;
        }

        try {
            await moviesAPI.like(movieId);
            return true;
        } catch (error) {
            showError(error.message || 'Failed to like movie');
            return false;
        }
    },

    // Dislike movie
    dislike: async (movieId) => {
        if (!auth.isAuthenticated()) {
            showError('Please login to rate movies');
            return false;
        }

        try {
            await moviesAPI.dislike(movieId);
            return true;
        } catch (error) {
            showError(error.message || 'Failed to dislike movie');
            return false;
        }
    },

    // Format movie data for display
    formatMovie: (movie) => {
        return {
            ...movie,
            duration: formatDuration(movie.duration),
            rating: formatRating(movie.rating),
            releaseYear: new Date(movie.releaseYear).getFullYear()
        };
    },

    // Filter movies by genre
    filterByGenre: (genre) => {
        const allMovies = state.getMovies();
        return genre ? allMovies.filter(movie => movie.genre.includes(genre)) : allMovies;
    },

    // Search movies
    searchMovies: (query) => {
        const allMovies = state.getMovies();
        const searchQuery = query.toLowerCase();
        return allMovies.filter(movie => 
            movie.title.toLowerCase().includes(searchQuery) ||
            movie.description.toLowerCase().includes(searchQuery)
        );
    },

    // Sort movies
    sortMovies: (sortBy) => {
        const allMovies = state.getMovies();
        switch (sortBy) {
            case 'rating':
                return [...allMovies].sort((a, b) => b.rating - a.rating);
            case 'newest':
                return [...allMovies].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return [...allMovies].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            default:
                return allMovies;
        }
    }
};

// Export movie handler
export default movies; 