// トースト通知クラス
var anToast = (function(){
    'use strict';
    var timer;
    var speed;
    var position;
    // コンストラクタ
    function anToast() {
        this.speed = 3000;
        this.position = 'top';
    }
    // 表示時間(speed)と、位置(top or bottom)を設定
    anToast.prototype.setOption = function(speed, position) {
        this.speed = speed;
        this.position = position;
    }
    // メッセージを表示
    anToast.prototype.show = function(message, style) {
        var addSpeedClass = (style === undefined || style === '') ? '' : 'an-toast-' + style;
        var addPositionClass = 'an-toast-pos-' + this.position;
        $('.an-toast').remove();
        clearTimeout(this.timer);
        $('body').append('<div class="an-toast ' + addSpeedClass + ' ' + addPositionClass + '">' + message + '</div>');
        var leftpos = $('body').width()/2 - $('.an-toast').outerWidth()/2;
        $('.an-toast').css('left', leftpos).hide().fadeIn('fast');
        this.timer = setTimeout(function() {
            $('.an-toast').fadeOut('slow',function(){
                $(this).remove();
            });
        }, this.speed);
    };
    // successのスタイルでメッセージを表示
    anToast.prototype.success = function(message) {
        this.show(message, 'success');
    }
    // warningのスタイルでメッセージを表示
    anToast.prototype.warn = function(message) {
        this.show(message, 'warn');
    }
    // dangerのスタイルでメッセージを表示
    anToast.prototype.danger = function(message) {
        this.show(message, 'danger');
    }
    // 明示的にメッセージを消したい場合は使う
    anToast.prototype.hide = function() {
        $('.an-toast').fadeOut('slow',function() {
            $(this).remove();
        });
    }
    return anToast;
})();