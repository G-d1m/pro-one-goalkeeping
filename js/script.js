// Smooth section reveal on scroll
const sections = document.querySelectorAll("section");

const revealSection = () => {
  const triggerBottom = window.innerHeight * 0.85;
  sections.forEach((sec) => {
    const boxTop = sec.getBoundingClientRect().top;
    if (boxTop < triggerBottom) sec.classList.add("visible");
  });
};

window.addEventListener("scroll", revealSection);
revealSection(); // Trigger on load

// Smooth scrolling when clicking nav icons
const scrollMap = {
  'logo-icon':'hero',
  'video-icon': 'videos', 
  'coach-icon': 'coach',
  'services-icon': 'services', 
  'stadium-icon': 'stadiums',
  'testi-icon': 'testimonials',
  'contact-icon': 'contact',
  'book-icon': 'booking'
};


Object.keys(scrollMap).forEach(iconId => {
  const icon = document.getElementById(iconId);
  const targetId = scrollMap[iconId];
  const targetSection = document.getElementById(targetId);

  if (icon) {
    icon.addEventListener('click', (e) => {
        
        // Prevent default behavior for link elements only if we handle the navigation
        if (icon.tagName !== 'A') {
            e.preventDefault(); 
        }
        
        if (targetSection) {
            // Case 1: Target section is on the current page (Smooth Scroll)
            const offset = 70; 
            const topPos = targetSection.offsetTop - offset;

            window.scrollTo({
                top: topPos,
                behavior: 'smooth'
            });
        } 
        else if (window.location.pathname.includes('book.html')) {
            // Case 2: We are on book.html and clicking a main section icon
            // Navigate to index.html and include the hash for the browser to scroll
            if (iconId === 'logo-icon') {
                 window.location.href = 'index.html#hero';
            } else {
                 // Check if it's the contact section (ID change)
                 const hash = (targetId === 'contact') ? 'contact' : targetId;
                 window.location.href = `index.html#${hash}`;
            }
        }
    });
  }
});


// CAROUSEL LOGIC for 20-second video rotation
const videoSlides = document.querySelectorAll('.video-slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
const intervalTime = 20000; // 20 seconds
let slideInterval;

// Volume Toggle Logic 

// --- Define your Icon File Paths ---
const volumeIconUnmutedSrc = 'assets/icons/full.svg'; 
const volumeIconMutedSrc = 'assets/icons/mute.svg'; // Ensure this file exists!
// -----------------------------------

const volumeToggle = document.getElementById('volume-toggle');
const volumeIcon = volumeToggle ? volumeToggle.querySelector('img') : null;

// *** STARTING STATE: Set to true so the script matches the muted HTML ***
let isMuted = true; 

const toggleVolume = () => {
    isMuted = !isMuted;
    
    // Mute/Unmute all carousel videos
    const allVideos = document.querySelectorAll('.carousel-video');
    allVideos.forEach(video => {
        video.muted = isMuted;
    });
    
    // Update the Icon and Background
    if (volumeToggle && volumeIcon) {
        if (isMuted) {
            volumeIcon.src = volumeIconMutedSrc;
            volumeIcon.alt = "Volume is Muted";
            // Add class for Grey BG (Muted state)
            volumeToggle.classList.add('is-muted'); 
            volumeToggle.setAttribute('aria-label', 'Unmute volume');
        } else {
            volumeIcon.src = volumeIconUnmutedSrc;
            volumeIcon.alt = "Volume is Unmuted";
            // Remove class for Green BG (Unmuted state)
            volumeToggle.classList.remove('is-muted'); 
            volumeToggle.setAttribute('aria-label', 'Mute volume');
        }
    }
};

if (volumeToggle) {
    // *** INITIALIZATION BLOCK ***
    // 1. Ensure the icon starts as the Muted icon
    if (volumeIcon) {
        volumeIcon.src = volumeIconMutedSrc; 
        volumeIcon.alt = "Volume is Muted";
    }
    // 2. Ensure the button has the Muted style (Grey BG)
    volumeToggle.classList.add('is-muted'); 
    volumeToggle.setAttribute('aria-label', 'Unmute volume');

    // 3. Attach the click listener
    volumeToggle.addEventListener('click', toggleVolume);
}


// Function to reset all videos (stop playback and rewind)
const resetVideos = () => {
    videoSlides.forEach((slide) => {
        const videoElement = slide.querySelector('video');
        if (videoElement) {
            videoElement.pause();
            videoElement.currentTime = 0; // Rewind to start
        }
        slide.classList.remove('active');
    });
};

// Function to show a specific slide
const showSlide = (index) => {
    if (videoSlides.length === 0) return;

    resetVideos();
    
    currentSlide = (index + videoSlides.length) % videoSlides.length;
    
    // Update active slide class
    videoSlides[currentSlide].classList.add('active');

    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
    
    // Start playing the new video
    const currentVideo = videoSlides[currentSlide].querySelector('video');
    if (currentVideo) {
        // Ensure muted state is respected
        currentVideo.muted = isMuted; 
        currentVideo.play().catch(error => {
            console.warn("Video playback failed, likely due to browser autoplay policy.", error);
        });
    }
};

// Function to move to the next slide
const nextSlide = () => {
    showSlide(currentSlide + 1);
};

// Event listeners for dots (manual navigation)
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(slideInterval); // Stop auto-play on manual click
        showSlide(index);
        // Restart the interval after a manual click
        slideInterval = setInterval(nextSlide, intervalTime); 
    });
});

