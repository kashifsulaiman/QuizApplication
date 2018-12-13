import $ from 'jquery.transit';

// JQUERY

export const animateIn = (height) => {
    $(function () {

        var images = ['https://unsplash.com/photos/LfG7RwMM6g8/download?force=true'];

        $('#container').append('<style>#container, .acceptContainer:before, #logoContainer:before {background: url(' + images[0] + ') center }');




        setTimeout(function () {
            $('.logoContainer').transition({ scale: 1 }, 700, 'ease');
            setTimeout(function () {
                $('.logoContainer .logo').addClass('loadIn');
                setTimeout(function () {
                    $('.logoContainer .text').addClass('loadIn');
                    setTimeout(function () {
                        $('.acceptContainer').transition({ height });
                        setTimeout(function () {
                            if (window.innerWidth < 480) {
                                $('.logoContainer').addClass('moveOut');
                            }
                            $('.acceptContainer').addClass('loadIn');
                            setTimeout(function () {
                                $('.formDiv, form h1').addClass('loadIn');
                            }, 500)
                        }, 500)
                    }, 500)
                }, 500)
            }, 1000)
        }, 10)
    });
}


export const animateOut = () => {
    $(function () {


        setTimeout(function () {
            // $('.formDiv, form h1').removeClass('loadIn')
            $('.formDiv, form h1').addClass('loadOut')
            setTimeout(function () {
                // $('.acceptContainer').removeClass('loadIn')
                $('.acceptContainer').addClass('loadOut')
                setTimeout(function () {
                    $('.acceptContainer').transition({ height: '0px' });
                    setTimeout(function () {
                        // $('.logoContainer .text').removeClass('loadIn')
                        $('.logoContainer .text').addClass('loadOut')
                        setTimeout(function () {
                            // $('.logoContainer .logo').removeClass('loadIn')
                            $('.logoContainer .logo').addClass('loadOut')
                            setTimeout(function () {
                                $('.logoContainer').addClass('loadOut')
                                $('.logoContainer').transition({ scale: 0 }, 700, 'ease');
                            }, 10)
                        }, 1000)
                    }, 500)
                }, 500)
            }, 500)
        }, 500)
    });
}
