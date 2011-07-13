function fixParameters (){
    var count = 0,
        width = $(window).width();
    
    $(".slide").each(function(){
	    if($(this).outerHeight() < $(window).height()){
		    var itemMargin = ($(window).height() - $(this).outerHeight()) /2;
		    $(this).css('margin-top', itemMargin+'px');
		    $(this).css('margin-bottom', itemMargin+'px');
		    $(this).css('width', width+'px');
	    }
	    count++;
    });
    
    // count of slides
    $('#slides').css('width', width*count+'px');
};

function gotoActiveSlide(duration) {   
    var topUrl = History.getState().url.replace(History.getRootUrl(),'').split('/')[0];
 
    if ($("#menu a.active").size() > 0) {
        if (topUrl == '') {
            topUrl = 'home';
        }
        // @todo temporary fix, because links contain html
        topUrl = topUrl.replace('.html', '');

        var offset = $("a[name="+topUrl+"]").parent().offset().left;
    } else {
        var offset = 0;
    }
    
    if (typeof duration === 'undefined') {
        duration = 400;
    }
    
    $('html, body').scrollTo({top: 0, left: offset}, 0, {easing:'swing', duration: duration});
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
        gotoActiveSlide(0);
    });

    var scroll_to_active_content = function(href) {
        addHistory($("#menu a[href='"+href+"']").attr('title'),href);
    };

    $("#menu a, .menu-link").live('click', function(event){
        // Continue as normal for cmd clicks etc
        if ( event.which == 2 || event.metaKey ) { return true; }

        scroll_to_active_content($(this).attr('href'));
        
        event.preventDefault();
        return false;
    });

    // Hook into State Changes
    History.Adapter.bind(window,'statechange',function(){ 
        var relativeUrl = History.getState().url.replace(rootUrl,''),
            topUrl = relativeUrl.split('/')[0];

        $("#menu a").removeClass('active');
        $("#menu a[href='/"+topUrl+"']").addClass('active');
        
        gotoActiveSlide();        
    }); // end onStateChange
	
    $(window).resize(fixParameters);
    $(window).load(gotoActiveSlide);
    
    var m = 'info';
    m += '@';
    $('#copyright a').append(m + 'sellerscout.co.uk').attr('href', 'mailto:' + m + 'sellerscout.co.uk');
});
