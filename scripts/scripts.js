function fixParameters (){
    $(".slide").each(function(){
	    if($(this).outerHeight() < $(window).height()){
		    var itemMargin = ($(window).height() - $(this).outerHeight()) /2;
		    $(this).css('margin-top', itemMargin+'px');
	    }
    });
};

$(function(){
	fixParameters();  
	
    $(window).resize(fixParameters);
});
