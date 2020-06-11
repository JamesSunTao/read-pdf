//扩展jq方法 （图片放大缩小）
$.fn.popImg = function () {
    var timer = null,
        $window = $(window);

    var $layer = $('<div/>').css({
        position: 'fixed',
        left: 0,
        right: 0,
        id: "hahaha",
        top: 0,
        bottom: 0,
        height: '100%',
        width: '100%',
        zIndex: 9999999,
        background: '#000',
        opacity: '0.6',
        display: 'none'
    }).attr('pop-b-layer', 1);

    var zoomImg = function (o) {
        var zoom = parseInt(o.style.zoom, 10) || 100;
        zoom += event.wheelDelta / 2; //可适合修改
        if (zoom > 0) o.style.zoom = zoom + '%';
    }

    var cloneImg = function ($node) {
        var offset = $node.offset();
        console.log($node.attr('src'))
        // $node.bind("mousewheel",
        //function () {
        //    zoomImg(this);
        //    return false;
        //});
        return $node.clone().css({
            position: 'fixed',
            width: $node.width(),
            left: offset.left,
            top: offset.top,
            zIndex: 50000000
        });
    };

    var justifyImg = function ($c) {
        var dW = $window.width(),
            dH = $window.height();
        $c.css('cursor', 'zoom-out').attr('pop-b-img', 1);
        var img = new Image();
        img.onload = function () {
            var tempImg = document.createElement('img');
            tempImg.src = this.src;
            var w = tempImg.width, h = tempImg.height;

            if (dW / w >= dH / h) {
                $c.stop().animate({
                    height: '100%',
                    left: (dW - w * dH / h) / 2,
                    top: 0
                }, 300);
                $c[0].setAttribute('width', 'auto');
                $c[0].style.width = 'auto';
            } else {
                $c.stop().animate({
                    height: 'auto',
                    width: '100%',
                    left: 0,
                    top: (dH - h * dW / w) / 2
                }, 300);
                $c[0].setAttribute('height', 'auto');
                $c[0].style.height = 'auto';
            }
            setTimeout(function () {
                $c.on('click', function () {
                    $c.remove();
                    $('div[pop-b-layer="1"]').fadeOut(300)
                })
            }, 400)
        };
        img.src = $c.attr('src');
    };

    $window.on('resize', function () {
        $('img[pop-b-img]').each(function () {
            var $this = $(this);
            timer && clearTimeout(timer);
            timer = setTimeout(function () {
                justifyImg($this);
            }, 50);
        });
    });

    $window.on('keydown', function (evt) {
        if (evt.which === 27) {
            $layer.fadeOut(300);
            $('img[pop-b-img]').remove();
        }
    });
    //$("#js-ulRightExtracts img").popImg();
    $window.on('click', function (evt) {
        $("#setFontAndBg").hide();//hide setfont
        $(".w-pop-wrap .select-up").hide();
        var $this = $(evt.target);
        if ($this.attr('pop-b-layer') || $this.attr('pop-b-img')) {
            $layer.fadeOut(300);
            $('img[pop-b-img]').remove();
            $("#okms_top", parent.document).children(".okms-top").removeClass("z-10"); //解决top被遮挡问题

        }
    });

    return this.each(function () {
        var obj = $(this).parent().attr('id');
        if (obj === "Refence" || obj === "ytzl" || obj === "Modefy") {
            return true;  //跳出本次循环
        }
        var $self = $(this);
        if ($self.attr('src').indexOf('read/Scripts/ueditor/dialogs/attachment/fileTypeImages/icon_jpg.gif') > 0) return;
        $self.css('cursor', 'zoom-in').on('click', function () {
            if($('img[pop-b-img="1"]').length) return;
            var $body = $(document.body);
            //if (!$("#hahaha").length) {
            $layer.remove()
            $layer.appendTo($body);
            //}
            $layer.fadeIn(300);
            var $clone = cloneImg($self);
            //$clone
            $clone.appendTo($body);
            justifyImg($clone);
            $("#okms_top", parent.document).children(".okms-top").addClass("z-10"); //解决top被遮挡问题
        });
    });
};