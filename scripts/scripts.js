function fixParameters (){
    var header = 50;
    $(".slide").each(function(){
	    if($(this).outerHeight() < $(window).height()){
		    var itemMargin = ($(window).height() - header - $(this).outerHeight()) /2;
		    $(this).css('margin-top', header + itemMargin+'px');
	    }
    });
};

$(function(){
	fixParameters();  
	
    $(window).resize(fixParameters);
});
