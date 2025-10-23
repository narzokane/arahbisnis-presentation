// Presentation Script
document.addEventListener('DOMContentLoaded', function() {
    // Get all slides
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentSlide = 1;

    // Get control elements
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideCounter = document.getElementById('slideCounter');
    const progressFill = document.getElementById('progressFill');

    // Initialize
    updateSlideDisplay();

    // Navigation functions
    function goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > totalSlides) {
            return;
        }

        // Remove active class from current slide
        slides[currentSlide - 1].classList.remove('active');
        slides[currentSlide - 1].classList.add('prev');

        // Update current slide
        currentSlide = slideNumber;

        // Add active class to new slide
        slides[currentSlide - 1].classList.remove('prev');
        slides[currentSlide - 1].classList.add('active');

        // Update display
        updateSlideDisplay();
    }

    function nextSlide() {
        if (currentSlide < totalSlides) {
            goToSlide(currentSlide + 1);
        }
    }

    function prevSlide() {
        if (currentSlide > 1) {
            goToSlide(currentSlide - 1);
        }
    }

    function updateSlideDisplay() {
        // Update counter
        slideCounter.textContent = `${currentSlide} / ${totalSlides}`;

        // Update progress bar
        const progress = (currentSlide / totalSlides) * 100;
        progressFill.style.width = `${progress}%`;

        // Update button states
        prevBtn.disabled = currentSlide === 1;
        nextBtn.disabled = currentSlide === totalSlides;

        // Add subtle animation to active slide content
        const activeSlide = slides[currentSlide - 1];
        const slideContent = activeSlide.querySelector('.slide-content');
        slideContent.style.animation = 'none';
        setTimeout(() => {
            slideContent.style.animation = 'fadeIn 0.5s ease-out';
        }, 50);
    }

    // Event listeners for buttons
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(totalSlides);
                break;
        }
    });

    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - go to next slide
                nextSlide();
            } else {
                // Swiped right - go to previous slide
                prevSlide();
            }
        }
    }

    // Mouse wheel navigation
    let wheelTimeout;
    document.addEventListener('wheel', function(e) {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(function() {
            if (e.deltaY > 0) {
                nextSlide();
            } else if (e.deltaY < 0) {
                prevSlide();
            }
        }, 100);
    }, { passive: true });

    // Click on slide to advance (except on controls)
    document.querySelector('.presentation-container').addEventListener('click', function(e) {
        // Only advance if not clicking on interactive elements
        if (!e.target.closest('.controls') && 
            !e.target.closest('.strategy-card') &&
            !e.target.closest('button')) {
            nextSlide();
        }
    });

    // Fullscreen toggle (F11 or double-click on presentation)
    let lastClickTime = 0;
    document.querySelector('.presentation-container').addEventListener('click', function(e) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime;

        if (timeDiff < 300 && timeDiff > 0) {
            // Double click detected
            toggleFullscreen();
        }

        lastClickTime = currentTime;
    });

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen request failed:', err);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Add visual feedback for strategy cards
    const strategyCards = document.querySelectorAll('.strategy-card');
    strategyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Prevent context menu on presentation (cleaner experience)
    document.querySelector('.presentation-container').addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // Print mode detection
    window.addEventListener('beforeprint', function() {
        // Show all slides for printing
        slides.forEach(slide => {
            slide.style.position = 'relative';
            slide.style.opacity = '1';
            slide.style.transform = 'none';
            slide.style.pageBreakAfter = 'always';
        });
    });

    window.addEventListener('afterprint', function() {
        // Restore slide presentation mode
        slides.forEach((slide, index) => {
            slide.style.position = 'absolute';
            if (index !== currentSlide - 1) {
                slide.classList.remove('active');
            }
        });
        updateSlideDisplay();
    });

    // Show presentation tip on load
    setTimeout(function() {
        const instructions = document.querySelector('.instructions');
        if (instructions) {
            instructions.style.animation = 'fadeIn 0.5s ease-out';
        }
    }, 1000);

    // Hide instructions after 5 seconds
    setTimeout(function() {
        const instructions = document.querySelector('.instructions');
        if (instructions) {
            instructions.style.opacity = '0';
            instructions.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                instructions.style.display = 'none';
            }, 500);
        }
    }, 5000);
});
