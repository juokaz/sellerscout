function fixParameters (){
    var count = 0,
        width = $(window).width();

    $(".slide").each(function(){
	    if($(this).outerHeight() < $(window).height()){
	        if (!$(this).hasClass('contact')) {
		        var itemMargin = ($(window).height() - $(this).outerHeight()) /2;
		        $(this).css('margin-top', Math.ceil(itemMargin)+'px');
		        $(this).css('margin-bottom', Math.floor(itemMargin)+'px');
		    }
		    $(this).css('width', width+'px');
	    }
	    count++;
    });

    // count of slides
    $('#slides').css('width', width*count+'px');

    gotoActiveSlide();
};

function getRootUrl()
{
    return History.getRootUrl() + "sellerscout/"
}

function gotoActiveSlide(duration) {
    // This is a static page
    if ($(".static").length != 0) {
        return false;
    }

    var topUrl = History.getState().url.replace(getRootUrl(),'').split('/')[0].replace('.html', '');
        duration = parseInt(duration);

    if ($("#menu a.active").size() > 0) {
        if (topUrl == '') {
            topUrl = 'home';
        }

        var left_offset = $("a[name="+topUrl+"]").parent().offset().left,
            top_offset = $("a[name="+topUrl+"]").parent().offset().top;
    } else {
        var left_offset = top_offset = 0;
    }

    if (isNaN(duration)) {
        duration = 0;
    }

    // set top elements to be in absolute location
    var set_absolute = function () {
        $('#menu, #logo, #copyright, #creator').css('position', 'absolute');
        $('#menu').css('top', '245px');
        $('#logo').css('top', '225px');
        $('#copyright').css('bottom', '-165px');
        $('#creator').css('bottom', '-175px');
    };

    // set top elements to be in fixed position
    var set_fixed = function () {
        $('#menu, #logo, #copyright, #creator').css('position', 'fixed');
        $('#menu').css('top', '40px');
        $('#logo').css('top', '20px');
        $('#copyright').css('bottom', '40px');
        $('#creator').css('bottom', '30px');
    };

    // navigation order is different because contact is placed at the top of slides
    if (topUrl != 'contact') {
        // Slide is already in Y axis, onAfterFirst will not be executed
        if ($(window).scrollTop() == top_offset) {
            set_fixed();
        }

        // scroll to correct slide
        $(window).scrollTo({top: top_offset, left: left_offset}, 0, {easing:'swing', duration: duration, queue: true, axis: "yx", onAfterFirst: function() {
            set_fixed();
        }});
    } else {
        // Slide is already in X axis, onAfterFirst will not be executed
        if ($(window).scrollLeft() == left_offset) {
            set_absolute();
        }

        // scroll to correct slide
        $(window).scrollTo({top: top_offset, left: left_offset}, 0, {easing:'swing', duration: duration, queue: true, axis: "xy", onAfterFirst: function() {
            set_absolute();
        }});
    }

}

function addHistory(title, url, section) {
    if (section) {
        title = title + " - " + section;
    }

    if (title) {
        title = title + " - SellerScout";
    } else {
        title = "SellerScout";
    }

    History.pushState(null,title,url);

    // Inform Google Analytics of the change
    if ( typeof window._gaq !== 'undefined' ) {
        window._gaq.push(['_trackEvent', 'Menu', 'Click', title]);
    }
}

$(function(){

    var	dynamic = $(".static").length == 0,
        History = window.History,
	    rootUrl = getRootUrl(),
        url = History.getPageUrl();

    fixParameters();

	if (dynamic) {
        if (History.enabled) {

	        // check if homepage
            if (rootUrl.replace(url, '') != rootUrl) {
                var relativeUrl = 'home';
            } else {
                var relativeUrl = url.replace(/\/$/, '').replace(rootUrl,'');
            }

            var topUrl = relativeUrl.split('/')[0];

            if (relativeUrl !== "" && $("#main-menu a[href='"+topUrl.replace('.html', '')+"']").length){
                $("#menu a").removeClass('active');
                $("#menu a[href='"+topUrl+"']").addClass('active');
            }

            $("#menu a, .menu-link").live('click', function(event){
                // Continue as normal for cmd clicks etc
                if ( event.which == 2 || event.metaKey ) { return true; }

                addHistory($(this).attr('title'), $(this).attr('href'));

                event.preventDefault();
                return false;
            });
        }

        $('#slides').load('slides.html', function() {
            fixParameters();

            $(".default-text").blur();

            var m = 'info';
            m += '@';
            $('a.sellerscout-email').append(m + 'sellerscout.co.uk').attr('href', 'mailto:' + m + 'sellerscout.co.uk');
        });
    }

    $(".default-text").live('focus', function(srcc)
    {
        if ($(this).val() == $(this)[0].title)
        {
            $(this).removeClass("default-text-active");
            $(this).val("");
        }
    });

    $(".default-text").live('blur', function()
    {
        if ($(this).val() == "")
        {
            $(this).addClass("default-text-active");
            $(this).val($(this)[0].title);
        }
    });

    $('#contacts-form').live('submit', function() {
        var data = { Field4: $('#name').val(), Field12: $('#mail').val(), Field7: $('#message').val(), idstamp: "O3YIB49IpdLWUVsv5SjSIyvr6Y3qYGB7SWtx8zc5zss=" };
        $.post("/contact-process", data)
            .complete(function(XMLHttpRequest) {
                if (XMLHttpRequest.status == 302) {
                    $('#name').val('');
                    $('#mail').val('');
                    $('#message').val('');
                }
            });
        return false;
    });

    $('#subscribe-form').live('submit', function() {
        var data = { Field1: $('#subscribe-form .email').val(), idstamp: "mZFO5GJ8JE8jXtIKLMARtQ2GqdctvrUBTM/M7jwV4w4=" };
        $.post("/subscribe-process", data)
            .complete(function(XMLHttpRequest) {
                if (XMLHttpRequest.status == 302) {
                    $('#subscribe-form .email').val('');
                    $(".default-text").blur();
                }
            });
        return false;
    });

    // Hook into State Changes
    History.Adapter.bind(window,'statechange',function(){
        var relativeUrl = History.getState().url.replace(rootUrl,''),
            topUrl = relativeUrl.split('/')[0].replace('.html', '');

        $("#menu a").removeClass('active');
        $("#menu a[href='"+topUrl+"'.html]").addClass('active');

        gotoActiveSlide(400);
    }); // end onStateChange

    $(window).resize(fixParameters);
    $(window).load(fixParameters);
});
