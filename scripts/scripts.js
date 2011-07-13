function fixParameters (){
    $(".slide").each(function(){
	    if($(this).outerHeight() < $(window).height()){
		    var itemMargin = ($(window).height() - $(this).outerHeight()) /2;
		    $(this).css('margin-top', itemMargin+'px');
		    $(this).css('margin-bottom', itemMargin+'px');
	    }
    });
};

$(function(){
	fixParameters();  
	
    $(window).resize(fixParameters);
    
    var m = 'info';
    m += '@';
    $('#copyright a').append(m + 'sellerscout.co.uk').attr('href', 'mailto:' + m + 'sellerscout.co.uk');
});
