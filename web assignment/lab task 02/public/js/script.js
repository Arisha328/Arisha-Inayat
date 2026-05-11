document.addEventListener("DOMContentLoaded", function () {

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    links.forEach(function(link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

});