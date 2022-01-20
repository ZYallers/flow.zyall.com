(function ($) {
    "use strict";
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
    var Photo = {
        backgroundBaseUrl: 'https://hxsupload-oss.hxsapp.com/lib/flow/image/background/',
        background: [
            'IKMsqwyaR6qN0kq48STw_annapurna.jpg',
            'photo-1432256851563-20155d0b7a39.jpeg',
            'photo-1444041401850-6d9f537550c4.jpeg',
            'photo-1482192505345-5655af888cc4.jpeg',
            'photo-1488503674815-d6c13687ff65.jpeg',
            'photo-1489703197108-878f05f4b31b.jpeg',
            'photo-1497996377197-e4b9024658a4.jpeg',
            'photo-1500993855538-c6a99f437aa7.jpeg',
            'photo-1525466888468-cb6a1b6dc486.jpeg',
            'photo-1526402978125-f1d6df91cbac.jpeg',
            'shitou-he-shan.jpg',
            'stock-photo-173565125.jpg',
            'wdXqHcTwSTmLuKOGz92L_Landscape.jpg'
        ],
        sectionBaseUrl: 'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/',
        section: [
            'photo-1422207258071-70754198c4a2.jpeg',
            'photo-1422207258071-70754198cde3.png',
            'photo-1427384924179-da03b8c3ccf8.jpeg',
            'photo-1453230645768-7ecb0653013d.jpeg',
            'photo-1453805622064-de9796753c22.jpeg',
            'photo-1465101011108-4894b8cf5ec9.jpeg',
            'photo-1467659226669-a1360d97be2d.jpeg',
            'photo-1471644865643-fe726490270a.jpeg',
            'photo-1474511019749-26a5a4b632b2.jpeg',
            'photo-1475724017904-b712052c192a.jpeg',
            'photo-1480506132288-68f7705954bd.jpeg',
            'photo-1481400239811-cd7d97777edc.jpeg',
            'photo-1483030096298-4ca126b58199.jpeg',
            'photo-1483356256511-b48749959172.jpeg',
            'photo-1484950763426-56b5bf172dbb.jpeg',
            'photo-1485291571150-772bcfc10da5.jpeg',
            'photo-1485470733090-0aae1788d5af.jpeg',
            'photo-1486758206125-94d07f414b1c.jpeg',
            'photo-1487695396764-5e73255e78d9.jpeg',
            'photo-1491924759721-64cea51ecd6e.jpeg',
            'photo-1494007485290-ce668e189d92.jpeg',
            'photo-1495512446763-b2bdc445b4db.jpeg',
            'photo-1497616987741-7fba8102046e.jpeg',
            'photo-1501030834146-c0b1914e72be.jpeg',
            'photo-1501973801540-537f08ccae7b.jpeg',
            'photo-1502083728181-687546e77613.jpeg',
            'photo-1503104538136-7491acef4d5d.jpeg',
            'photo-1503248739195-65669aaf5b0f.jpeg',
            'photo-1505753065532-68713e211a3d.jpeg',
            'photo-1505939374277-8d746c530068.jpeg',
            'photo-1506297282690-18c075dcf9a4.jpeg',
            'photo-1516280906200-bf75a67eb01a.jpeg',
            'photo-1517531874685-ae7d6eb69383.jpeg',
            'photo-1519342885256-48793c97ee37.jpeg',
            'photo-1521188453774-625d3fa52b67.jpeg',
            'photo-1523436278115-b135a7a26ad6.jpeg',
            'photo-1525019060245-a02c43a44253.jpeg',
            'photo-1526251641086-8047e534f6bd.jpeg',
            'photo-1526925712774-2833a7ecd0d4.jpeg',
            'photo-1528558430639-e835f5953f3f.jpeg',
            'photo-1529772187639-085af5eb1c40.jpeg',
            'photo-1530861579116-b19f2dbf0ca3.jpeg',
            'photo-1531976283823-ff4d70a477ab.jpeg',
            'photo-1533982497304-dbc0574a309d.jpeg'
        ],
        randCacheArray: [],
        Rand: function (type) {
            var source = this.background;
            if (type === 2) {
                source = this.section;
                return this.sectionBaseUrl + source[Math.floor((Math.random() * source.length))];
            }
            return this.backgroundBaseUrl + source[Math.floor((Math.random() * source.length))];
        }
    };
    var helper = {
        LoadJs: function (d, a) {
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
        },
        GetUrlParam: function (name) {
            var arr = window.location.search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
            return arr != null ? arr[2] : null;
        },
        IsMobile: function () {
            var clientWidth = window.innerWidth || document.documentElement.clientWidth
            return clientWidth < 500;
        },
        Toast: function (ts, msg, timeout) {
            iziToast.error({
                timeout: timeout || 5000,
                icon: 'fa fa-frown-o',
                position: 'topRight',
                title: ts.toUpperCase() + '：',
                message: msg
            });
        }
    };
    var $WIN = $(window),
        ot = 'Z2hwX3huNXRISUVtVjI4c1FaaE1JQ1EzdzJYY1FyU0FxdDFvSkMydg==',
        Cache = new WebStorageCache({storage: 'localStorage'}),
        cfg = {
            defAnimation: "fadeInUp",      // default css animation
            scrollDuration: 800,           // smoothscroll duration
            statsDuration: 4000,           // stats animation duration
            mailChimpURL: 'http://facebook.us8.list-manage.com/subscribe/post?u=cdb7b577e41181934ed6a6a44&amp;id=e65110b38d'
        },
        $sohucs = $("#SOHUCS"),
        SoHuCsIsNeed = false,
        SoHuCsHaveLoaded = false,
        SoHuAppid = 'cyvtmo2ww',
        SoHuConf = 'prod_2245ad762922c6b6c41386af7264cdad';
    var item = {
        Loader: {
            Show: function (fn) {
                $('.preloader').delay(300).fadeIn('slow', function () {
                    $('html,body').stop().animate({scrollTop: $(document).height()}, 'slow', 'swing').promise().done(fn);
                });
            },
            Hide: function (fn, wait) {
                $('.preloader').delay(wait || 600).fadeOut('slow', fn);
            }
        },
        Preloader: function (fn) {
            $WIN.on('load', function () {
                item.Loader.Hide(fn);
            });
        },
        SuperFish: function () {
            $('ul.sf-menu').superfish({
                animation: {height: 'show'},    // slide-down effect without fade-in
                animationOut: {height: 'hide'}, // slide-up effect without fade-in
                cssArrows: false, // disable css arrows
                delay: 600       // 6 second delay on mouseout
            });
        },
        MobileNav: function () {
            var toggleButton = $('.menu-toggle'), nav = $('.main-navigation');
            toggleButton.on('click', function (event) {
                event.preventDefault();
                toggleButton.toggleClass('is-clicked');
                nav.slideToggle();
            });
            if (toggleButton.is(':visible')) {
                nav.addClass('mobile');
            }
            $WIN.resize(function () {
                if (toggleButton.is(':visible')) {
                    nav.addClass('mobile');
                } else {
                    nav.removeClass('mobile');
                }
            });
            $('#main-nav-wrap li a').on('click', function () {
                if (nav.hasClass('mobile')) {
                    toggleButton.toggleClass('is-clicked');
                    nav.fadeOut();
                }
            });
        },
        Search: function () {
            var body = $('body'), searchWrap = $('.search-wrap'), searchField = searchWrap.find('.search-field'),
                closeSearch = $('#close-search'), searchTrigger = $('.search-trigger');
            searchTrigger.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                body.addClass('search-visible');
                setTimeout(function () {
                    searchWrap.find('.search-field').focus();
                }, 100);
            });
            closeSearch.on('click', function () {
                if (body.hasClass('search-visible')) {
                    body.removeClass('search-visible');
                    setTimeout(function () {
                        searchWrap.find('.search-field').blur();
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
            searchField.attr({placeholder: 'Input Your Keywords', autocomplete: 'off'});
        },
        SmoothScroll: function () {
            $('.smoothscroll').on('click', function (e) {
                var target = this.hash, $target = $(target);
                e.preventDefault();
                e.stopPropagation();
                $('html, body').stop().animate({'scrollTop': $target.offset().top}, cfg.scrollDuration, 'swing')
                    .promise().done(function () {
                    // check if menu is open
                    if ($('body').hasClass('menu-is-open')) {
                        $('#header-menu-trigger').trigger('click');
                    }
                    window.location.hash = target;
                });
            });
        },
        Placeholder: function () {
            $('input, textarea, select').placeholder();
        },
        BackToTop: function () {
            var actualScrollHandler = function () {
                var goTopButton = $("#go-top");
                return function () {
                    if (SoHuCsIsNeed && !SoHuCsHaveLoaded) {
                        item.SoHuCsScroll();
                    }
                    if ($WIN.scrollTop() >= 500) {
                        goTopButton.fadeIn(400);
                    } else {
                        goTopButton.fadeOut(400);
                    }
                }
            };
            var throttle = function (fn, wait) {
                var time = Date.now();
                return function () {
                    var n = Date.now()
                    if ((time + wait - n) < 0) {
                        time = n;
                        fn();
                    }
                }
            };
            $WIN.on('scroll', throttle(actualScrollHandler(), 100));
        },
        BodyBgLoader: function () {
            $('body').css({
                'background-image': 'url(' + Photo.Rand(1) + ')',
                'transition': 'transform .3s ease-out',
                'background-color': 'transparent',
                'background-size': 'cover',
                'background-position': 'center center',
                'background-repeat': 'no-repeat',
                'background-attachment': 'fixed',
                '-webkit-animation': 'fadein .5s ease-out 0s forwards'
            });
        },
        ParseContent: function (resp) {
            var size = resp["size"], ch = Base64.decode(resp["content"]), st = ch.split('\n');
            var once = false, date = '', meta = '', image = '', title = '';
            for (var i = 0; i < st.length; i++) {
                var lineValue = st[i].trim();
                if (lineValue === '') continue;
                if (!once && lineValue.match(/^\[\/\/]:(.*)#(.*)[("](.*)?[)"]/g) != null && RegExp.$3 !== '') {
                    once = true;
                    var tmp = RegExp.$3.split('|');
                    if (tmp.length > 0) date = tmp[0].trim();
                    if (tmp.length > 1) meta = tmp[1].trim().toUpperCase();
                    if (tmp.length > 2) image = tmp[2].trim();
                    continue;
                }
                if (lineValue.match(/^# (.*)?/g) != null && RegExp.$1 !== '') {
                    title = RegExp.$1.trim();
                    break;
                }
            }
            $('head').children('title').eq(0).text(title + " - Flow Your Life");
            $("meta[name='description']").attr("content", title + ",Flow Your Life");
            $("#item-title").text(title);
            image = image || Photo.Rand(2);
            $('#item-posters').attr('src', image);
            $("#item-size").text((size / 1024).toFixed(2) + " KB");
            if (date !== '') $("#item-date").removeClass('hide').text(date);
            if (meta !== '') $('#item-meta').attr("href", "/?m=" + meta).text(meta);
            showdown.setFlavor('github');
            var converter = new showdown.Converter(), $itemBody = $('#item-body'), $bodyH1 = $itemBody.find('h1');
            $itemBody.html(converter.makeHtml(ch));
            if ($bodyH1.length > 0) $bodyH1.eq(0).hide();
            if (window.prettyPrint) {
                $('pre').addClass("prettyprint linenums");
                prettyPrint();
            }
        },
        GetContent: function (callback) {
            var sha = helper.GetUrlParam('s');
            if (sha === null || sha === '') {
                helper.Toast('error', '参数错误');
                return;
            }
            if (Cache.isSupported()) {
                var str = Cache.get(sha);
                if (str) {
                    //console.log('read from cache, sha:', sha);
                    this.ParseContent(JSON.parse(str));
                    typeof (callback) == 'function' && callback();
                    return;
                }
            }
            $.ajax({
                url: 'https://api.github.com/repos/ZYallers/ZYaller/git/blobs/' + sha,
                headers: {Authorization: "token " + Base64.decode(ot)},
                async: true,    // 异步方式
                timeout: 10000, // 10秒
                dataType: 'json',
                complete: function (xhr, ts) {
                    //console.log('reload data, sha:', sha);
                    if (ts !== "success") {
                        helper.Toast(ts, '网络异常，请刷新页面重试');
                        return;
                    }
                    if (Cache.isSupported()) {
                        Cache.set(sha, xhr["responseText"], {exp: 3600}); // 缓存1小时
                    }
                    item.ParseContent(xhr["responseJSON"]);
                    typeof (callback) == 'function' && callback();
                }
            });
        },
        SoHuCsScroll: function () {
            var isMobile = helper.IsMobile(), minHeight = isMobile ? 700 : 400;
            if (($(document).height() - $WIN.height() - $WIN.scrollTop()) > minHeight) return;
            SoHuCsHaveLoaded = true;
            $sohucs.parent().slideDown();
            if (isMobile) {
                var head = document.getElementsByTagName('head')[0] || document.head || document.documentElement;
                var script = document.createElement('script');
                script.id = 'changyan_mobile_js';
                script.src = 'https://cy-cdn.kuaizhan.com/upload/mobile/wap-js/changyan_mobile.js?client_id=' + SoHuAppid + '&conf=' + SoHuConf;
                head.appendChild(script);
            } else {
                helper.LoadJs("https://cy-cdn.kuaizhan.com/upload/changyan.js", function () {
                    window.changyan.api.config({appid: SoHuAppid, conf: SoHuConf});
                });
            }
            setTimeout(function () {
                $("div.bricks-loading").slideUp("normal", function () {
                    $sohucs.slideDown("slow", function () {
                        if (helper.IsMobile()) {
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
        SohuChangYan: function () {
            SoHuCsIsNeed = true;
            var sid = helper.GetUrlParam('s');
            if (sid === null || sid === "") {
                return;
            }
            $sohucs.attr("sid", sid);
        }
    };

    item.Preloader(function () {
        item.BodyBgLoader();
        item.GetContent(item.SohuChangYan);
        item.SuperFish();
        item.MobileNav();
        item.Search();
        item.SmoothScroll();
        item.Placeholder();
        item.BackToTop();
    });
})(jQuery);
