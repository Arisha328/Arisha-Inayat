$(document).ready(function(){

    let totalSlides = $('.product-card').length;

    $('.product-slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,   // ✅ infinite loop
        arrows: false,    // we use custom buttons
        autoplay: true,
        autoplaySpeed: 5000, // ✅ auto-play every 5 sec

        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });

    // ✅ NEXT BUTTON
    $('.next-btn').click(function(){
        $('.product-slider').slick('slickNext');
    });

    // ✅ PREV BUTTON
    $('.prev-btn').click(function(){
        $('.product-slider').slick('slickPrev');
    });

    // ✅ SLIDE COUNTER
    $('.product-slider').on('afterChange', function(event, slick, currentSlide){
        $('.slide-counter').text((currentSlide + 1) + " of " + totalSlides);
    });

    // ✅ PAUSE ON HOVER (AI FEATURE)
    $('.product-card').hover(
        function(){
            $('.product-slider').slick('slickPause');
        },
        function(){
            $('.product-slider').slick('slickPlay');
        }
    );

});