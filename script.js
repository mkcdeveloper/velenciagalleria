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
        let currentIndex = 0;

        if (slides.length > 1) {
            setInterval(() => {
                slides[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % slides.length;
                slides[currentIndex].classList.add('active');
            }, interval);
        }
    }

    startSlideshow('.intro-slide', 3000);
    startSlideshow('.vip-slide', 3200); 
    startSlideshow('.hall-slide', 2500); // fastest pace for the large hall gallery
    startSlideshow('.dining-slide', 2800); // medium-fast pace for dining gallery

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

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
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

    // 4. Dynamic Gallery Loader with View Less Toggle
    const viewMoreBtn = document.getElementById('view-more-btn');
    const dynamicGallery = document.getElementById('dynamic-gallery');
    let isExpanded = false;

    if (viewMoreBtn && dynamicGallery) {
        // Pre-generate the allImages array
        const allImages = [
            'images/introslide2.jpg', 'images/introslide3.jpg', 'images/introslide4.jpg', 'images/introslide5.jpg', 'images/introslide6.jpg',
            'images/vip2.jpg', 'images/vip3.jpg',
            'images/hall2.jpg', 'images/hall3.jpg', 'images/hall5.jpg', 'images/hall6.jpg', 'images/hall7.jpg', 'images/hall8.jpg', 'images/hall9.jpg', 
            'images/hall10.jpg', 'images/hall11.jpg', 'images/hall12.jpg', 'images/hall13.jpg', 'images/hall14.jpg', 'images/hall15.jpg', 
            'images/hall16.jpg', 'images/hall17.jpg', 'images/hall18.jpg',
            'images/dinning1.jpg', 'images/dinning2.jpg', 'images/dinning3.jpg', 'images/dinning4.jpg', 'images/dinning5.jpg', 
            'images/dinning6.jpg', 'images/dinning7.jpg', 'images/dinning8.jpg', 'images/dinning9.jpg', 'images/dinning10.jpg', 
            'images/dinning11.jpg', 'images/dinning12.jpg', 'images/dinning13.jpg', 'images/dinning14.jpg', 'images/dinning15.jpg', 
            'images/dinning16.jpg'
        ];

        viewMoreBtn.addEventListener('click', () => {
            if (!isExpanded) {
                // Expand logic
                allImages.forEach(imgSrc => {
                    const item = document.createElement('div');
                    item.className = 'gallery-item dynamic-item reveal active'; 
                    item.innerHTML = `<img src="${imgSrc}" alt="Gallery">`;
                    dynamicGallery.appendChild(item);
                });
                viewMoreBtn.innerText = 'View Less Pictures';
                isExpanded = true;
            } else {
                // Shrink logic
                const extraImages = document.querySelectorAll('.dynamic-item');
                extraImages.forEach(img => img.remove());
                viewMoreBtn.innerText = 'View More Pictures';
                isExpanded = false;
                
                // Scroll back up to the top of the gallery section
                lenis.scrollTo('#gallery');
            }
        });
    }
});
