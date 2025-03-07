// Fetch the JSON data first
fetch('./watch-data.json')
    .then(response => response.json())
    .then(data => {
        initApp(data.watches); // Call initApp only after data is fetched
    })
    .catch(error => {
        console.error('Error loading watch data:', error);
        // Use fallback data if fetch fails
        const fallbackData = [
            {
                id: 1,
                title: "Smart Watch Pro",
                subtitle: "Luxury Edition",
                description: "Experience the future of wearable technology with our latest smartwatch model.",
                price: "$299",
                image: "https://via.placeholder.com/500x600?text=Watch+Pro",
                bgGradient: "linear-gradient(135deg, #f5f5f7 0%, #e0e0e2 100%)",
                accentColor: "#0066CC"
            }
        ];
        initApp(fallbackData);
    });

// Initialize App Function
function initApp(watches) {
    setupMobileMenu(); // Handles the mobile menu toggle
    setupResponsiveMenu(); // Handles responsive menu behavior
    populateSlider(watches); // Adds watches to the slider
    initializeSplide(watches); // Sets up Splide.js
    setupPageLoadAnimation(); // Adds a fade-in effect when the page loads
}

// Setup Mobile Menu Toggle
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-visible');
        });
    }
}

// Handle Responsive Layout on Resize
function setupResponsiveMenu() {
    const navMenu = document.getElementById('navMenu');
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('mobile-visible');
            navMenu.style.display = '';
        } else if (window.innerWidth <= 768 && navMenu) {
            navMenu.style.display = navMenu.classList.contains('mobile-visible') ? 'flex' : 'none';
        }
    });
}

// Populate Splide Slider with Watches
function populateSlider(watches) {
    const slidesContainer = document.getElementById('watch-slides');
    watches.forEach(watch => {
        const slide = document.createElement('li');
        slide.className = 'splide__slide';
        slide.dataset.watchId = watch.id;
        slide.innerHTML = `<img src="${watch.image}" alt="${watch.title}">`;
        slidesContainer.appendChild(slide);
    });
}
function initializeSplide(watches) {
    const splide = new Splide('.splide', {
        type: 'loop',
        perPage: 1,
        focus: 'center',
        autoplay: false,
        interval: 5000,
        pagination: true,
        arrows: true,
        speed: 800,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        rewind: true,
        rewindSpeed: 800,
        waitForTransition: true
    }).mount();

    const carouselContent = document.querySelector('.carousel-content');

    // Set initial watch information
    updateWatchInfo(watches[0]);

    splide.on('move', function() {
        // Ensure animation resets properly
        carouselContent.classList.remove('fade-in');
        carouselContent.classList.add('fade-out');
    });

    splide.on('moved', function() {
        const activeSlideId = parseInt(splide.Components.Elements.slides[splide.index].dataset.watchId);
        const selectedWatch = watches.find(watch => watch.id === activeSlideId);

        setTimeout(() => {
            updateWatchInfo(selectedWatch);
            carouselContent.classList.remove('fade-out');
            void carouselContent.offsetWidth; // Force reflow for animation restart
            carouselContent.classList.add('fade-in');
        }, 300); // Small delay ensures smooth transition
    });

    window.addEventListener('resize', function() {
        splide.refresh();
    });
}


// Animate the header
function animateHeader() {
    const header = document.querySelector('.header');
    header.classList.remove('animate-header');
    void header.offsetWidth; // Force reflow
    header.classList.add('animate-header');
}

// Update Watch Information
function updateWatchInfo(watch) {
    document.getElementById('product-title').textContent = watch.title;

    let formattedSubtitle = watch.subtitle.includes("Choose Us") 
        ? watch.subtitle.replace("Choose Us", '<span class="title-highlight">Choose US</span>') 
        : watch.subtitle;

    document.getElementById('product-subtitle').innerHTML = formattedSubtitle;
    document.getElementById('product-description').textContent = watch.description;
    document.getElementById('product-price').textContent = watch.price;

    document.documentElement.style.setProperty('--background-gradient', watch.bgGradient);
    document.documentElement.style.setProperty('--accent-color', watch.accentColor);

    document.querySelectorAll('.navigation a, .product-info p, .product-price').forEach(el => {
        el.style.color = 'white';
    });

    updateSocialIconColors();

    // Subtle animation for price
    const priceElement = document.getElementById('product-price');
    priceElement.style.transform = 'scale(1.05)';
    setTimeout(() => priceElement.style.transform = 'scale(1)', 300);
}

// Update Social Icon Colors
function updateSocialIconColors() {
    document.querySelectorAll('.social-icon').forEach(icon => {
        icon.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        icon.style.color = 'white';
    });
}

// Page Load Animation
function setupPageLoadAnimation() {
    window.addEventListener('load', function() {
        document.body.classList.add('page-loaded');
    });
}
