

// ==========================================
// MENU NAVIGATION SCROLL (BULLETPROOF LENIS FIX)
// ==========================================
const scrollMap = {
  'logo-icon': 'hero',
  'video-icon': 'videos',
  'coach-icon': 'coach',
  'services-icon': 'services',
  'stadium-icon': 'stadiums',
  'event-icon': 'Events',
  'testi-icon': 'testimonials',
  'contact-icon': 'contact',
  'book-icon': 'booking'
};

const allSectionsArray = Array.from(document.querySelectorAll('.page-wrapper > section'));

Object.keys(scrollMap).forEach(iconId => {
  const icon = document.getElementById(iconId);
  const targetId = scrollMap[iconId];
  const targetSection = document.getElementById(targetId);

  if (icon) {
    icon.addEventListener('click', (e) => {
      // 1. ALWAYS stop the browser from trying to natively jump or reload
      e.preventDefault(); 

      // 2. If it's the booking icon, handle the pop-up modal
      if (iconId === 'book-icon') {
        openBookingModal();
        return;
      }

      // 3. Do the math and smoothly scroll to the section
      if (targetSection) {
        const targetIndex = allSectionsArray.indexOf(targetSection);
        
        if (targetIndex !== -1) {
          // Multiply by the actual computed height of the section to prevent mobile bugs
          const exactScrollPosition = targetIndex * targetSection.offsetHeight;
          
          // Use Lenis if it's active, otherwise fallback to native smooth scroll
          if (typeof lenis !== 'undefined') {
            lenis.scrollTo(exactScrollPosition, { duration: 1.5 });
          } else {
            window.scrollTo({ top: exactScrollPosition, behavior: 'smooth' });
          }
        }
      }
    });
  }
});

// ==========================================
// UNIVERSAL STICKY SCROLL SCRUBBING
// ==========================================
const allSectionsList = document.querySelectorAll('.page-wrapper > section');
const heroText = document.getElementById('hero-text-move');

window.addEventListener('scroll', () => {
  let windowHeight = window.innerHeight;
  let scrollY = window.scrollY;

  if (heroText && scrollY < windowHeight) {
    heroText.style.transform = `scaleY(0.85) translateX(-${scrollY * 1.2}px)`;
  }

  allSectionsList.forEach((sec, index) => {
    const nextSec = allSectionsList[index + 1];
    if (nextSec) {
      let nextTop = nextSec.getBoundingClientRect().top;
      if (nextTop < windowHeight && nextTop > 0) {
        let progress = 1 - (nextTop / windowHeight);
        const contentElements = sec.querySelectorAll('.section-title, .coach-container, .services-columns, .ev-title, .ev-info, .stadium-name, .stadium-loc, .contact, .testimonial-carousel');
        contentElements.forEach(el => {
          el.style.opacity = 1 - (progress * 2.5);
          el.style.transform = `translateY(${progress * -100}px)`;
        });
      } else if (nextTop >= windowHeight) {
        const contentElements = sec.querySelectorAll('.section-title, .coach-container, .services-columns, .ev-title, .ev-info, .stadium-name, .stadium-loc, .contact, .testimonial-carousel');
        contentElements.forEach(el => {
          el.style.opacity = 1;
          el.style.transform = `translateY(0px)`;
        });
      }
    }
  });
});

// ==========================================
// CAROUSELS (VIDEO, STADIUM, EVENTS)
// ==========================================
const fsVideos = document.querySelectorAll('.fs-video');
let currentFsVideo = 0;
if (fsVideos.length > 0) {
  fsVideos[currentFsVideo].play().catch(() => {});
  fsVideos.forEach((vid) => {
    vid.addEventListener('ended', () => {
      fsVideos[currentFsVideo].classList.remove('active');
      currentFsVideo = (currentFsVideo + 1) % fsVideos.length;
      fsVideos[currentFsVideo].classList.add('active');
      fsVideos[currentFsVideo].play();
    });
  });
}

