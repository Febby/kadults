$(document).ready(function() { 

	"use strict";

    /************** Nav Scripts **************/

    $(window).scroll(function() {
        if (window.scrollY > 1) {
            $('nav').addClass('sticky-nav');
        } else {
            $('nav').removeClass('sticky-nav');
        }
    });

    $('a').click(function() {
        if ($(this).attr('href') === '#') {
            return false;
        }
    });

    // Margin on the menu to make room for sidebar menu if it exists

    if ($('.sidebar-menu-toggle').length && !$('.sidebar-menu-toggle i').hasClass('variant-deleted-mrv')) {
        $('nav').find('.menu').css('margin-right', 32);
    }

    // Mobile menu toggle

    $('.mobile-menu-toggle').click(function() {
        $('nav').toggleClass('open-menu');
    });

    // Sidebar menu toggle

    $('.sidebar-menu-toggle').click(function() {
        if ($('.instagram-sidebar').hasClass('show-sidebar')) {
            $('.instagram-sidebar').toggleClass('show-sidebar');
            $('.sidebar-menu').toggleClass('show-sidebar');
        } else {
            $('.sidebar-menu').toggleClass('show-sidebar');
            $('.main-container').toggleClass('reveal-sidebar');
            $('nav .container').toggleClass('reveal-sidebar');
        }
    });

    $('.instagram-toggle').click(function() {
        if ($('.sidebar-menu').hasClass('show-sidebar')) {
            $('.sidebar-menu').toggleClass('show-sidebar');
            $('.instagram-sidebar').toggleClass('show-sidebar');
        } else {
            $('.instagram-sidebar').toggleClass('show-sidebar');
            $('.main-container').toggleClass('reveal-sidebar');
            $('nav .container').toggleClass('reveal-sidebar');
        }
    });

    $('.main-container').click(function() {
        if ($('.sidebar-menu').hasClass('show-sidebar')) {
            $('.sidebar-menu').toggleClass('show-sidebar');
            $('.main-container').toggleClass('reveal-sidebar');
            $('nav .container').toggleClass('reveal-sidebar');
        }

        if ($('.instagram-sidebar').hasClass('show-sidebar')) {
            $('.instagram-sidebar').toggleClass('show-sidebar');
            $('.main-container').toggleClass('reveal-sidebar');
            $('nav .container').toggleClass('reveal-sidebar');
        }
    });

    /************** Slider Scripts **************/

    $('.hero-slider').flexslider({
        directionNav: false
    });
    $('.testimonials-slider').flexslider({
        directionNav: false
    });

    $('.image-slider').flexslider({
        animation: "slide",
        directionNav: false
    });

    /************** Divider Scripts **************/

    $('.background-image-holder').each(function() {

        // Append background-image <img>'s as li item CSS background for better responsive performance
        var imgSrc = $(this).children('.background-image').attr('src');
        $(this).css('background', 'url("' + imgSrc + '")');
        $(this).children('.background-image').hide();
        $(this).css('background-position', '50% 0%');
        // Check if the slider has a color scheme attached, if so, apply it to the slider nav
    });

    /************** Instagram Feed **************/

    jQuery.fn.spectragram.accessData = {
        accessToken: '1406933036.fedaafa.feec3d50f5194ce5b705a1f11a107e0b',
        clientID: 'fedaafacf224447e8aef74872d3820a1'
    };

    $('.instafeed').each(function() {
        $(this).children('ul').spectragram('getUserFeed', {
            query: $(this).attr('data-user-name')
        });
    });

    /************** Fullscreen Elements **************/

    $('.fullscreen-element').each(function() {
        if ($(window).height() < 768) {
            $(this).css('height', 900);
        } else {
            $(this).css('height', $(window).height());
        }
    });

    /************** Twitter Feed **************/

    $('.tweets-feed').each(function(index) {
        $(this).attr('id', 'tweets-' + index);
    }).each(function(index) {

        function handleTweets(tweets) {
            var x = tweets.length;
            var n = 0;
            var element = document.getElementById('tweets-' + index);
            var html = '<ul class="slides">';
            while (n < x) {
                html += '<li>' + tweets[n] + '</li>';
                n++;
            }
            html += '</ul>';
            element.innerHTML = html;
            return html;
        }

        twitterFetcher.fetch($('#tweets-' + index).attr('data-widget-id'), '', 5, true, true, true, '', false, handleTweets);

    });

    /************** Countdown Timer **************/

    $('.countdown').each(function() {
        $(this).countdown({
            until: new Date($(this).attr('data-date'))
        });
    });

    /************** Map Interaction **************/

    $('.fullwidth-map').click(function() {
        $(this).removeClass('screen');
    });

    $(window).scroll(function() {
        if (!$('.fullwidth-map').hasClass('screen')) {
            $('.fullwidth-map').addClass('screen');
        }
    });

    /************** Contact Form Code **************/

    $('form.email-form').submit(function(e) {
        // return false so form submits through jQuery rather than reloading page.
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;

        console.log('We have a submission...');
        var thisForm = $(this).closest('.email-form'),
            error = 0,
            originalError = thisForm.attr('original-error');

        if (typeof originalError !== typeof undefined && originalError !== false) {
            thisForm.find('.form-error').text(originalError);
        }


        $(thisForm).find('.validate-required').each(function() {
            if ($(this).val() === '') {
                $(this).addClass('field-error');
                error = 1;
            } else {
                $(this).removeClass('field-error');
            }
        });

        $(thisForm).find('.validate-email').each(function() {
            if (!(/(.+)@(.+){2,}\.(.+){2,}/.test($(this).val()))) {
                $(this).addClass('field-error');
                error = 1;
            } else {
                $(this).removeClass('field-error');
            }
        });


        if (error === 1) {
            $(this).closest('.email-form').find('.form-error').fadeIn(200);
        } else {
            jQuery.ajax({
                type: "POST",
                url: "mail/mail.php",
                data: thisForm.serialize(),
                success: function(response) {
                    // Swiftmailer always sends back a number representing numner of emails sent.
                    // If this is numeric (not Swift Mailer error text) AND greater than 0 then show success message.
                    if ($.isNumeric(response)) {
                        if (parseInt(response) > 0) {
                            thisForm.find('.form-success').fadeIn(1000);
                            thisForm.find('.form-error').fadeOut(1000);
                            setTimeout(function() {
                                thisForm.find('.form-success').fadeOut(500);
                            }, 5000);
                        }
                    }
                    // If error text was returned, put the text in the .form-error div and show it.
                    else {
                        // Keep the current error text in a data attribute on the form
                        thisForm.find('.form-error').attr('original-error', thisForm.find('.form-error').text());
                        // Show the error with the returned error text.
                        thisForm.find('.form-error').text(response).fadeIn(1000);
                        thisForm.find('.form-success').fadeOut(1000);
                    }
                }
            });
        }
        return false;
    });

}); 

