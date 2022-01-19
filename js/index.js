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
    var helper = {
        GetUrlParam: function (name) {
            var arr = window.location.search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
            return arr != null ? arr[2] : null;
        },
    };
    var $WIN = $(window),
        articleContainer = $('#article-container'),
        listsItemTemplate = $('#lists-item-template').html(),
        Cache = new WebStorageCache({storage: 'localStorage'}),
        ot = 'Z2hwX3huNXRISUVtVjI4c1FaaE1JQ1EzdzJYY1FyU0FxdDFvSkMydg==',
        searchUrl = 'https://api.github.com/search/code?sort=indexed&order=desc',
        repoExtn = 'repo:ZYallers/ZYaller+extension:md',
        cfg = {
            defAnimation: 'fadeInUp',      // default css animation
            scrollDuration: 800,           // smoothscroll duration
            statsDuration: 4000            // stats animation duration
        },
        $grid = articleContainer.masonry({
            //initLayout: false,
            itemSelector: 'article.entry',
            columnWidth: 'div.grid-sizer',
            horizontalOrder: true,
            percentPosition: true,
            resize: true
        });
    var index = {
        BodyBgImage: [
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/background/IKMsqwyaR6qN0kq48STw_annapurna.jpg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/background/photo-1432256851563-20155d0b7a39.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/background/photo-1444041401850-6d9f537550c4.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/background/photo-1482192505345-5655af888cc4.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/background/photo-1488503674815-d6c13687ff65.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/background/photo-1489703197108-878f05f4b31b.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/background/photo-1497996377197-e4b9024658a4.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/background/photo-1500993855538-c6a99f437aa7.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/background/photo-1525466888468-cb6a1b6dc486.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/background/photo-1526402978125-f1d6df91cbac.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/background/shitou-he-shan.jpg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/background/stock-photo-173565125.jpg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/background/wdXqHcTwSTmLuKOGz92L_Landscape.jpg'
        ],
        SectionImage: [
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1422207258071-70754198c4a2.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1422207258071-70754198cde3.png',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1427384924179-da03b8c3ccf8.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1453230645768-7ecb0653013d.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1453805622064-de9796753c22.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1465101011108-4894b8cf5ec9.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1467659226669-a1360d97be2d.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1471644865643-fe726490270a.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1474511019749-26a5a4b632b2.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1475724017904-b712052c192a.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1480506132288-68f7705954bd.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1481400239811-cd7d97777edc.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1483030096298-4ca126b58199.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1483356256511-b48749959172.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1484950763426-56b5bf172dbb.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1485291571150-772bcfc10da5.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1485470733090-0aae1788d5af.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1486758206125-94d07f414b1c.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1487695396764-5e73255e78d9.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1491924759721-64cea51ecd6e.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1494007485290-ce668e189d92.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1495512446763-b2bdc445b4db.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1497616987741-7fba8102046e.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1501030834146-c0b1914e72be.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1501973801540-537f08ccae7b.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1502083728181-687546e77613.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1503104538136-7491acef4d5d.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1503248739195-65669aaf5b0f.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1505753065532-68713e211a3d.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1505939374277-8d746c530068.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1506297282690-18c075dcf9a4.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1516280906200-bf75a67eb01a.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1517531874685-ae7d6eb69383.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1519342885256-48793c97ee37.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1521188453774-625d3fa52b67.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1523436278115-b135a7a26ad6.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1525019060245-a02c43a44253.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1526251641086-8047e534f6bd.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1526925712774-2833a7ecd0d4.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1528558430639-e835f5953f3f.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1529772187639-085af5eb1c40.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1530861579116-b19f2dbf0ca3.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1531976283823-ff4d70a477ab.jpeg',
            'https://hxsupload-oss.hxsapp.com/lib/flow/image/section/photo-1533982497304-dbc0574a309d.jpeg'
        ],
        RandImageCacheSet: [],
        IntroFilter: ['#', '>', '`', '<', '/', '*', '-', '!', '['],
        GetOneRandImage: function (source) {
            var getFunc = function () {
                return source[Math.floor((Math.random() * source.length))];
            };
            var res = getFunc();
            while (this.RandImageCacheSet.indexOf(res) !== -1) {
                res = getFunc();
            }
            this.RandImageCacheSet.push(res);
            return res;
        },
        Preloader: function (fn) {
            $WIN.on('load', fn).on('resize', function () {
                $('article.animate-this').removeClass('animate-this animated fadeInUp');
            });
        },
        BodyBgLoader: function () {
            $('body').css({
                'background-image': 'url(' + this.GetOneRandImage(this.BodyBgImage) + ')',
                'transition': 'transform .3s ease-out',
                'background-color': 'transparent',
                'background-size': 'cover',
                'background-position': 'center center',
                'background-repeat': 'no-repeat',
                'background-attachment': 'fixed',
                '-webkit-animation': 'fadein .5s ease-out 0s forwards'
            });
        },
        MicroTemplate: function (src, data) {
            // replace {{tags}} in source
            return src.replace(/{{([\w\-_.]+)}}/gi, function (match, key) {
                // walk through objects to get value
                var value = data;
                key.split('.').forEach(function (part) {
                    value = value[part];
                });
                return value;
            });
        },
        GetPagination: function (total, page, size) {
            if (!(total > 0) || total <= size) {
                return;
            }

            var $page = $('nav.pagination'),
                arr = [],
                query = helper.GetUrlParam('q'),
                meta = helper.GetUrlParam('m'),
                page = page > 0 ? page : (helper.GetUrlParam('page') || 1),
                totalPage = Math.ceil(total / size),
                href = (query ? 'q=' + query : '') + (meta ? '&m=' + meta : '');

            href = href ? '?' + href + '&page=' : '?page=';

            if (page === 1) {
                arr.push('<span class="page-numbers inactive">Prev</span>');
            } else if (page > 1) {
                arr.push('<a href="' + href + (parseInt(page) - 1) + '" class="page-numbers">Prev</a>');
            }

            arr.push('<span class="page-numbers inactive">' + page + '</span>');

            if (page === totalPage) {
                arr.push('<span class="page-numbers inactive">Next</span>');
            } else if (page < totalPage) {
                arr.push('<a href="' + href + (parseInt(page) + 1) + '" class="page-numbers">Next</a>');
            }

            $page.html(arr.join('\n'));
            $page.parent().fadeIn('slow');
        },
        GetEntryExcerptText: function (content) {
            var arr = content.split('\n'), line = '';
            for (var i = 2; i < arr.length; i++) {
                line = $.trim(arr[i]);
                if (line !== '' && $.inArray(line.slice(0, 1), this.IntroFilter) === -1) {
                    return line.substr(0, 50) + '...';
                }
            }
            return '...';
        },
        GetArticleAnnotation: function (content) {
            var arr = content.split('\n');
            if (arr[0].match(/^\[\/\/\]:# \((.*)?\)/g) != null && RegExp.$1 !== '') {
                return RegExp.$1.split('|');
            }
            return [];
        },
        GetArticleData: function (item, text) {
            var meta = item['path'].split('/')[1] || 'php';
            var article = {
                sha: item['sha'],
                size: '0.00KB',
                date: '',
                link: '/item.html?s=' + item['sha'],
                title: item['name'].slice(0, -3),
                meta: meta.toUpperCase(),
                metalink: '/?m=' + meta,
                img: ''
            };
            var textJson = JSON.parse(text), content = Base64.decode(textJson['content']);
            article.size = (textJson['size'] / 1024).toFixed(2) + 'KB';
            var arr = this.GetArticleAnnotation(content);
            if (arr.length > 0) {
                article.date = arr[0];
                if (arr[2]) {
                    article.img = arr[2];
                }
            }
            if (article.img === '') {
                article.img = this.GetOneRandImage(this.SectionImage)
            }
            article.intro = this.GetEntryExcerptText(content);
            return article;
        },
        AppendArticle: function (item, text) {
            var article = this.GetArticleData(item, text),
                content = this.MicroTemplate(listsItemTemplate, article),
                $item = $(content);
            $item.imagesLoaded().done(function (instance) {
                $grid.append($item).masonry('appended', $item);
            });
        },
        GetArticles: function (lists) {
            for (var cursor = 0; cursor < lists.items.length; cursor++) {
                (function (item, cursor) {
                    setTimeout(function () {
                        var isNeedReload = true;
                        if (Cache.isSupported()) {
                            var text = Cache.get(item['sha']);
                            if (text) {
                                isNeedReload = false;
                                index.AppendArticle(item, text);
                                //console.log('read from cache, sha:', item['sha'], 'loaded, cursor:', cursor);
                            }
                        }
                        if (isNeedReload) {
                            $.ajax({
                                url: 'https://api.github.com/repos/ZYallers/ZYaller/git/blobs/' + item['sha'],
                                headers: {Authorization: "token " + Base64.decode(ot)},
                                async: true, // 异步方式
                                timeout: 10000, // 10秒
                                dataType: 'json',
                                complete: function (xhr, ts) {
                                    if (ts === 'success') {
                                        index.AppendArticle(item, xhr['responseText']);
                                        if (Cache.isSupported()) {
                                            Cache.set(item['sha'], xhr['responseText'], {exp: 3600});
                                        }
                                        //console.log('reload data, sha:', item['sha'], 'loaded, cursor:', cursor);
                                    }
                                }
                            });
                        }
                    }, cursor * 150);
                })(lists.items[cursor], cursor);
            }
        },
        GetLists: function (page, size, success) {
            var keyword = helper.GetUrlParam('q'),
                meta = helper.GetUrlParam('m'),
                page = page || 1,
                query = (keyword ? keyword + '+' : '') + 'path:/tag' + (meta ? '/' + meta : ''),
                api = searchUrl + '&q=' + query + '+' + repoExtn + '&page=' + page + '&per_page=' + size,
                isNeedReload = true;
            if (Cache.isSupported()) {
                var lists = Cache.get(encodeURI(api));
                if (lists) {
                    isNeedReload = false;
                    //console.log('read from cache, meta:', meta, ',page:', page, ',query', keyword);
                    success(lists);
                }
            }
            if (isNeedReload) {
                $.ajax({
                    url: api,
                    headers: {Authorization: "token " + Base64.decode(ot)},
                    async: true,  // 异步方式
                    timeout: 10000,  // 10秒
                    dataType: 'json',
                    success: function (lists) {
                        if (Cache.isSupported()) {
                            Cache.set(encodeURI(api), lists, {exp: 600}); // cache 10min
                        }
                        //console.log('reload data, meta:', meta, ',page:', page, ',query', keyword);
                        success(lists);
                    },
                    error: function (xhr, ts, er) {
                        var msg = 'Error occurred, try reload it!';
                        if (ts === 'timeout') {
                            msg = 'Network slow, try reload it!';
                        }
                        iziToast.error({
                            timeout: 5000,
                            icon: 'fa fa-frown-o',
                            position: 'topRight',
                            title: ts.toUpperCase(),
                            message: msg
                        });
                    }
                });
            }
        },
        SuperFish: function () {
            $('ul.sf-menu').superfish({
                animation: {height: 'show'}, // slide-down effect without fade-in
                animationOut: {height: 'hide'}, // slide-up effect without fade-in
                cssArrows: false, // disable css arrows
                delay: 600 // .6 second delay on mouseout
            });
        },
        MobileNav: function () {
            var toggleButton = $('.menu-toggle'), nav = $('.main-navigation');
            toggleButton.on('click', function (e) {
                e.preventDefault();
                toggleButton.toggleClass('is-clicked');
                nav.slideToggle();
                e.stopPropagation();
            });
            nav.on('click', function (e) {
                e.stopPropagation();
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
            $('#main-nav-wrap li a').on("click", function () {
                if (nav.hasClass('mobile')) {
                    toggleButton.toggleClass('is-clicked');
                    nav.fadeOut();
                }
            });
            $(document).on("click", function () {
                if (nav.is(':visible')) {
                    toggleButton.toggleClass('is-clicked');
                    nav.slideToggle();
                }
            });
        },
        MenuSearch: function () {
            var body = $('body'),
                searchWrap = $('.search-wrap'),
                searchField = searchWrap.find('.search-field'),
                closeSearch = $('#close-search'),
                searchTrigger = $('.search-trigger');

            searchTrigger.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $this = $(this);
                body.addClass('search-visible');
                setTimeout(function () {
                    $('.search-wrap').find('.search-field').focus();
                }, 100);
            });

            closeSearch.on('click', function (e) {
                if (body.hasClass('search-visible')) {
                    body.removeClass('search-visible');
                    setTimeout(function () {
                        $('.search-wrap').find('.search-field').blur();
                    }, 100);
                }
                e.stopPropagation();
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
                $('html,body').stop().animate({scrollTop: $target.offset().top}, cfg.scrollDuration, 'swing').promise().done(function () {
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
                var goTopButton = $("#go-top"),
                    maxTime = 4,
                    counter = 0,
                    lock = false,
                    page = (parseInt(helper.GetUrlParam('page')) || 1) + 1;
                var autoScroll = function (fn) {
                    $('html,body').animate({scrollTop: $WIN.scrollTop() + 500}, 'slow', 'swing').promise().done(fn);
                };
                return function () {
                    var scrollTop = $WIN.scrollTop();
                    if (!lock) {
                        var minHeight = 10, gapBottom = $(document).height() - $WIN.height() - scrollTop;
                        //console.log(gapBottom);
                        if (gapBottom <= minHeight) {
                            lock = true;
                            $('.preloader').delay(300).fadeIn('slow', function () {
                                index.GetLists(page, 8, function (lists) {
                                    $('.preloader').delay(600).fadeOut('slow', function () {
                                        index.GetArticles(lists);
                                        counter++;
                                        if (counter >= maxTime) {
                                            autoScroll(function () {
                                                index.GetPagination(lists['total_count'], page + 1, 8);
                                            });
                                        } else {
                                            autoScroll(function () {
                                                page++;
                                                lock = false;
                                            });
                                        }
                                    });
                                });
                            });
                        }
                    }

                    if (scrollTop >= 500) {
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
            $WIN.on('scroll', throttle(actualScrollHandler(), 60));
        }
    };

    index.Preloader(function () {
        index.BodyBgLoader();
        index.GetLists(helper.GetUrlParam('page'), 8, function (lists) {
            $('.preloader').delay(600).fadeOut('slow', function () {
                if (!lists || lists['incomplete_results'] === true || lists.items.length === 0) {
                    articleContainer.html(
                        '<div style="text-align:center;margin:10rem 0">' +
                        '   <div class="fa fa-frown-o" style="font-size:-webkit-xxx-large;"></div>' +
                        '   <div style="font-size:larger;color:#837f7f">No Matching Files Found</div>' +
                        '</div>'
                    );
                    return;
                }
                index.GetArticles(lists);
            });
        });
        index.SuperFish();
        index.MobileNav();
        index.MenuSearch();
        index.SmoothScroll();
        index.Placeholder();
        index.BackToTop();
    });
})(jQuery);