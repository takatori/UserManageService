(function(global) {
    "use strict";

    var userId, configId, tagName;

    $('.tag-button').hover(
        // マウスが乗った時
        function () {
        	$(this).append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
        },
        // マウスがはずれた時
        function () {
        	$(this).find('span:last').remove();
        });

    $('.tag-button').click(
        function () {
            userId = $(this).attr('userId');
            configId = $(this).attr('configId');
            tagName = $(this).text();
            var self = this;
            console.log(tagName);
            $.ajax({
                type : "DELETE",
                url  : "/apis/users/" + userId + "/configs/" + configId + /tags/ + tagName,
                success : function(m){
                    console.log(m);
                    $(self).remove();
                }, 
                error: function(e) {
                    console.log(e);
                }
            });             
        }
    );
})((this || 0).self || global);
