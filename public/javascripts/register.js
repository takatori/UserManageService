// html5のFileAPIを用いてアイコン画像をbase64変換してアップロードする
(function() {
    "use strict";

    $('#icon_file').change(function () {

        var icon_file       = this.files[0];                  // 入力ファイル
        var input_type      = icon_file.type;                 // 入力のMIMEタイプ
        var available_type  = ['image/jpeg','image/png'];     // 許可されいているMIMEタイプ           
        var size            = icon_file.size;                 // ファイル容量 (byte)
        var limit           = 100000;                            // ファイルサイズ制限 byte, 100KB

        
        var reader = new FileReader();
        
        // ファイル読み込み後の処理
        reader.addEventListener("loadend", function (e) {
            var base64URL = reader.result;
            $('#icon_thumbnail').attr("src", base64URL);
            $('#icon_base64_img').val(base64URL); // formに値を設定
            console.log($('#icon_base64_img').val());
        });

        // ファイルのチェック
        if (icon_file && checkMIME(input_type, available_type) && checkSize(size, limit)) {
            reader.readAsDataURL(icon_file);
        } else {
            $('#icon_base64_img').val("");
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
            alert('100KBを超えています。100KB以下のファイルを選択してください。');
            return false;
        } else {
            return true;
        }
    }

})((this || 0).self || global);
