document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".section-nav a");
    const sections = document.querySelectorAll("section");

    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px", // Trigger when section is in the top part of the viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach((link) => link.classList.remove("active"));

                // Add active class to corresponding link
                const id = entry.target.getAttribute("id");
                const activeLink = document.querySelector(`.section-nav a[href="#${id}"]`);

                if (activeLink) {
                    activeLink.classList.add("active");
                }
            }
        });
    }, observerOptions);

    sections.forEach((section) => {
        observer.observe(section);
    });

    // Gallery Interaction: Handle "Proceeding" state for items with no link
    document.querySelectorAll('.project-item[href="#"]').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const content = this.querySelector('.project-content');
            if (content) {
                content.classList.toggle('proceeding');
            }
        });
    });
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sectionNav = document.querySelector('.section-nav');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sectionNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active'); // Animate Hamburger
        });

        // Close menu when a link is clicked
        const navLinks = sectionNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                sectionNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active'); // Reset Hamburger
            });
        });
    }

    // Accordion Logic for Mobile
    const accordionHeaders = document.querySelectorAll('.content-section h2');
    accordionHeaders.forEach(header => {
        // Skip Gallery from Accordion Logic
        if (header.parentElement.id === 'gallery') return;

        header.addEventListener('click', () => {
            // Only enable click toggle on mobile
            if (window.innerWidth <= 1024) {
                const parent = header.parentElement;
                parent.classList.toggle('active');
            }
        });
    });


    // BGM Logic
    const bgmAudio = document.getElementById('bgm-audio');
    const bgmToggle = document.getElementById('bgm-toggle');

    if (bgmAudio && bgmToggle) {
        const bgmIcon = bgmToggle.querySelector('i');
        const bgmText = bgmToggle.querySelector('span');
        let isPlaying = true; // Default desired state

        function updateBGMUI() {
            if (isPlaying) {
                bgmIcon.className = 'fas fa-volume-up';
                bgmText.textContent = 'ON';
            } else {
                bgmIcon.className = 'fas fa-volume-mute';
                bgmText.textContent = 'OFF';
            }
        }

        // Try Autoplay
        // Note: Browsers may block autoplay. We handle both success and failure.
        bgmAudio.volume = 0.5; // Set a reasonable default volume
        const playPromise = bgmAudio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Autoplay started!
                isPlaying = true;
                updateBGMUI();
            }).catch(error => {
                // Autoplay was prevented.
                // We show "OFF" state or let user click to start.
                console.log("Autoplay prevented by browser policy.");
                isPlaying = false;
                updateBGMUI();
            });
        }

        // Toggle Click
        bgmToggle.addEventListener('click', () => {
            if (isPlaying) {
                bgmAudio.pause();
                isPlaying = false;
            } else {
                bgmAudio.play();
                isPlaying = true;
            }
            updateBGMUI();
        });
    }
});
