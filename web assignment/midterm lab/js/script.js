.ready(function(){
    .product-slider.each(function(){
        const  = ;
        const  = .closest('.right-products');
        const  = .find('.prev-btn');
        const  = .find('.next-btn');
        const  = .find('.slide-counter');
        const totalSlides = .find('.product-card').length;

        if (.length) {
            .text('1 of ' + totalSlides);
        }

        .slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 5000,
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

        .on('click', function(){
            .slick('slickPrev');
        });

        .on('click', function(){
            .slick('slickNext');
        });

        .on('afterChange', function(event, slick, currentSlide){
            if (.length) {
                .text((currentSlide + 1) + ' of ' + totalSlides);
            }
        });

        .on('mouseenter', function(){
            .slick('slickPause');
        });

        .on('mouseleave', function(){
            .slick('slickPlay');
        });
    });
});
