import { tvSeriesAPI } from './api.js';
import { state, showError, showSuccess, showLoading, hideLoading, formatDuration, formatRating } from './utils.js';
import auth from './auth.js';

// TV Series handler
const tvSeries = {
    // Load all TV series
    loadTVSeries: async (params = {}) => {
        try {
            showLoading();
            const series = await tvSeriesAPI.getAll(params);
            state.setTVSeries(series);
            return series;
        } catch (error) {
            showError(error.message || 'Failed to load TV series');
            return [];
        } finally {
            hideLoading();
        }
    },

    // Load single TV series
    loadTVSeriesById: async (id) => {
        try {
            showLoading();
            const series = await tvSeriesAPI.getById(id);
            return series;
        } catch (error) {
            showError(error.message || 'Failed to load TV series');
            return null;
        } finally {
            hideLoading();
        }
    },

    // Add comment to TV series
    addComment: async (seriesId, comment) => {
        if (!auth.isAuthenticated()) {
            showError('Please login to comment');
            return false;
        }

        try {
            await tvSeriesAPI.addComment(seriesId, comment);
            showSuccess('Comment added successfully');
            return true;
        } catch (error) {
            showError(error.message || 'Failed to add comment');
            return false;
        }
    },

    // Like TV series
    like: async (seriesId) => {
        if (!auth.isAuthenticated()) {
            showError('Please login to like TV series');
            return false;
        }

        try {
            await tvSeriesAPI.like(seriesId);
            return true;
        } catch (error) {
            showError(error.message || 'Failed to like TV series');
            return false;
        }
    },

    // Dislike TV series
    dislike: async (seriesId) => {
        if (!auth.isAuthenticated()) {
            showError('Please login to rate TV series');
            return false;
        }

        try {
            await tvSeriesAPI.dislike(seriesId);
            return true;
        } catch (error) {
            showError(error.message || 'Failed to dislike TV series');
            return false;
        }
    },

    // Format TV series data for display
    formatTVSeries: (series) => {
        return {
            ...series,
            rating: formatRating(series.rating),
            startYear: new Date(series.startYear).getFullYear(),
            endYear: series.endYear ? new Date(series.endYear).getFullYear() : 'Present',
            seasons: series.seasons.map(season => ({
                ...season,
                episodes: season.episodes.map(episode => ({
                    ...episode,
                    duration: formatDuration(episode.duration)
                }))
            }))
        };
    },

    // Filter TV series by genre
    filterByGenre: (genre) => {
        const allSeries = state.getTVSeries();
        return genre ? allSeries.filter(series => series.genre.includes(genre)) : allSeries;
    },

    // Search TV series
    searchTVSeries: (query) => {
        const allSeries = state.getTVSeries();
        const searchQuery = query.toLowerCase();
        return allSeries.filter(series => 
            series.title.toLowerCase().includes(searchQuery) ||
            series.description.toLowerCase().includes(searchQuery)
        );
    },

    // Sort TV series
    sortTVSeries: (sortBy) => {
        const allSeries = state.getTVSeries();
        switch (sortBy) {
            case 'rating':
                return [...allSeries].sort((a, b) => b.rating - a.rating);
            case 'newest':
                return [...allSeries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return [...allSeries].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            default:
                return allSeries;
        }
    },

    // Get episode by ID
    getEpisode: (series, seasonNumber, episodeNumber) => {
        const season = series.seasons.find(s => s.seasonNumber === seasonNumber);
        if (!season) return null;
        return season.episodes.find(e => e.episodeNumber === episodeNumber);
    },

    // Get next episode
    getNextEpisode: (series, currentSeason, currentEpisode) => {
        const season = series.seasons.find(s => s.seasonNumber === currentSeason);
        if (!season) return null;

        const currentEpisodeIndex = season.episodes.findIndex(e => e.episodeNumber === currentEpisode);
        if (currentEpisodeIndex === -1) return null;

        // Check if there's a next episode in the current season
        if (currentEpisodeIndex < season.episodes.length - 1) {
            return {
                season: currentSeason,
                episode: season.episodes[currentEpisodeIndex + 1].episodeNumber
            };
        }

        // Check if there's a next season
        const currentSeasonIndex = series.seasons.findIndex(s => s.seasonNumber === currentSeason);
        if (currentSeasonIndex < series.seasons.length - 1) {
            const nextSeason = series.seasons[currentSeasonIndex + 1];
            return {
                season: nextSeason.seasonNumber,
                episode: nextSeason.episodes[0].episodeNumber
            };
        }

        return null;
    },

    // Get previous episode
    getPreviousEpisode: (series, currentSeason, currentEpisode) => {
        const season = series.seasons.find(s => s.seasonNumber === currentSeason);
        if (!season) return null;

        const currentEpisodeIndex = season.episodes.findIndex(e => e.episodeNumber === currentEpisode);
        if (currentEpisodeIndex === -1) return null;

        // Check if there's a previous episode in the current season
        if (currentEpisodeIndex > 0) {
            return {
                season: currentSeason,
                episode: season.episodes[currentEpisodeIndex - 1].episodeNumber
            };
        }

        // Check if there's a previous season
        const currentSeasonIndex = series.seasons.findIndex(s => s.seasonNumber === currentSeason);
        if (currentSeasonIndex > 0) {
            const previousSeason = series.seasons[currentSeasonIndex - 1];
            return {
                season: previousSeason.seasonNumber,
                episode: previousSeason.episodes[previousSeason.episodes.length - 1].episodeNumber
            };
        }

        return null;
    }
};

// Export TV series handler
export default tvSeries; 