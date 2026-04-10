document.addEventListener('DOMContentLoaded', () => {

    // 0. Initialize Lenis for liquid scrolling
    const lenis = new Lenis({
        duration: 2, // smooth and liquid length
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.2
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 0.1 Automatic Slideshow Logic for all sliders
    function startSlideshow(slideSelector, interval = 4000) {
        const slides = document.querySelectorAll(slideSelector);
        if (slides.length <= 1) return;

        const container = slides[0].parentElement;
        const nextBtn = container.querySelector('.next-btn');
        const prevBtn = container.querySelector('.prev-btn');

        let currentIndex = 0;
        let timer;

        function showSlide(index) {
            slides[currentIndex].classList.remove('active');
            currentIndex = (index + slides.length) % slides.length;
            slides[currentIndex].classList.add('active');
        }

        function nextSlide() {
            showSlide(currentIndex + 1);
        }

        function prevSlide() {
            showSlide(currentIndex - 1);
        }

        function startTimer() {
            clearInterval(timer);
            timer = setInterval(nextSlide, interval);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                nextSlide();
                startTimer();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                prevSlide();
                startTimer();
            });
        }

        // Initialize timer
        startTimer();
    }

    startSlideshow('.intro-slide', 3500);
    startSlideshow('.vip-slide', 3800);
    startSlideshow('.hall-slide', 3000);
    startSlideshow('.dining-slide', 3200);

    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle hamburger icon between bars and times (close)
            const icon = hamburger.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 2. Sticky Navbar on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const revealOptions = {
        threshold: 0.1, // trigger when 10% of the element is visible
        rootMargin: "0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }

                lenis.scrollTo(targetElement);
            }
        });
    });

    // 4. Dynamic Gallery Loader with View Less Toggle + Lightbox
    const viewMoreBtn = document.getElementById('view-more-btn');
    const dynamicGallery = document.getElementById('dynamic-gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    let isExpanded = false;

    const allGalleryImages = [
        'images/introslide1.jpg', 'images/introslide2.jpg', 'images/introslide3.jpg', 
        'images/introslide4.jpg', 'images/introslide5.jpg', 'images/introslide6.jpg',
        'images/vip1.jpg', 'images/vip2.jpg', 'images/vip3.jpg',
        'images/hall1.jpg', 'images/hall2.jpg', 'images/hall3.jpg', 'images/hall5.jpg', 'images/hall6.jpg', 'images/hall7.jpg', 'images/hall8.jpg', 'images/hall9.jpg',
        'images/hall10.jpg', 'images/hall11.jpg', 'images/hall12.jpg', 'images/hall13.jpg', 'images/hall14.jpg', 'images/hall15.jpg',
        'images/hall16.jpg', 'images/hall17.jpg', 'images/hall18.jpg',
        'images/dinning1.jpg', 'images/dinning2.jpg', 'images/dinning3.jpg', 'images/dinning4.jpg', 'images/dinning5.jpg',
        'images/dinning6.jpg', 'images/dinning7.jpg', 'images/dinning8.jpg', 'images/dinning9.jpg', 'images/dinning10.jpg',
        'images/dinning11.jpg', 'images/dinning12.jpg', 'images/dinning13.jpg', 'images/dinning14.jpg', 'images/dinning15.jpg',
        'images/dinning16.jpg'
    ];
    const allImages = [...new Set(allGalleryImages)];

    if (viewMoreBtn && dynamicGallery) {
        let currentImageIndex = 3; 
        const imagesPerBatch = 3;

        function loadBatch() {
            const existingContainer = document.querySelector('.view-more-container');
            if (existingContainer) existingContainer.remove();

            const end = Math.min(currentImageIndex + imagesPerBatch, allImages.length);
            for (let i = currentImageIndex; i < end; i++) {
                const item = document.createElement('div');
                item.className = 'gallery-item dynamic-item reveal active';
                item.innerHTML = `<img src="${allImages[i]}" alt="Gallery">`;
                dynamicGallery.appendChild(item);
            }

            currentImageIndex = end;

            if (currentImageIndex < allImages.length) {
                const btnContainer = document.createElement('div');
                btnContainer.className = 'view-more-container';
                btnContainer.innerHTML = `<button class="btn-small"><i class="fas fa-plus"></i> View More</button>`;
                btnContainer.querySelector('button').addEventListener('click', loadBatch);
                dynamicGallery.appendChild(btnContainer);
            } else {
                const btnContainer = document.createElement('div');
                btnContainer.className = 'view-more-container';
                btnContainer.innerHTML = `<button class="btn-small"><i class="fas fa-minus"></i> Show Less</button>`;
                btnContainer.querySelector('button').addEventListener('click', resetGallery);
                dynamicGallery.appendChild(btnContainer);
            }
            viewMoreBtn.style.display = 'none';
        }

        function resetGallery() {
            const extraItems = document.querySelectorAll('.dynamic-item, .view-more-container');
            extraItems.forEach(item => item.remove());
            currentImageIndex = 3;
            viewMoreBtn.style.display = 'inline-block';
            viewMoreBtn.innerText = 'View More Pictures';
            lenis.scrollTo('#gallery', { offset: -100 });
        }

        viewMoreBtn.addEventListener('click', loadBatch);
    }

    // Lightbox Logic
    let currentLightboxImages = [];
    let currentLightboxIndex = 0;

    function updateLightboxUI() {
        if (currentLightboxImages.length === 0) return;
        
        const imgElement = currentLightboxImages[currentLightboxIndex];
        lightboxImg.src = imgElement.src;
        
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        
        // Show navigation buttons if there's more than one image
        if (prevBtn) prevBtn.style.display = (currentLightboxImages.length > 1) ? 'block' : 'none';
        if (nextBtn) nextBtn.style.display = (currentLightboxImages.length > 1) ? 'block' : 'none';
        
        // Preload next image if available (looping wrap-around)
        const nextIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
        const nextImg = new Image();
        nextImg.src = currentLightboxImages[nextIndex].src;
    }

    function openLightbox(clickedImg) {
        if (!lightbox || !lightboxImg) return;
        
        // Determine context: Specific slideshow or Gallery
        const slideshowContainer = clickedImg.closest('.slideshow-container');
        const galleryGrid = clickedImg.closest('#dynamic-gallery');
        
        if (slideshowContainer) {
            // Stay within THIS specific slideshow only
            currentLightboxImages = Array.from(slideshowContainer.querySelectorAll('img')).filter(img => !img.classList.contains('nav-logo')).map(img => ({ src: img.src }));
        } else if (galleryGrid) {
            // Access ALL images from the gallery set even if not yet loaded in DOM
            currentLightboxImages = allImages.map(src => ({ src: src }));
        } else {
            currentLightboxImages = [{ src: clickedImg.src }];
        }
        
        currentLightboxIndex = currentLightboxImages.findIndex(img => {
            const absoluteSrc = clickedImg.src;
            // Check if the source in our array matches the end of the absolute source
            return absoluteSrc.endsWith(img.src);
        });

        if (currentLightboxIndex === -1) {
            currentLightboxIndex = 0;
        }

        updateLightboxUI();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function nextLightboxImage() {
        if (currentLightboxImages.length <= 1) return;
        currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
        updateLightboxUI();
    }

    function prevLightboxImage() {
        if (currentLightboxImages.length <= 1) return;
        currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
        updateLightboxUI();
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        
        const nextBtn = document.getElementById('lightbox-next');
        const prevBtn = document.getElementById('lightbox-prev');

        if (nextBtn) nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextLightboxImage();
        });
        
        if (prevBtn) prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevLightboxImage();
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'IMG') {
            const isGallery = target.closest('.gallery-item');
            const isSlideshow = target.closest('.slideshow-container');
            
            if (isGallery || isSlideshow) {
                openLightbox(target);
            }
        }
    });

    window.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightboxImage();
        if (e.key === 'ArrowLeft') prevLightboxImage();
    });
});
