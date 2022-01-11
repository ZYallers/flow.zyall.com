(function ($) {
    "use strict";
    var cfg = {
        defAnimation: "fadeInUp",    // default css animation
        scrollDuration: 800,           // smoothscroll duration
        statsDuration: 4000,          // stats animation duration
        mailChimpURL: 'http://facebook.us8.list-manage.com/subscribe/post?u=cdb7b577e41181934ed6a6a44&amp;id=e65110b38d'
    };

    var $WIN = $(window);

    var ot = 'Z2hwX3huNXRISUVtVjI4c1FaaE1JQ1EzdzJYY1FyU0FxdDFvSkMydg==';

    /** GetUrlParam */
    var GetUrlParam = function (name) {
        var arr = window.location.search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
        return arr != null ? arr[2] : null;
    };

    /** Cache */
    var Cache = new WebStorageCache({storage: 'localStorage'});

    /** RandImageCacheSet */
    var RandImageCacheSet = [];

    /* Preloader */
    var Preloader = function () {
        $WIN.on('load', function () {
            // will first fade out the loading animation
            $("#loader").fadeOut("slow", function () {
                // will fade out the whole DIV that covers the website.
                $("#preloader").delay(300).fadeOut("slow");
            });
        });
    };

    /* superfish */
    var SuperFish = function () {
        $('ul.sf-menu').superfish({
            animation: {height: 'show'}, // slide-down effect without fade-in
            animationOut: {height: 'hide'}, // slide-up effect without fade-in
            cssArrows: false, // disable css arrows
            delay: 600 // .6 second delay on mouseout

        });
    };

    /* Mobile Menu */
    var MobileNav = function () {
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

    /* search */
    var Search = function () {
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

    /** Smooth Scrolling */
    var SmoothScroll = function () {
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

    /* Placeholder Plugin Settings */
    var Placeholder = function () {
        $('input, textarea, select').placeholder();
    };

    /** Back to Top */
    var BackToTop = function () {
        var pxShow = 500,              // height on which the button will show
            fadeInTime = 400,          // how slow/fast you want the button to show
            fadeOutTime = 400,         // how slow/fast you want the button to hide
            scrollSpeed = 300,         // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'
            goTopButton = $("#go-top");

        // Show or hide the sticky footer button
        $WIN.on('scroll', function () {
            if ($WIN.scrollTop() >= pxShow) {
                goTopButton.fadeIn(fadeInTime);
            } else {
                goTopButton.fadeOut(fadeOutTime);
            }
            
            if (SoHuCsIsNeed && !SoHuCsHaveLoaded) {
                SoHuCsScroll();
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

    /** BodyBackgroundImage */
    var BodyBackgroundImage = function () {
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
    var GetContent = function (callback) {
        var sha = GetUrlParam('s');
        if (sha === null || sha === '') {
            iziToast.error({
                timeout: 5000,
                icon: 'fa fa-frown-o',
                position: 'topRight',
                title: ts.toUpperCase(),
                message: '参数错误！'
            });
            return;
        }
        var isNeedReload = true;
        var parseItemContent = function (resp) {
            var size = resp["size"];
            var content = resp["content"];
            var contentHtml = Base64.decode(content);

            /** 第一行是注释；第二行是标题；第三行是引用 */
            var arr = contentHtml.split('\n');
            var date = '', meta = '', image = '', title= '';
            if (arr[0].match(/^\[\/\/\]:# [\("](.*)?[\)"]/g) != null && RegExp.$1 !== ''){
                var tmp = RegExp.$1.split('|');
                if (tmp.length ===3){
                    date = tmp[0];
                    meta = tmp[1];
                    image = tmp[2];
                }
                title = arr[1].replace('#','').trim();
            }else{
                title = arr[0].replace('#','').trim();
            }

            $('head').children('title').eq(0).text(title + " - Flow Your Life");
            $("meta[name='description']").attr("content", title + ",Flow Your Life");
            $("#item-title").text(title);

            image = image || GetOneRandImage(window.SECTION_IMAGE)
            $('#item-posters').attr('src', image);

            $("#item-size").text((size / 1024).toFixed(2) + " KB");

            if (date !== ''){
                $("#item-date").removeClass('hide').text(date);
            }

            if (meta !== ''){
                $('#item-meta').attr("href", "/?m=" + meta.toLowerCase()).text(meta.toUpperCase());
            }

            showdown.setFlavor('github');
            var conv = new showdown.Converter();
            var $itemBody = $('#item-body');
            $itemBody.html(conv.makeHtml(contentHtml));

            // 重复标题处理
            var $bodyH1 = $itemBody.find('h1');
            if ($bodyH1.length > 0) {
                $bodyH1.eq(0).hide();
            }

            // 代码高亮
            if (window.prettyPrint) {
                $('pre').addClass("prettyprint linenums");
                prettyPrint();
            }
        };

        if (Cache.isSupported()) {
            var str = Cache.get(sha);
            if (str) {
                isNeedReload = false;
                console.log('read from cache, sha:', sha);
                parseItemContent(JSON.parse(str));
                callback();
            }
        }

        if (isNeedReload) {
            $.ajax({
                url: 'https://api.github.com/repos/ZYallers/ZYaller/git/blobs/' + sha,
                headers: {Authorization: "token " + Base64.decode(ot)},
                async: true, // 异步方式
                timeout: 5000, // 5秒
                dataType: 'json',
                complete: function (xhr, ts) {
                    console.log('reload data, sha:', sha);
                    if (ts !== "success") {
                        iziToast.error({
                            timeout: 5000,
                            icon: 'fa fa-frown-o',
                            position: 'topRight',
                            title: ts.toUpperCase(),
                            message: '网络异常，请刷新页面重试！'
                        });
                        return;
                    }
                    if (Cache.isSupported()) {
                        Cache.set(sha, xhr["responseText"], {exp: 3600}); // 缓存1小时
                    }
                    parseItemContent(xhr["responseJSON"]);
                    typeof (callback) == 'function' && callback();
                }
            });
        }
    };

    /** LoadJS */
    var LoadJS = function (d, a) {
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

    /** SohuChangYan */
    var $sohucs = $("#SOHUCS"),
        SoHuCsIsNeed = false,
        SoHuCsHaveLoaded = false,
        SoHuCsScroll = function () {
        var mobileWidth = 415;
        var clientWidth = window.innerWidth || document.documentElement.clientWidth;
        var minHeight = clientWidth < 500 ? 700 : 400;

        if ($(document).height() - $WIN.height() - $WIN.scrollTop() > minHeight) {
            return;
        }

        SoHuCsHaveLoaded = true;
        $sohucs.parent().slideDown();

        var appid = 'cyvtmo2ww';
        var conf = 'prod_2245ad762922c6b6c41386af7264cdad';

        if (clientWidth < mobileWidth) {
            var head = document.getElementsByTagName('head')[0] || document.head || document.documentElement;
            var script = document.createElement('script');
            script.id = 'changyan_mobile_js';
            script.src = 'https://cy-cdn.kuaizhan.com/upload/mobile/wap-js/changyan_mobile.js?client_id=' + appid + '&conf=' + conf;
            head.appendChild(script);
        } else {
            LoadJS("https://cy-cdn.kuaizhan.com/upload/changyan.js", function () {
                window.changyan.api.config({appid: appid, conf: conf});
            });
        }

        setTimeout(function () {
            $("div.bricks-loading").slideUp("normal", function () {
                $sohucs.slideDown("slow", function () {
                    if (clientWidth < mobileWidth) {
                        $("div.list-footer-wrapper-wap").remove();
                        setTimeout(function () {
                            $("span.prop-ico").parent().remove();
                        }, 1000);
                    } else {
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

    },
        SohuChangYan = function () {
        SoHuCsIsNeed = true;
        var sid = GetUrlParam('s');
        if (sid === null || sid === "") {
            return;
        }
        $sohucs.attr("sid", sid);
    };

    /** Initialize */
    (function ssInit() {
        BodyBackgroundImage();
        GetContent(SohuChangYan);
        Preloader();
        SuperFish();
        MobileNav();
        Search();
        SmoothScroll();
        Placeholder();
        BackToTop();
    })();

})(jQuery);