// Start the carousel auto-play only when the section is visible
const videoSection = document.getElementById('videos');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Section is visible, start the carousel
            if (!slideInterval) {
                showSlide(currentSlide); // Show the current/first slide and start video
                slideInterval = setInterval(nextSlide, intervalTime);
            }
        } else {
            // Section is not visible, pause the carousel and reset videos
            clearInterval(slideInterval);
            slideInterval = null;
            resetVideos();
        }
    });
}, { threshold: 0.1 }); // Trigger when 10% of the section is visible

if (videoSection) {
    observer.observe(videoSection);
}

const form = document.getElementById('appointment-form');

if (form) {
    // Clear form data on unload (a proxy for "session termination" on static sites)
    window.addEventListener('beforeunload', () => {
        form.reset();
    });
}

// CAROUSEL LOGIC for 10-second Testimonial rotation
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
let currentTestimonial = 0;
const testimonialIntervalTime = 10000; // 10 seconds (10000ms)
let testimonialSlideInterval;

// Function to show a specific testimonial slide
const showTestimonial = (index) => {
    if (testimonialSlides.length === 0) return;

    // Remove 'active' from all slides
    testimonialSlides.forEach(slide => slide.classList.remove('active'));

    // Calculate the new slide index, wrapping around
    currentTestimonial = (index + testimonialSlides.length) % testimonialSlides.length;

    // Add 'active' to the new slide
    testimonialSlides[currentTestimonial].classList.add('active');
};

// Function to move to the next testimonial slide
const nextTestimonial = () => {
    showTestimonial(currentTestimonial + 1);
};

// Start the testimonial carousel auto-play only when the section is visible
const testimonialSection = document.getElementById('testimonials');

const testimonialObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Section is visible, start the carousel
            if (!testimonialSlideInterval) {
                showTestimonial(currentTestimonial); // Show the current/first slide
                testimonialSlideInterval = setInterval(nextTestimonial, testimonialIntervalTime);
            }
        } else {
            // Section is not visible, pause the carousel
            clearInterval(testimonialSlideInterval);
            testimonialSlideInterval = null;
        }
    });
}, { threshold: 0.1 }); // Trigger when 10% of the section is visible

if (testimonialSection) {
    testimonialObserver.observe(testimonialSection);
}


// NEW: Dark/Light Mode Implementation 
const themeSwitch = document.getElementById('theme-switch');
const body = document.body;
const THEME_KEY = 'proOneGoalkeepingTheme';

const applyTheme = (theme) => {
    const themeIcon = document.getElementById('theme-icon');
    if (!themeIcon) return; // Exit if element not found

    if (theme === 'light') {
        body.classList.add('light-mode');
        // Sun icon d path
        themeIcon.querySelector('path').setAttribute('d', "M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM12 1.5a1 1 0 0 1 1 1V5a1 1 0 0 1-2 0V2.5a1 1 0 0 1 1-1zm0 17a1 1 0 0 1 1 1V22a1 1 0 0 1-2 0v-2.5a1 1 0 0 1 1-1zM1.5 12a1 1 0 0 1 1-1H5a1 1 0 0 1 0 2H2.5a1 1 0 0 1-1-1zm17 0a1 1 0 0 1 1-1H22a1 1 0 0 1 0 2h-2.5a1 1 0 0 1-1-1zM4.22 4.22a1 1 0 0 1 1.41 0l1.77 1.77a1 1 0 1 1-1.41 1.41L4.22 5.63a1 1 0 0 1 0-1.41zm12.38 12.38a1 1 0 0 1 1.41 0l1.77 1.77a1 1 0 1 1-1.41 1.41l-1.77-1.77a1 1 0 0 1 0-1.41zM19.78 4.22a1 1 0 0 1 0 1.41L18 7.4a1 1 0 1 1-1.41-1.41l1.77-1.77a1 1 0 0 1 1.41 0zM7.4 18a1 1 0 0 1 0 1.41l-1.77 1.77a1 1 0 1 1-1.41-1.41L6 18a1 1 0 0 1 1.41 0z");
    } else {
        body.classList.remove('light-mode');
        // Moon icon d path
        themeIcon.querySelector('path').setAttribute('d', 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z');
    }
};

const toggleTheme = () => {
    const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
};

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark'; // Default to dark
    applyTheme(savedTheme);
});

if (themeSwitch) {
    themeSwitch.addEventListener('click', toggleTheme);
}


// NEW: Service Details Toggle Logic 
const serviceItems = document.querySelectorAll('.service-item');

serviceItems.forEach(item => {
    item.addEventListener('click', () => {
        // Toggle 'active' class on the clicked item
        item.classList.toggle('active');

        // Optional: Close all other open items
        serviceItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
    });
});

const preSelectService = () => {
    // Check if we are on the booking page and if the form exists
    const serviceSelect = document.getElementById('service');
    if (!serviceSelect) return;

    // Get the service name from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const serviceName = urlParams.get('service');

    if (serviceName) {
        // Find the option whose value matches the service name and select it
        // The service names in the index.html links match the option values in book.html
        serviceSelect.value = serviceName;
        
        // Remove the 'disabled selected' attributes from the default option 
        // to prevent it from interfering if JavaScript is slow.
        const defaultOption = serviceSelect.querySelector('option[disabled][selected]');
        if (defaultOption) {
             defaultOption.removeAttribute('selected');
        }
    }
};

// Apply pre-selection logic on load
preSelectService();