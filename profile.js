// Profile Management Class
class ProfileManager {
    constructor() {
        this.profiles = JSON.parse(localStorage.getItem('profiles')) || [
            { id: 1, name: 'Superhero', color: '#E50914', isActive: true },
            { id: 2, name: 'Batman', color: '#2B2B2B', isActive: false },
            { id: 3, name: 'Spider-Man', color: '#831010', isActive: false }
        ];
        this.currentProfile = this.profiles.find(profile => profile.isActive);
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateGridLayout();
        this.renderProfiles();
    }

    setupEventListeners() {
        // Modal elements
        this.modal = document.getElementById('addProfileModal');
        this.addProfileBtn = document.getElementById('addProfileBtn');
        this.closeModal = document.querySelector('.close-modal');
        this.addProfileForm = document.getElementById('addProfileForm');
        this.avatarOptions = document.querySelectorAll('.avatar-option');

        // Event listeners
        window.addEventListener('resize', () => this.updateGridLayout());
        this.addProfileBtn.addEventListener('click', () => this.showModal());
        this.closeModal.addEventListener('click', () => this.hideModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hideModal();
        });

        // Avatar selection
        this.avatarOptions.forEach(option => {
            option.addEventListener('click', () => this.selectAvatar(option));
        });

        // Form submission
        this.addProfileForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Profile selection
        document.querySelector('.profiles-grid').addEventListener('click', (e) => {
            const profileItem = e.target.closest('.profile-item');
            if (profileItem && !profileItem.classList.contains('add-profile')) {
                const profileId = parseInt(profileItem.dataset.id);
                this.selectProfile(profileId);
            }
        });
    }

    updateGridLayout() {
        const profilesGrid = document.querySelector('.profiles-grid');
        const width = window.innerWidth;
        
        if (width <= 768) {
            profilesGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else if (width <= 1024) {
            profilesGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        } else {
            profilesGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }
    }

    showModal() {
        this.modal.style.display = 'flex';
        this.modal.style.opacity = '0';
        setTimeout(() => {
            this.modal.style.opacity = '1';
        }, 10);
    }

    hideModal() {
        this.modal.style.opacity = '0';
        setTimeout(() => {
            this.modal.style.display = 'none';
        }, 300);
    }

    selectAvatar(option) {
        this.avatarOptions.forEach(opt => {
            opt.classList.remove('selected');
            opt.style.transform = 'scale(1)';
        });
        option.classList.add('selected');
        option.style.transform = 'scale(1.1)';
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const profileName = document.getElementById('profileName').value;
        const selectedColor = document.querySelector('.avatar-option.selected').style.backgroundColor;
        
        const newProfile = {
            id: this.profiles.length + 1,
            name: profileName,
            color: selectedColor,
            isActive: false
        };

        this.profiles.push(newProfile);
        this.saveProfiles();
        this.renderProfiles();
        
        this.hideModal();
        this.addProfileForm.reset();
        this.avatarOptions[0].classList.add('selected');
    }

    selectProfile(profileId) {
        this.profiles.forEach(profile => {
            profile.isActive = profile.id === profileId;
        });
        this.saveProfiles();
        this.renderProfiles();
        
        // Redirect to home page after profile selection
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }

    renderProfiles() {
        const profilesGrid = document.querySelector('.profiles-grid');
        const addProfileBtn = document.querySelector('.add-profile');
        
        // Clear existing profiles
        profilesGrid.innerHTML = '';
        
        // Render profiles
        this.profiles.forEach(profile => {
            const profileElement = document.createElement('div');
            profileElement.className = 'profile-item';
            profileElement.dataset.id = profile.id;
            
            profileElement.innerHTML = `
                <div class="profile-avatar ${profile.isActive ? 'active' : ''}" style="background-color: ${profile.color}">
                    <i class="fas fa-user"></i>
                </div>
                <div class="profile-name">${profile.name}</div>
            `;
            
            profilesGrid.appendChild(profileElement);
        });
        
        // Add back the "Add Profile" button
        profilesGrid.appendChild(addProfileBtn);
    }

    saveProfiles() {
        localStorage.setItem('profiles', JSON.stringify(this.profiles));
    }
}

// Initialize Profile Manager
document.addEventListener('DOMContentLoaded', () => {
    const profileManager = new ProfileManager();
}); 