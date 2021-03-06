(function ($) {

    "use strict";

    var cfg = {
        defAnimation: "fadeInUp",    // default css animation
        scrollDuration: 800,           // smoothscroll duration
        statsDuration: 4000,          // stats animation duration
        mailChimpURL: 'http://facebook.us8.list-manage.com/subscribe/post?u=cdb7b577e41181934ed6a6a44&amp;id=e65110b38d'
    };

    var $WIN = $(window);

    var ot = 'Z2hwX2dHWDRPcXBlbFNCRXM1bDNxdmJvdFN6WEJXOXVhMjMzNXJlMQ==';

    /** GetUrlParam */
    var GetUrlParam = function (name) {
        var arr = window.location.search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
        return arr != null ? arr[2] : null;
    };

    /** Base64 encode/decode see http://www.webtoolkit.info */
    var Base64 = {
        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = Base64._utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            return output;
        },

        // public method for decoding
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }

                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = Base64._utf8_decode(output);
            return output;
        },

        // private method for UTF-8 encoding
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode: function (utftext) {
            var string = "", i = 0, c = 0, c1 = 0, c2 = 0, c3 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
    };

    /** Cache */
    var Cache = new WebStorageCache({storage: 'localStorage'});

    /** RandImageCacheSet */
    var RandImageCacheSet = [];


    /* Preloader
     * -------------------------------------------------- */
    var ssPreloader = function () {
        $WIN.on('load', function () {
            // will first fade out the loading animation
            $("#loader").fadeOut("slow", function () {
                // will fade out the whole DIV that covers the website.
                $("#preloader").delay(300).fadeOut("slow");
            });
        });
    };


    /* superfish
     * -------------------------------------------------- */
    var ssSuperFish = function () {
        $('ul.sf-menu').superfish({
            animation: {height: 'show'}, // slide-down effect without fade-in
            animationOut: {height: 'hide'}, // slide-up effect without fade-in
            cssArrows: false, // disable css arrows
            delay: 600 // .6 second delay on mouseout

        });
    };


    /* Mobile Menu
     * -------------------------------------------------- */
    var ssMobileNav = function () {
        var toggleButton = $('.menu-toggle'),
            nav = $('.main-navigation');

        toggleButton.on('click', function (event) {
            event.preventDefault();

            toggleButton.toggleClass('is-clicked');
            nav.slideToggle();
        });

        if (toggleButton.is(':visible')) nav.addClass('mobile');

        $WIN.resize(function () {
            if (toggleButton.is(':visible')) nav.addClass('mobile');
            else nav.removeClass('mobile');
        });

        $('#main-nav-wrap li a').on("click", function () {
            if (nav.hasClass('mobile')) {
                toggleButton.toggleClass('is-clicked');
                nav.fadeOut();
            }
        });

    };


    /* search
     ------------------------------------------------------ */
    var ssSearch = function () {
        var searchWrap = $('.search-wrap');
        var searchField = searchWrap.find('.search-field');
        var closeSearch = $('#close-search');
        var searchTrigger = $('.search-trigger');
        var body = $('body');

        searchTrigger.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $this = $(this);

            body.addClass('search-visible');
            setTimeout(function () {
                $('.search-wrap').find('.search-field').focus();
            }, 100);

        });

        closeSearch.on('click', function () {
            var $this = $(this);

            if (body.hasClass('search-visible')) {
                body.removeClass('search-visible');
                setTimeout(function () {
                    $('.search-wrap').find('.search-field').blur();
                }, 100);
            }
        });

        searchWrap.on('click', function (e) {
            if (!$(e.target).is('.search-field')) {
                closeSearch.trigger('click');
            }
        });

        searchField.on('click', function (e) {
            e.stopPropagation();
        });

        searchField.attr({placeholder: 'Type Your Keywords', autocomplete: 'off'});
    };


    /*	Masonry
    ------------------------------------------------------ */
    var ssMasonryFolio = function () {
        var containerBricks = $('.bricks-wrapper');
        containerBricks.imagesLoaded(function () {
            containerBricks.masonry({
                itemSelector: '.entry',
                columnWidth: '.grid-sizer',
                percentPosition: true,
                resize: true
            });

        });
    };


    /* animate bricks
      * ------------------------------------------------------ */
    var ssBricksAnimate = function () {
        var animateEl = $('.animate-this');
        $WIN.on('load', function () {
            setTimeout(function () {
                animateEl.each(function (ctr) {
                    var el = $(this);
                    setTimeout(function () {
                        el.addClass('animated fadeInUp');
                    }, ctr * 200);

                });
            }, 200);
        });

        $WIN.on('resize', function () {
            // remove animation classes
            animateEl.removeClass('animate-this animated fadeInUp');
        });
    };


    /* Smooth Scrolling
      * ------------------------------------------------------ */
    var ssSmoothScroll = function () {
        $('.smoothscroll').on('click', function (e) {
            var target = this.hash,
                $target = $(target);

            e.preventDefault();
            e.stopPropagation();

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, cfg.scrollDuration, 'swing').promise().done(function () {
                // check if menu is open
                if ($('body').hasClass('menu-is-open')) {
                    $('#header-menu-trigger').trigger('click');
                }
                window.location.hash = target;
            });
        });
    };


    /* Placeholder Plugin Settings
      * ------------------------------------------------------ */
    var ssPlaceholder = function () {
        $('input, textarea, select').placeholder();
    };


    /* Back to Top
      * ------------------------------------------------------ */
    var ssBackToTop = function () {
        var pxShow = 500,              // height on which the button will show
            fadeInTime = 400,          // how slow/fast you want the button to show
            fadeOutTime = 400,         // how slow/fast you want the button to hide
            scrollSpeed = 300,         // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'
            goTopButton = $("#go-top");

        // Show or hide the sticky footer button
        $(window).on('scroll', function () {
            if ($(window).scrollTop() >= pxShow) {
                goTopButton.fadeIn(fadeInTime);
            } else {
                goTopButton.fadeOut(fadeOutTime);
            }
        });
    };


    /** GetOneRandImage */
    var GetOneRandImage = function (source) {
        var getFunc = function () {
            return source[Math.floor((Math.random() * source.length))];
        };
        var res = getFunc();
        while (RandImageCacheSet.indexOf(res) !== -1) {
            res = getFunc();
        }
        RandImageCacheSet.push(res);
        return res;
    };


    /**
     * SetBodyBackgroundImage
     */
    var ssBodyBackgroundImage = function () {
        $('body').css({
            'background-image': 'url(' + GetOneRandImage(window.BACKGROUND_IMAGE) + ')',
            'transition': 'transform .3s ease-out',
            'background-color': 'transparent',
            'background-size': 'cover',
            'background-position': 'center center',
            'background-repeat': 'no-repeat',
            'background-attachment': 'fixed',
            '-webkit-animation': 'fadein .5s ease-out 0s forwards'
        });
    };


    /** ssGetContent */
    var ssGetContent = function (callback) {
        var iPath = GetUrlParam("i");
        if (iPath === null || iPath === "") {
            iziToast.error({
                timeout: 5000,
                icon: 'fa fa-frown-o',
                position: 'topRight',
                title: ts.toUpperCase(),
                message: "参数错误！"
            });
            return;
        }

        var path = Base64.decode(iPath);

        var isNeedReload = true;

        var parseItemContent = function (resp) {
            var name = resp["name"],
                size = resp["size"],
                content = resp["content"];

            var $headTitle = $("head").children('title').eq(0),
                $description = $("meta[name='description']"),
                $itemPosters = $("#item-posters"),
                $itemTitle = $("#item-title"),
                $itemSize = $("#item-size"),
                $itemBody = $("#item-body"),
                $itemTag = $("#item-tag");

            $itemPosters.attr("src", GetOneRandImage(window.SECTION_IMAGE));

            var itemTitle = name.substring(0, name.indexOf(".md"));
            $headTitle.text(itemTitle + " - Flow Your Life"); // 标题
            $description.attr("content", itemTitle + ",Flow Your Life");
            $itemTitle.text(itemTitle);

            var kb = (size / 1024).toFixed(2);
            $itemSize.text(kb + " KB");

            var tag = path.split("/");
            $itemTag.attr("href", "/?m=" + tag[1]);
            $itemTag.text(tag[1].toUpperCase());

            showdown.setFlavor('github');
            var conv = new showdown.Converter();
            var htmlContent = conv.makeHtml(Base64.decode(content)); // 将MarkDown转为html格式的内容
            $itemBody.html(htmlContent);

            // 重复标题处理
            if ($itemBody.find("h1").length > 0) {
                $itemBody.find("h1").eq(0).hide();
            }

            // 代码高亮
            if (window.prettyPrint) {
                $('pre').addClass("prettyprint linenums");
                prettyPrint();
            }
        };

        if (Cache.isSupported()) {
            var str = Cache.get(iPath);
            if (str) {
                isNeedReload = false;
                console.log('read from cache: ', path);
                parseItemContent(JSON.parse(str));
                typeof (callback) == 'function' && callback();
            }
        }

        if (isNeedReload) {
            $.ajax({
                url: "https://api.github.com/repositories/97666535/contents/" + path,
                headers: {Authorization: "token " + Base64.decode(ot)},
                async: true, // 异步方式
                timeout: 10000, // 10秒
                dataType: 'json',
                complete: function (xhr, ts) {
                    console.log('reload data: ', path);
                    if (ts !== "success") {
                        iziToast.error({
                            timeout: 5000,
                            icon: 'fa fa-frown-o',
                            position: 'topRight',
                            title: ts.toUpperCase(),
                            message: "网络异常，请刷新页面重试！"
                        });
                        return;
                    }
                    if (Cache.isSupported()) {
                        Cache.set(iPath, xhr["responseText"], {exp: 3600}); // 缓存1小时
                    }
                    parseItemContent(xhr["responseJSON"]);
                    typeof (callback) == 'function' && callback();
                }
            });
        }
    };

    /** loadJs */
    var loadJs = function (d, a) {
        var c = document.getElementsByTagName("head")[0] || document.head || document.documentElement;
        var b = document.createElement("script");
        b.setAttribute("type", "text/javascript");
        b.setAttribute("charset", "UTF-8");
        b.setAttribute("src", d);
        if (typeof a === "function") {
            if (window.attachEvent) {
                b.onreadystatechange = function () {
                    var e = b.readyState;
                    if (e === "loaded" || e === "complete") {
                        b.onreadystatechange = null;
                        a();
                    }
                }
            } else {
                b.onload = a;
            }
        }
        c.appendChild(b);
    };

    var ssSohuChangYan = function () {
        var iPath = GetUrlParam("i");
        if (iPath === null || iPath === "") {
            return;
        }

        $("#SOHUCS").attr("sid", iPath);

        $(window).on('scroll', function () {
            var mobileWidth = 415;
            var clientWidth = window.innerWidth || document.documentElement.clientWidth;
            var minHeight = clientWidth < 500 ? 700 : 400;

            if ($(document).height() - $(window).height() - $(window).scrollTop() > minHeight) {
                return;
            }

            $(window).off('scroll');
            $("#SOHUCS").parent().slideDown();

            var appid = 'cyvtmo2ww';
            var conf = 'prod_2245ad762922c6b6c41386af7264cdad';

            if (clientWidth < mobileWidth) {
                var head = document.getElementsByTagName('head')[0] || document.head || document.documentElement;
                var script = document.createElement('script');
                script.id = 'changyan_mobile_js';
                script.src = 'https://cy-cdn.kuaizhan.com/upload/mobile/wap-js/changyan_mobile.js?client_id=' + appid + '&conf=' + conf;
                head.appendChild(script);
            } else {
                loadJs("https://cy-cdn.kuaizhan.com/upload/changyan.js", function () {
                    window.changyan.api.config({appid: appid, conf: conf});
                });
            }

            setTimeout(function () {
                $("div.bricks-loading").slideUp("normal", function () {
                    $("#SOHUCS").slideDown("slow", function () {
                        if(clientWidth < mobileWidth){
                            $("div.list-footer-wrapper-wap").remove();
                            setTimeout(function () {
                                $("span.prop-ico").parent().remove();
                            }, 1000);
                        }else{
                            $("div.module-cmt-footer").remove();
                            setTimeout(function () {
                                $("span.click-prop-gw").each(function () {
                                    $(this).prev().remove();
                                    $(this).remove();
                                });
                            }, 1000);
                        }
                    });
                });
            }, 3000);

        });
    };


    /* Initialize
      * ------------------------------------------------------ */
    (function ssInit() {
        ssBodyBackgroundImage();
        ssGetContent(ssSohuChangYan);
        ssPreloader();
        ssSuperFish();
        ssMobileNav();
        ssSearch();
        ssMasonryFolio();
        ssBricksAnimate();
        ssSmoothScroll();
        ssPlaceholder();
        ssBackToTop();
    })();

})(jQuery);