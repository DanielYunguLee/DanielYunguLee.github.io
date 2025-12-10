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
});