const stadiumSlides = document.querySelectorAll('.stadium-slide');
let currentStadium = 0;
let stadiumAutoTimer;
function showStadium(index) {
  if (stadiumSlides.length === 0) return;
  stadiumSlides.forEach(s => s.classList.remove('active'));
  currentStadium = (index + stadiumSlides.length) % stadiumSlides.length;
  stadiumSlides[currentStadium].classList.add('active');
}
const stLeft = document.querySelector('.stadium-click-left');
const stRight = document.querySelector('.stadium-click-right');
if (stLeft && stRight) {
  stadiumAutoTimer = setInterval(() => showStadium(currentStadium + 1), 7000);
  stLeft.addEventListener('click', () => { clearInterval(stadiumAutoTimer); showStadium(currentStadium - 1); });
  stRight.addEventListener('click', () => { clearInterval(stadiumAutoTimer); showStadium(currentStadium + 1); });
}

const eventSlides = document.querySelectorAll('.event-slide');
let currentEvent = 0;
if (eventSlides.length > 0) {
  setInterval(() => {
    eventSlides.forEach(s => s.classList.remove('active'));
    currentEvent = (currentEvent + 1) % eventSlides.length;
    eventSlides[currentEvent].classList.add('active');
  }, 20000);
}

// ==========================================
// TESTIMONIALS (INTERSECTION OBSERVER)
// ==========================================
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
let currentTestimonial = 0;
let testimonialSlideInterval;
const showTestimonial = (index) => {
  if (testimonialSlides.length === 0) return;
  testimonialSlides.forEach(slide => slide.classList.remove('active'));
  currentTestimonial = (index + testimonialSlides.length) % testimonialSlides.length;
  testimonialSlides[currentTestimonial].classList.add('active');
};
const testimonialSection = document.getElementById('testimonials');
const testimonialObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (!testimonialSlideInterval) {
        showTestimonial(currentTestimonial);
        testimonialSlideInterval = setInterval(() => showTestimonial(currentTestimonial + 1), 10000);
      }
    } else {
      clearInterval(testimonialSlideInterval);
      testimonialSlideInterval = null;
    }
  });
}, { threshold: 0.1 });
if (testimonialSection) testimonialObserver.observe(testimonialSection);

// ==========================================
// THEME SWITCHER
// ==========================================
const themeSwitch = document.getElementById('theme-switch');
const THEME_KEY = 'proOneGoalkeepingTheme';
const applyTheme = (theme) => {
  const themeIcon = document.getElementById('theme-icon');
  if (!themeIcon) return;
  if (theme === 'light') {
    document.body.classList.add('light-mode');
    themeIcon.querySelector('path').setAttribute('d', "M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM12 1.5a1 1 0 0 1 1 1V5a1 1 0 0 1-2 0V2.5a1 1 0 0 1 1-1zm0 17a1 1 0 0 1 1 1V22a1 1 0 0 1-2 0v-2.5a1 1 0 0 1 1-1zM1.5 12a1 1 0 0 1 1-1H5a1 1 0 0 1 0 2H2.5a1 1 0 0 1-1-1zm17 0a1 1 0 0 1 1-1H22a1 1 0 0 1 0 2h-2.5a1 1 0 0 1-1-1zM4.22 4.22a1 1 0 0 1 1.41 0l1.77 1.77a1 1 0 1 1-1.41 1.41L4.22 5.63a1 1 0 0 1 0-1.41zm12.38 12.38a1 1 0 0 1 1.41 0l1.77 1.77a1 1 0 1 1-1.41 1.41l-1.77-1.77a1 1 0 0 1 0-1.41zM19.78 4.22a1 1 0 0 1 0 1.41L18 7.4a1 1 0 1 1-1.41-1.41l1.77-1.77a1 1 0 0 1 1.41 0zM7.4 18a1 1 0 0 1 0 1.41l-1.77 1.77a1 1 0 1 1-1.41-1.41L6 18a1 1 0 0 1 1.41 0z");
  } else {
    document.body.classList.remove('light-mode');
    themeIcon.querySelector('path').setAttribute('d', 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z');
  }
};
if (themeSwitch) {
  themeSwitch.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  });
}

// ==========================================
// INTRO ANIMATION (ONCE PER SESSION)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const introOverlay = document.getElementById("intro-overlay");
  const pageWrapper = document.querySelector(".page-wrapper");
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(savedTheme);

  if (introOverlay && pageWrapper) {
    if (sessionStorage.getItem("introPlayed") === "true") {
      introOverlay.style.display = "none";
      pageWrapper.classList.add("visible");
    } else {
      setTimeout(() => introOverlay.classList.add("step-2"), 500);
      setTimeout(() => introOverlay.classList.add("step-3"), 1500);
      setTimeout(() => introOverlay.classList.add("step-4"), 2500);
      setTimeout(() => introOverlay.classList.add("step-5"), 4000);
      setTimeout(() => {
        pageWrapper.classList.add("visible");
        introOverlay.style.opacity = "0";
        setTimeout(() => introOverlay.remove(), 800);
      }, 5200);
      sessionStorage.setItem("introPlayed", "true");
    }
  }
});

