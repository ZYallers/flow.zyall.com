(function ($) {
    "use strict";
    var $WIN = $(window),
        footer = $('footer'),
        articleContainer = $('#article-container'),
        listsItemTemplate = $('#lists-item-template').html(),
        Cache = new WebStorageCache({storage: 'localStorage'}),
        perpage = 12,
        ot = 'Z2hwX3huNXRISUVtVjI4c1FaaE1JQ1EzdzJYY1FyU0FxdDFvSkMydg==',
        searchUrl = 'https://api.github.com/search/code?sort=indexed&order=desc',
        repoExtn = 'repo:ZYallers/ZYaller+extension:md',
        cfg = {
            defAnimation: "fadeInUp",      // default css animation
            scrollDuration: 800,           // smoothscroll duration
            statsDuration: 4000            // stats animation duration
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

        var $page = $('nav.pagination'),
            arr = [],
            query = GetUrlParam('q'),
            meta = GetUrlParam('m'),
            page = GetUrlParam('page') || 1,
            totalPage = Math.ceil(total / perpage),
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

    /** 随机获取图片缓存集合 */
    var RandImageCacheSet = [];

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

    /** introFilter */
    var IntroFilter = ['#', '>', '`', '<', '/', '*', '-', '!', '['];

    /** getEntryExcerptText */
    var GetEntryExcerptText = function (content) {
        var arr = content.split('\n'), line = '';
        for (var i = 2; i < arr.length; i++) {
            line = $.trim(arr[i]);
            if (line !== '' && $.inArray(line.slice(0, 1), IntroFilter) === -1) {
                return line.substr(0, 50) + '...';
            }
        }
        return '...';
    }

    /** GetArticleAnnotation */
    var GetArticleAnnotation = function (content) {
        var arr = content.split('\n');
        if (arr[0].match(/^\[\/\/\]:# \((.*)?\)/g) != null && RegExp.$1 !== '') {
            return RegExp.$1.split('|');
        }
        return [];
    };

    /** GetArticleData */
    var GetArticleData = function (item, text) {
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
        var arr = GetArticleAnnotation(content);
        if (arr.length > 0) {
            article.date = arr[0];
            if (arr[2]) {
                article.img = arr[2];
            }
        }
        if (article.img === '') {
            article.img = GetOneRandImage(window.SECTION_IMAGE)
        }
        article.intro = GetEntryExcerptText(content);
        return article;
    };

    /** AppendArticle */
    var AppendArticle = function (item, text) {
        var article = GetArticleData(item, text);
        var html = MicroTemplate(listsItemTemplate, article);
        articleContainer.append(html);
    }

    /** GetArticles */
    var GetArticles = function (lists, callback) {
        var items = lists.items, len = items.length;
        $.itemCount = len;
        $.itemLoadedCount = 0;
        for (var cursor = 0; cursor < len; cursor++) {
            (function (item, cursor) {
                var isNeedReload = true;
                if (Cache.isSupported()) {
                    var text = Cache.get(item['sha']);
                    if (text) {
                        isNeedReload = false;
                        AppendArticle(item, text);
                        $.itemLoadedCount++;
                        console.log('read from cache, sha:', item['sha'], 'loaded:', $.itemLoadedCount);
                    }
                }
                if (isNeedReload) {
                    $.ajax({
                        url: 'https://api.github.com/repos/ZYallers/ZYaller/git/blobs/' + item['sha'],
                        headers: {Authorization: "token " + Base64.decode(ot)},
                        async: true, // 异步方式
                        timeout: 5000, // 5秒
                        dataType: 'json',
                        complete: function (xhr, ts) {
                            if (ts === 'success') {
                                AppendArticle(item, xhr['responseText']);
                                $.itemLoadedCount++;
                                console.log('reload data, sha:', item['sha'], 'loaded:', $.itemLoadedCount);
                                if (Cache.isSupported()) {
                                    Cache.set(item['sha'], xhr['responseText'], {exp: 3600});
                                }
                            }
                        }
                    });
                }
            })(items[cursor], cursor);
        }
        callback(lists);
    };

    /** get list data */
    var GetLists = function (success, error) {
        var keyword = GetUrlParam('q'),
            meta = GetUrlParam('m'),
            page = GetUrlParam('page') || 1,
            query = (keyword ? keyword + '+' : '') + 'path:/tag' + (meta ? '/' + meta : ''),
            api = searchUrl + '&q=' + query + '+' + repoExtn + '&page=' + page + '&per_page=' + perpage;

        var isNeedReload = true;
        if (Cache.isSupported()) {
            var lists = Cache.get(encodeURI(api));
            if (lists) {
                isNeedReload = false;
                console.log('read from cache, meta:', meta, ',page:', page, ',query', keyword);
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
                    console.log('reload data, meta:', meta, ',page:', page, ',query', keyword);
                    success(lists);
                },
                error: function (xhr, ts, er) {
                    error(ts);
                }
            });
        }
    };

    /** SetBodyBackgroundImage */
    var SetBodyBackgroundImage = function () {
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
    };

    /** search */
    var MenuSearch = function () {
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

        searchField.attr({placeholder: 'Type Your Keywords', autocomplete: 'off'});
    };

    /** animate bricks */
    var BricksAnimate = function () {
        $('article.animate-this').each(function (ctr) {
            var el = $(this);
            setTimeout(function () {
                el.addClass('animated fadeInUp');
            }, ctr * 300);
        });
        $WIN.on('resize', function () {
            $('article.animate-this').removeClass('animate-this animated fadeInUp');
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

    /** Masonry resize cron task */
    var MasonryResize = function (callback) {
        $.masonryResizeTimes = 0;
        $.masonryResizeTask = setInterval(function () {
            $.masonryResizeTimes++;
            console.log('try masonry resize...', $.masonryResizeTimes);
            if ($.masonryResizeTimes > 10) {
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
                if ($.itemCount > 0 && $.itemCount === $.itemLoadedCount) {
                    console.log('masonry resized');
                    clearInterval($.masonryResizeTask);
                    articleContainer.fadeIn("normal", function () {
                        articleContainer.masonry({
                            itemSelector: 'article.entry',
                            columnWidth: 'div.grid-sizer',
                            percentPosition: true,
                            resize: true
                        });
                        callback();
                    });
                }
            }
        }, 1000);
    };

    /** Initialize */
    (function Init() {
        SetBodyBackgroundImage();
        Preloader(function () {
            GetLists(function (lists) {
                if (lists || lists['incomplete_results'] === false) {
                    if (lists.items.length > 0) {
                        GetArticles(lists, function (lists) {
                            articleContainer.imagesLoaded(function () {
                                console.log('images loaded');
                                BricksAnimate();
                                MasonryResize(function () {
                                    GetPagination(lists['total_count']);
                                    footer.fadeIn("slow");
                                });
                            });
                        });
                    } else {
                        articleContainer.html(
                            '<div style="text-align: center;margin: 10rem 0">' +
                            '   <div class="fa fa-frown-o" style="font-size: -webkit-xxx-large;"></div>' +
                            '   <div style="font-size: larger;">No matching files found.</div>' +
                            '</div>');
                    }
                }
            }, function (ts) {
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
