// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Swiper
    new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        effect: "fade",
        grabCursor: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        }
    });

    // Initialize Owl Carousel
    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
            0: { items: 1 },
            600: { items: 2 },
            900: { items: 3 },
            1200: { items: 4 }
        }
    });

    // Mobile menu functionality
    const openBtn = document.querySelector('#open');
    const closeBtn = document.querySelector('#close');
    const navItems = document.querySelector('.nav-items');

    openBtn.addEventListener('click', () => {
        navItems.style.right = '0';
        openBtn.style.display = 'none';
        closeBtn.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        navItems.style.right = '-100%';
        openBtn.style.display = 'block';
        closeBtn.style.display = 'none';
    });

    // Category filter functionality
    const categoryButtons = document.querySelectorAll('.movies-ctg .btn');
    const movieCards = document.querySelectorAll('.cards[data-category]');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.textContent.toLowerCase();
            
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            movieCards.forEach(card => {
                const cardCategory = card.dataset.category;
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Simple scroll behavior
    let lastScroll = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > header.offsetHeight) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Newsletter subscription functionality
    const emailInput = document.getElementById('emailInput');
    const subscribeBtn = document.getElementById('subscribeBtn');
    const subscribeMessage = document.getElementById('subscribeMessage');
    let isSubmitting = false;

    // Function to request notification permission
    async function requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    // Function to show browser notification
    function showBrowserNotification(email) {
        if (!("Notification" in window)) {
            console.log("This browser does not support notifications");
            return;
        }

        const notification = new Notification("Welcome to Streamix!", {
            body: `Thank you for subscribing with ${email}! You'll receive updates about new movies and TV shows.`,
            icon: "https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
            badge: "https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
            tag: "newsletter-subscription",
            data: {
                url: window.location.href
            },
            actions: [
                {
                    action: "explore",
                    title: "Explore Movies"
                },
                {
                    action: "close",
                    title: "Close"
                }
            ]
        });

        notification.onclick = function(event) {
            event.preventDefault();
            if (event.action === "explore") {
                window.focus();
            }
            notification.close();
        };
    }

    // Function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to show message with animation
    function showMessage(message, isError = false) {
        subscribeMessage.textContent = message;
        subscribeMessage.className = `subscribe-message ${isError ? 'error' : 'success'}`;
        subscribeMessage.style.display = 'block';
        
        // Add loading state to button
        if (!isError) {
            subscribeBtn.disabled = true;
            subscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        }
        
        // Simulate API call
        setTimeout(() => {
            if (!isError) {
                subscribeBtn.disabled = false;
                subscribeBtn.innerHTML = 'Subscribe Now';
                emailInput.value = '';
            }
            
            // Hide message after 5 seconds
            setTimeout(() => {
                subscribeMessage.style.display = 'none';
            }, 5000);
        }, 2000);
    }

    // Function to handle subscription
    async function handleSubscription(email) {
        if (isSubmitting) return;
        isSubmitting = true;

        try {
            // Here you would typically make an API call to your server
            // For now, we'll simulate a successful subscription
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Store email in localStorage to prevent duplicate subscriptions
            const subscribedEmails = JSON.parse(localStorage.getItem('subscribedEmails') || '[]');
            if (!subscribedEmails.includes(email)) {
                subscribedEmails.push(email);
                localStorage.setItem('subscribedEmails', JSON.stringify(subscribedEmails));
                
                // Request notification permission and show notification
                const hasPermission = await requestNotificationPermission();
                if (hasPermission) {
                    showBrowserNotification(email);
                }
                
                showMessage('Thank you for subscribing! You\'ll receive our newsletter soon.');
            } else {
                showMessage('You\'re already subscribed to our newsletter!', true);
            }
        } catch (error) {
            showMessage('Something went wrong. Please try again later.', true);
        } finally {
            isSubmitting = false;
        }
    }

    // Handle subscription button click
    subscribeBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();

        if (!email) {
            showMessage('Please enter your email address', true);
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address', true);
            return;
        }

        handleSubscription(email);
    });

    // Handle Enter key press
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            subscribeBtn.click();
        }
    });

    // Add input validation feedback
    emailInput.addEventListener('input', () => {
        const email = emailInput.value.trim();
        if (email && !isValidEmail(email)) {
            emailInput.style.borderColor = '#dc3545';
        } else {
            emailInput.style.borderColor = 'rgba(255,255,255,0.1)';
        }
    });

    // Check if email is already subscribed on page load
    emailInput.addEventListener('focus', () => {
        const email = emailInput.value.trim();
        if (email) {
            const subscribedEmails = JSON.parse(localStorage.getItem('subscribedEmails') || '[]');
            if (subscribedEmails.includes(email)) {
                showMessage('You\'re already subscribed to our newsletter!', true);
            }
        }
    });

    // Movie trailer functionality
    const modal = document.getElementById('trailerModal');
    const trailerFrame = document.getElementById('trailerFrame');
    const closeModal = document.querySelector('.close-modal');

    // Movie trailer IDs (you can add more as needed)
    const movieTrailers = {
        'Spider-Man: No Way Home': 'JfVOs4VSpmA',
        'MATRIX RESURRECTION': '9ix7TUGVYIo',
        'THOR LOVE AND THUNDER': 'Go8nTmfrQdY',
        'THE BLUE PALE': 'dQw4w9WgXcQ',
        'THE BATMAN': 'mqqft2x_Aa4'
    };

    // Function to open trailer modal
    function openTrailerModal(movieTitle) {
        const trailerId = movieTrailers[movieTitle];
        if (trailerId) {
            trailerFrame.src = `https://www.youtube.com/embed/${trailerId}?autoplay=1`;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            alert('Trailer not available for this movie.');
        }
    }

    // Function to close trailer modal
    function closeTrailerModal() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
        trailerFrame.src = ''; // Clear the iframe source
    }

    // Add click event listeners to all Watch Now and Watch Trailer buttons
    document.querySelectorAll('.movie-btn button').forEach(button => {
        button.addEventListener('click', () => {
            const movieTitle = button.closest('.swiper-slide').querySelector('.movie-title h2').textContent;
            openTrailerModal(movieTitle);
        });
    });

    // Close modal when clicking the close button
    closeModal.addEventListener('click', closeTrailerModal);

    // Close modal when clicking outside the video
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeTrailerModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeTrailerModal();
        }
    });

    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-items a[href^="#"]');
    
    // Add click event listener to each link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the target section id from the href
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close the mobile menu if it's open
                const navItems = document.querySelector('.nav-items');
                const closeBtn = document.getElementById('close');
                if (navItems.classList.contains('active')) {
                    closeBtn.click();
                }
                
                // Scroll to the target section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Example JavaScript to enhance the privacy policy page
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.addEventListener('click', () => {
            section.classList.toggle('expanded');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const faqs = document.querySelectorAll('.faq h3');
    faqs.forEach(faq => {
        faq.addEventListener('click', () => {
            const answer = faq.nextElementSibling;
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        });
    });

    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Your message has been submitted. We will get back to you shortly.');
        contactForm.reset();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const profiles = document.querySelectorAll('.profile');
    const modal = document.getElementById('profile-modal');
    const closeModal = document.querySelector('.close');
    const profileForm = document.getElementById('profile-form');

    profiles.forEach(profile => {
        profile.addEventListener('click', () => {
            if (profile.dataset.name === 'Add Profile') {
                modal.style.display = 'block';
            } else {
                alert(`Profile ${profile.dataset.name} selected.`);
            }
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    profileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const profileName = document.getElementById('profile-name').value;
        alert(`Profile ${profileName} created.`);
        modal.style.display = 'none';
        profileForm.reset();
    });
});