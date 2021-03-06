// html5のFileAPIを用いてアイコン画像をbase64変換してアップロードする
(function() {
    "use strict";

    var $preview = $('#image-preview');
    var $file = $('#img-file-selector');

    $file.change(function () {
        var icon_file       = this.files[0];                  // 入力ファイル
        var input_type      = icon_file.type;                 // 入力のMIMEタイプ
        var available_type  = ['image/jpeg','image/png'];     // 許可されいているMIMEタイプ           
        var size            = icon_file.size;                 // ファイル容量 (byte)
        var limit           = 1000000;                            // ファイルサイズ制限 byte, 1000KB

        
        var reader = new FileReader();
        
        // ファイル読み込み後の処理
        reader.addEventListener("loadend", function (e) {
            var base64URL = reader.result;
            $preview.attr("src", base64URL);
            $('#base64-icon-img').val(base64URL);
        });

        // ファイルのチェック
        if (icon_file && checkMIME(input_type, available_type) && checkSize(size, limit)) {
            reader.readAsDataURL(icon_file);
        } else {
            $file.val("");
            return;
        }
    });

    // MIMEタイプの判定
    function checkMIME(input_type, available_type) {
        // input_type
        if ($.inArray(input_type, available_type) >= 0) {
            return true;
        } else {
            alert('選択できるファイルはJPEG画像か、PNG画像のみです。');
            return false;
        }
    }

    // 入力ファイルの大きさをチェックする
    function checkSize(size, limit) {
        if (size > limit) {
            alert('1000KBを超えています。1000KB以下のファイルを選択してください。');
            return false;
        } else {
            return true;
        }
    }

})((this || 0).self || global);