// ==========================================
// BOOKING MODAL, PRE-SELECTION & WEB3FORMS
// ==========================================
const modalOptions = {
  coaching: ["EVALUATION", "PRESEASON", "TRAINING"],
  analysis: ["TRAINING ANALYSIS", "PERFORMANCE ANALYSIS", "GAME PLANNING", "SCOUTING REPORT", "WORKLOAD MANAGEMENT"],
  development: ["MENTORING PROGRAM", "DUAL CAREER PLANNING"],
  performance: ["NUTRITION PLANNING", "FITNESS"]
};

const bookingModal = document.getElementById('booking-modal');
const bookingForm = document.getElementById('appointment-form');
const successOverlay = document.getElementById('success-overlay');

function openBookingModal() {
  bookingModal.style.display = 'flex';
  document.body.classList.add('modal-open'); // Lock Background Scroll
  if (typeof lenis !== 'undefined') lenis.stop(); // Stops Lenis scroll physics
}

function closeBookingModal() {
  bookingModal.style.display = 'none';
  document.body.classList.remove('modal-open'); // Unlock Background Scroll
  if (typeof lenis !== 'undefined') lenis.start(); // Resumes Lenis scroll physics
}

// 1. Handle Main Book Icon Click (Opens empty form)
const mainBookIcon = document.getElementById('book-icon');
if (mainBookIcon) {
    mainBookIcon.addEventListener('click', (e) => {
        e.preventDefault();
        if(bookingForm) bookingForm.reset(); // Clear previous selections
        
        // Reset secondary dropdown
        const optionSelect = document.getElementById('service-option');
        if(optionSelect) optionSelect.innerHTML = '<option value="" disabled selected>Select Option</option>';
        
        openBookingModal();
    });
}

// 2. Handle Services Links (WITH SMART AUTO-SELECT)
document.querySelectorAll('.serv-col a').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // SMART READ: Find the H3 title in the same column (e.g., "COACHING")
    const categoryHeading = btn.closest('.serv-col').querySelector('h3');
    const category = categoryHeading ? categoryHeading.textContent.trim().toLowerCase() : null;
    
    // SMART READ: Grab the exact text of the link clicked (e.g., "EVALUATION")
    const option = btn.textContent.trim();
    
    openBookingModal();

    // Auto-fill the dropdowns
    if (category) {
        const categorySelect = document.getElementById('service-category');
        const optionSelect = document.getElementById('service-option');

        // Select the Category
        categorySelect.value = category;
        
        // Force dropdown to trigger the event that builds the secondary list
        categorySelect.dispatchEvent(new Event('change'));

        // Select the Specific Program
        if (option) {
            optionSelect.value = option;
        }
    }
  });
});

document.getElementById('close-modal')?.addEventListener('click', closeBookingModal);

// Dynamic Dropdown Logic
document.getElementById('service-category')?.addEventListener('change', function() {
  const optionsSelect = document.getElementById('service-option');
  optionsSelect.innerHTML = '<option value="" disabled selected>Select Option</option>';
  if (modalOptions[this.value]) {
    modalOptions[this.value].forEach(opt => {
      const o = document.createElement('option');
      o.value = opt; o.textContent = opt;
      optionsSelect.appendChild(o);
    });
  }
});

// Web3Forms Submission + Glass Success Animation
bookingForm?.addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(bookingForm);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  // Show Glass Success Screen
  successOverlay.style.display = 'flex';

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: json
  })
  .then(async (response) => {
    if (response.status == 200) {
      // Trigger Spin & Expand Animation
      setTimeout(() => {
        successOverlay.classList.add('closing');
        closeBookingModal(); // Close main modal while tick expands
      }, 1800);

      // Final Cleanup
      setTimeout(() => {
        successOverlay.style.display = 'none';
        successOverlay.classList.remove('closing');
        bookingForm.reset();
      }, 2500);
    } else {
      alert("Submission failed. Please try again.");
      successOverlay.style.display = 'none';
    }
  })
  .catch(() => {
    alert("Error connecting to server.");
    successOverlay.style.display = 'none';
  });
});