$(window).load(function() { 

	"use strict";

    var navHeight = $('nav').outerHeight();
    $('.inner-link').smoothScroll({
        offset: -navHeight,
        speed: 800
    });

    /************** Parallax Scripts **************/

    var isFirefox = typeof InstallTrigger !== 'undefined';
    var isIE = /*@cc_on!@*/ false || !!document.documentMode;
    var isChrome = !!window.chrome;
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    var prefix;

    if (isFirefox) {
        prefix = '-moz-';
    } else if (isIE) {

    } else if (isChrome || isSafari) {
        prefix = '-webkit-';
    }

    $('.parallax-background').each(function() {
        $(this).attr('data-bottom-top', prefix + 'transform: translate3d(0px,-100px, 0px)');
        $(this).attr('data-center', prefix + 'transform: translate3d(0px,0px, 0px)');
        $(this).attr('data-top-bottom', prefix + 'transform: translate3d(0px,100px, 0px)');
    });

    if (!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
        skrollr.init({
            forceHeight: false
        });
    }

    $('.tweets-feed').flexslider({
        directionNav: false,
        controlNav: false
    });


    $('.instagram li a').attr('title', '');

    setTimeout(function() {

        $('.instagram li').each(function() {

            // Append background-image <img>'s as li item CSS background for better responsive performance
            var imgSrc = $(this).find('img').attr('src');
            $(this).css('background', 'url("' + imgSrc + '")');
            $(this).find('img').css('opacity', 0);
            $(this).css('background-position', '50% 0%');
            // Check if the slider has a color scheme attached, if so, apply it to the slider nav
        });

    }, 1000);



    //Datepicker
    $('#classdatepicker,#m-classdatepicker').datepicker();

    setTimeout(function() {
        $('.loader').addClass('hide-loader');
        setTimeout(function() {
            $('.loader').remove();
            $('.main-container').addClass('show-content');
            $('nav').addClass('show-content');
        }, 500);
    }, 10);


}); 