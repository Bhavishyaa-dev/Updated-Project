class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchModal = document.querySelector('.search-modal');
        this.searchResults = document.querySelector('.search-results');
        this.closeSearchBtn = document.querySelector('.close-search');
        this.searchIcon = document.querySelector('.fa-magnifying-glass');
        this.searchTimeout = null;
        this.isSearchOpen = false;
        this.apiKey = 'e547e17d4e91f3e62a571655cd1ccaff'; // TMDB API key

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Open search modal when clicking search icon
        this.searchIcon.addEventListener('click', () => this.openSearch());

        // Close search modal when clicking close button
        this.closeSearchBtn.addEventListener('click', () => this.closeSearch());

        // Handle search input
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length >= 2) {
                this.searchTimeout = setTimeout(() => this.performSearch(query), 300);
            } else {
                this.searchResults.innerHTML = '';
            }
        });

        // Close search on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isSearchOpen) {
                this.closeSearch();
            }
        });

        // Close search when clicking outside
        this.searchModal.addEventListener('click', (e) => {
            if (e.target === this.searchModal) {
                this.closeSearch();
            }
        });
    }

    openSearch() {
        this.searchModal.classList.add('show');
        this.searchInput.focus();
        this.isSearchOpen = true;
        document.body.style.overflow = 'hidden';
    }

    closeSearch() {
        this.searchModal.classList.remove('show');
        this.searchInput.value = '';
        this.searchResults.innerHTML = '';
        this.isSearchOpen = false;
        document.body.style.overflow = '';
    }

    async performSearch(query) {
        try {
            // Show loading state
            this.searchResults.innerHTML = '<div class="search-loading">Searching...</div>';

            // Make API call to search movies and TV shows
            const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=1`);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                this.displayResults(data.results);
            } else {
                this.searchResults.innerHTML = '<div class="no-results">No results found</div>';
            }
        } catch (error) {
            console.error('Search error:', error);
            this.searchResults.innerHTML = '<div class="search-error">Error performing search. Please try again.</div>';
        }
    }

    displayResults(results) {
        const html = results
            .filter(result => result.poster_path) // Only show results with posters
            .map(result => `
                <div class="search-result-item" data-id="${result.id}" data-type="${result.media_type}">
                    <div class="result-poster" style="background-image: url('https://image.tmdb.org/t/p/w92${result.poster_path}')"></div>
                    <div class="result-info">
                        <h3>${result.title || result.name}</h3>
                        <p>${result.release_date ? result.release_date.split('-')[0] : 'N/A'}</p>
                    </div>
                </div>
            `)
            .join('');

        this.searchResults.innerHTML = html;

        // Add click handlers to results
        const resultItems = this.searchResults.querySelectorAll('.search-result-item');
        resultItems.forEach(item => {
            item.addEventListener('click', () => this.handleResultClick(item));
        });
    }

    handleResultClick(item) {
        const id = item.dataset.id;
        const type = item.dataset.type;
        // Handle navigation to detail page
        window.location.href = `detail.html?id=${id}&type=${type}`;
    }
}

// Initialize search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SearchManager();
}); 