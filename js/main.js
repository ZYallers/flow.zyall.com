(function ($) {
    "use strict";
    var $WIN = $(window),
        Cache = new WebStorageCache({storage: 'localStorage'}),
        perpage = 13,
        searchUrl = 'https://api.github.com/search/code?sort=indexed&order=desc',
        repoExtn = 'repo:ZYallers/ZYaller+extension:md',
        cfg = {
            defAnimation: "fadeInUp",    // default css animation
            scrollDuration: 800,           // smoothscroll duration
            statsDuration: 4000          // stats animation duration
        },
        RandImages = [
            '/images/random/work1.jpg',
            '/images/random/work2.jpg',
            '/images/random/work3.jpg',
            '/images/random/liberty.jpg',
            '/images/random/concert.jpg',
            '/images/random/shutterbug.jpg',
            '/images/random/usaf-rocket.jpg',
            'http://uploadbeta.com/api/pictures/random?key=推女郎',
            'http://uploadbeta.com/api/pictures/random?key=性感',
            'http://uploadbeta.com/api/pictures/random?key=美腿'
        ],
        introFilter = ['#', '>', '`', '<', '/', '*', '-', '!'];

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
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
    };

    /** get url params */
    var GetUrlParam = function (name) {
        var arr = window.location.search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
        return arr != null ? arr[2] : null;
    };

    /** set pagination */
    var GetPagination = function (total) {
        if (!(total > 0) || total <= perpage) {
            return;
        }

        var $page = $('.pagination'), arr = [], query = GetUrlParam('q'), meta = GetUrlParam('m'), page = GetUrlParam('page') || 1,
            totalPage = Math.ceil(total / perpage), href = (query ? 'q=' + query : '') + (meta ? '&m=' + meta : '');
        href = href ? '?' + href + '&page=' : '?page=';

        if (page == 1) {
            arr.push('<span class="page-numbers inactive">Prev</span>');
        } else if (page > 1) {
            arr.push('<a href="' + href + (parseInt(page) - 1) + '" class="page-numbers">Prev</a>');
        }

        arr.push('<span class="page-numbers inactive">' + page + '</span>');

        if (page == totalPage) {
            arr.push('<span class="page-numbers inactive">Next</span>');
        } else if (page < totalPage) {
            arr.push('<a href="' + href + (parseInt(page) + 1) + '" class="page-numbers">Next</a>');
        }

        $page.html(arr.join('\n'));
        $page.parent().fadeIn();
    };

    /** template html */
    var MicroTemplate = function (src, data) {
        // replace {{tags}} in source
        return src.replace(/\{\{([\w\-_\.]+)\}\}/gi, function (match, key) {
            // walk through objects to get value
            var value = data;
            key.split('.').forEach(function (part) {
                value = value[part];
            });
            return value;
        });
    };

    /** get articles */
    var GetArticles = function (lists, callback) {
        var items = lists.items, len = items.length;
        $.itemCount = len;
        $.reoadedItemCount = 0;
        for (var cursor = 0; cursor < len; cursor++) {
            (function (item, cursor) {
                var container = $('div.bricks-wrapper'), grid = $('div.featured-grid'), slides = $('ul.slides'),
                    artTemp = $('#lists-item-template').html(), sliderTemp = $('#flexslider-template').html();

                // filter the static local images
                var img = RandImages[Math.floor((Math.random() * RandImages.length))];
                if (img.substring(0, 4) != 'http') {
                    RandImages = $.grep(RandImages, function (value) {
                        return value != img;
                    });
                }

                var article = {sha: item['sha'], intro: '', link: item['html_url'], title: item['name'].slice(0, -3),
                    meta: item['path'].split('/')[1], img: img};
                article.img += (img.substring(0, 4) == 'http') ? '&rd=' + Math.floor(Math.random() * 1000000) : '';
                article.metalink = '/?m=' + article.meta;
                article.meta = article.meta.toUpperCase();

                // append to contain.
                $.itemCount > 3 && grid.removeClass('hide');
                if ($.itemCount > 3 && cursor < 3) {
                    slides.append(MicroTemplate(sliderTemp, article));
                } else {
                    container.append(MicroTemplate(artTemp, article));
                }

                // update item image and intro.
                var isReload = true;
                if (Cache.isSupported()) {
                    var content = Cache.get(item['sha']);
                    if (content) {
                        isReload = false;
                        $.reoadedItemCount++;
                        var tmp = content.split('\n'), len = tmp.length;
                        for (var i = 2; i < len; i++) {
                            var line = $.trim(tmp[i]);
                            if (line != '' && $.inArray(line.slice(0, 1), introFilter) == -1) {
                                setTimeout(function () {
                                    var $sha = $('[sha=' + item['sha'] + ']');
                                    if ($sha.attr('art') == '1') {
                                        $sha.find('div.entry-excerpt').html(line);
                                    } else {
                                        $sha.find('ul.entry-meta').children('li').eq(1).html(line);
                                    }
                                }, (cursor + 1) * 100);
                                break;
                            }
                        }
                    }
                }
                if (isReload) {
                    $.ajax({url: item['git_url'], async: true, timeout: 10000, dataType: 'json', complete: function (xhr, ts) {
                        $.reoadedItemCount++;
                        console.log('reloaded item: ' ,item['sha'], 'length: ', $.reoadedItemCount);
                        if (ts == 'success') {
                            var content = Base64.decode(xhr['responseJSON']['content']), tmp = content.split('\n'), len = tmp.length;
                            for (var i = 2; i < len; i++) {
                                var line = $.trim(tmp[i]);
                                if (line != '' && $.inArray(line.slice(0, 1), introFilter) == -1) {
                                    setTimeout(function () {
                                        var $sha = $('[sha=' + item['sha'] + ']');
                                        if ($sha.attr('art') == '1') {
                                            $sha.find('div.entry-excerpt').html(line);
                                        } else {
                                            $sha.find('ul.entry-meta').children('li').eq(1).html(line);
                                        }
                                        // set cache, cache 3600 seconds.
                                        Cache.isSupported() && Cache.set(item['sha'], content, {exp: 3600});
                                    }, (cursor + 1) * 100);
                                    break;
                                }
                            }
                        }
                    }});
                }
            })(items[cursor], cursor);
        }
        typeof(callback) == 'function' && callback(lists);
    };

    /** get list data */
    var GetLists = function (success, error) {
        var keyword = GetUrlParam('q'), meta = GetUrlParam('m'), page = GetUrlParam('page') || 1,
            query = (keyword || '') + '+path:tag' + (meta ? '/' + meta : ''),
            api = searchUrl + '&q=' + query + '+' + repoExtn + '&page=' + page + '&per_page=' + perpage;
        // try to get lists from cache.
        var isReload = true;
        if (Cache.isSupported()) {
            var lists = Cache.get(encodeURI(api));
            if (lists) {
                isReload = false;
                typeof(success) == 'function' && success(lists);
            }
        }
        if (isReload) {
            $.ajax({url: api, async: true, timeout: 10000, dataType: 'json', success: function (lists) {
                    // set cache, cache 600 seconds.
                    Cache.isSupported() && Cache.set(encodeURI(api), lists, {exp: 600});
                    typeof(success) == 'function' && success(lists);
                }, error: function (xhr, ts, er) {
                    typeof(error) == 'function' && error(ts);
                }
            });
        }
    };

    /** Preloader  */
    var Preloader = function (callback) {
        $WIN.on('load', function () {
            $("#loader").fadeOut('slow', function () {
                // will fade out the whole DIV that covers the website.
                $("#preloader").delay(300).fadeOut('slow', callback);
            });
        });
    };

    /** superfish */
    var SuperFish = function () {
        $('ul.sf-menu').superfish({
            animation: {height: 'show'}, // slide-down effect without fade-in
            animationOut: {height: 'hide'}, // slide-up effect without fade-in
            cssArrows: false, // disable css arrows
            delay: 600 // .6 second delay on mouseout
        });
    };

    /** Mobile Menu */
    var MobileNav = function () {
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
        $('#main-nav-wrap li a').on("click", function () {
            if (nav.hasClass('mobile')) {
                toggleButton.toggleClass('is-clicked');
                nav.fadeOut();
            }
        });
    };


    /** search */
    var MenuSearch = function () {
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

        searchField.attr({placeholder: 'Type Your Keywords', autocomplete: 'off'});
    };

    /** imagesLoaded */
    var ImagesLoaded = function () {
        $('.bricks-wrapper').imagesLoaded(function () {
            console.log('images loaded');
            $.isLoadedImage = true;
        });
    };

    /** animate bricks */
    var BricksAnimate = function () {
        $('.animate-this').each(function(ctr) {
            var el = $(this);
            setTimeout(function() {
                el.addClass('animated fadeInUp');
            }, ctr * 200);
        });
        $WIN.on('resize', function () {
            $('.animate-this').removeClass('animate-this animated fadeInUp');
        });
    };

    /** Masonry resize cronb task */
    var MasonryResize = function () {
        $.masonryResizeTimes = 0;
        $.masonryResizeTask = setInterval(function () {
            console.log('try masonry resize...', $.masonryResizeTimes);
            $.masonryResizeTimes++;
            if ($.masonryResizeTimes > 60) {
                console.log('try masonry resize more than maximum');
                clearInterval($.masonryResizeTask);
                iziToast.error({
                    timeout: 5000,
                    icon: 'fa fa-frown-o',
                    position: 'topRight',
                    title: 'TIMEOUT',
                    message: 'Try masonry resize more than maximum!'
                });
            } else {
                if ($.itemCount && $.isLoadedImage && $.reoadedItemCount == $.itemCount) {
                    console.log('masonry resized');
                    clearInterval($.masonryResizeTask);
                    $('.bricks-wrapper').masonry({
                        itemSelector: '.entry',
                        columnWidth: '.grid-sizer',
                        percentPosition: true,
                        resize: true
                    });
                    iziToast.show({
                        theme: 'dark',
                        timeout: 1500,
                        icon: 'fa fa-smile-o',
                        position: 'topCenter',
                        title: 'OK',
                        progressBarColor: 'rgb(0, 255, 184)',
                        message: 'Masonry resized ' + ($.masonryResizeTimes) + ' successfully.'
                    });
                }
            }
        }, 500);
    };

    /** Flex Slider */
    var FlexSlider = function () {
        $('#featured-post-slider').flexslider({
            namespace: "flex-",
            controlsContainer: '',
            animation: 'fade',
            controlNav: false,
            directionNav: true,
            smoothHeight: false,
            slideshowSpeed: 7000,
            animationSpeed: 600,
            randomize: false,
            touch: true,
        });
    };

    /** Smooth Scrolling */
    var SmoothScroll = function () {
        $('.smoothscroll').on('click', function (e) {
            var target = this.hash, $target = $(target);
            e.preventDefault();
            e.stopPropagation();
            $('html, body').stop().animate({'scrollTop': $target.offset().top}, cfg.scrollDuration, 'swing').promise().done(function () {
                // check if menu is open
                if ($('body').hasClass('menu-is-open')) {
                    $('#header-menu-trigger').trigger('click');
                }
                window.location.hash = target;
            });
        });

    };


    /** Placeholder Plugin Settings */
    var Placeholder = function () {
        $('input, textarea, select').placeholder();
    };

    /** Back to Top */
    var BackToTop = function () {
        var pxShow = 500,         // height on which the button will show
            fadeInTime = 400,     // how slow/fast you want the button to show
            fadeOutTime = 400,    // how slow/fast you want the button to hide
            scrollSpeed = 300,    // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'
            goTopButton = $("#go-top");
        // Show or hide the sticky footer button
        $WIN.on('scroll', function () {
            if ($WIN.scrollTop() >= pxShow) {
                goTopButton.fadeIn(fadeInTime);
            } else {
                goTopButton.fadeOut(fadeOutTime);
            }
        });
    };

    /** Initialize */
    (function Init() {
        Preloader(function () {
            GetLists(function (lists) {
                $('div.bricks-loading').hide();
                iziToast.show({theme: 'dark', timeout: 1500, icon: 'fa fa-smile-o', position: 'topCenter',
                    title: 'OK', progressBarColor: 'rgb(0, 255, 184)', message: 'Data loaded successfully.'});
                if (lists || lists['incomplete_results'] === false) {
                    GetArticles(lists, function (lists) {
                        GetPagination(lists['total_count']);
                        FlexSlider();
                        BricksAnimate();
                        ImagesLoaded();
                        MasonryResize();
                    });
                }
            }, function (ts) {
                var msg = 'Error occurred, try reload it!';
                if (ts == 'timeout') {
                    msg = 'Network slow, try reload it!';
                }
                iziToast.error({timeout: 5000, icon: 'fa fa-frown-o', position: 'topRight', title: ts.toUpperCase(), message: msg});
            });
        });
        SuperFish();
        MobileNav();
        MenuSearch();
        SmoothScroll();
        Placeholder();
        BackToTop();
    })();
})(jQuery);