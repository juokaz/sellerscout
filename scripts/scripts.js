function fixParameters (){
    var count = 0,
        width = $(window).width();
    
    if (width < 1190) {
        width = 1190;
    }
    
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

function gotoActiveSlide(duration) {   
    var topUrl = History.getState().url.replace(History.getRootUrl(),'').split('/')[0],
        duration = parseInt(duration);

    if ($("#menu a.active").size() > 0) {
        if (topUrl == '') {
            topUrl = 'home';
        }
        // @todo temporary fix, because links contain html
        topUrl = topUrl.replace('.html', '');

        var left_offset = $("a[name="+topUrl+"]").parent().offset().left,
            top_offset = $("a[name="+topUrl+"]").parent().offset().top;
    } else {
        var left_offset = top_offset = 0;
    }
    
    if (isNaN(duration)) {
        duration = 0;
    }
    
    // navigation order is different because contact is placed at the top of slides
    if (topUrl != 'contact') {
        var axis = "yx";
    } else {
        var axis = "xy";
    }
    
    $('html, body').scrollTo({top: top_offset, left: left_offset}, 0, {easing:'swing', duration: duration, queue: true, axis: axis});    
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
        window._gaq.push(['_trackEvent', 'Menu', 'Click', title, url]);
    }
}

$(function(){

    var	History = window.History,
	    rootUrl = History.getRootUrl(),
        url = History.getPageUrl();
        
	fixParameters();  
	
	// check if homepage
    if (rootUrl.replace(url, '') != rootUrl) {
        var relativeUrl = 'home';
    } else {
        var relativeUrl = url.replace(/\/$/, '').replace(rootUrl,'');
    }
    
    var topUrl = relativeUrl.split('/')[0];    
      
    if (relativeUrl !== "" && $("#menu a[href='/"+topUrl+"']").length){
        $("#menu a").removeClass('active');
        $("#menu a[href='/"+topUrl+"']").addClass('active');
    }
    
    $('#slides').load('/slides.html', function() {
        fixParameters();
        
        $(".default-text").blur();
        
        var m = 'info';
        m += '@';
        $('a.sellerscout-email').append(m + 'sellerscout.co.uk').attr('href', 'mailto:' + m + 'sellerscout.co.uk');
    });

    $("#menu a, .menu-link").live('click', function(event){
        // Continue as normal for cmd clicks etc
        if ( event.which == 2 || event.metaKey ) { return true; }

        addHistory($(this).attr('title'), $(this).attr('href'));
        
        event.preventDefault();
        return false;
    });
    
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
    
    $(".default-text").blur();  

    // Hook into State Changes
    History.Adapter.bind(window,'statechange',function(){ 
        var relativeUrl = History.getState().url.replace(rootUrl,''),
            topUrl = relativeUrl.split('/')[0];

        $("#menu a").removeClass('active');
        $("#menu a[href='/"+topUrl+"']").addClass('active');
        
        gotoActiveSlide(400);        
    }); // end onStateChange
	
    $(window).resize(fixParameters);    
});
