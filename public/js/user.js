$(function(){

    $('form').on('keyup change', function() {
        var target = $(this).children('button')[0];
        $(target).css("visibility", "visible");
    });
});
