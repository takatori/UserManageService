(function(global) {
    "use strict";

    var userId, configId, tagName;

    $('.tag-button').hover(
        // マウスが乗った時
        function () {
            $(this).removeClass('btn-primary');
            $(this).addClass('btn-danger');                        
        },
        // マウスがはずれた時
        function () {
            $(this).addClass('btn-primary');
            $(this).removeClass('btn-danger');                                    
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
