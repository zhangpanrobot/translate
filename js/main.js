(function() {
    //阻止"搜索菜单"的弹出菜单

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(searchElement, fromIndex) {
            var k;
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var O = Object(this);
            var len = O.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = +fromIndex || 0;

            if (Math.abs(n) === Infinity) {
                n = 0;
            }
            if (n >= len) {
                return -1;
            }
            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            while (k < len) {
                var kValue;
                if (k in O && O[k] === searchElement) {
                    return k;
                }
                k++;
            }
            return -1;
        };
    }



    var obj = {}; //总配置
    var shield = false; //总开关
    function $(id) {
        return document.getElementById(id);
    }

    function stopDefAction(evt) {
        evt.preventDefault();
    }
    var engine = ["sogou", "baidu", "google"];
    var defaultObj = {
        "copy": true,
        "search": true,
        "engine": engine[0],
        "translate": true,
        "disableAll": false
    };
    var obj; //当前options
    var engine = ["sogou", "baidu", "google"];
    var searchLinkPre = ['http://www.sogou.com/web?query=', 'http://www.baidu.com/s?wd=', 'https://www.google.com.hk/?#newwindow=1&q='];
    //插入文档
    var isLink = false,
        ta, copy, search, open, translate;

    chrome.extension.onRequest.addListener(function(msg) {
        switch (msg.cmd) {
            case 'options-back':
                obj = msg.data;
                if (obj.disableAll) {
                    shield = true;
                    removeHandler(document.body, 'mouseup', translateHandler);
                }
                break;
            case 'translate-back':
                dataResponse(JSON.parse(msg.data));
            default:
                return;
        }
    });
    chrome.extension.sendRequest({
        cmd: 'getOptions'
    });

    var board;

    function sendBack(cmd, board) {
        chrome.extension.sendRequest({
            'cmd': cmd,
            'text': board
        });
    }
    var translateWrapper = document.createElement("div");
    var docfrag = document.createDocumentFragment();
    var itemList = "<ul><li id='sg-copy'>复制</li><li id='sg-search'><a target='_blank' href=''>搜索</a></li><li id='sg-open'><a target='_blank' href=''>打开</a></li></ul>";
    var divWrapper = document.createElement("div");
    divWrapper.id = "sg-muti-translate";
    divWrapper.className = "sg-muti-hide";
    divWrapper.innerHTML = itemList;
    docfrag.appendChild(divWrapper);
    document.body.appendChild(docfrag);
    ta = $("sg-muti-translate");
    open = $("sg-open");
    search = $("sg-search");
    ta.oncontextmenu = function() {
        return false;
    }
    //get selection(ie and chrome)
    function dataResponse(data) {
        translateWrapper.innerHTML = JSON.stringify(data);
        ta.appendChild(translateWrapper);
    }
    var addHandler = function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    };

    var removeHandler = function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    };

    addHandler(document.body, 'mouseup', translateHandler);

    function translateHandler(evt) {
        e = evt || window.event;
        targetElement = e.target || e.srcElement;
        if (targetElement.id !== "sg-copy") {
            board = document.getSelection ? document.getSelection().toString() : document.selection.createRange().text;
            if (board && board.replace(/\s/g, '').length) {
                ta.className = "";
                if (document.body.clientWidth <= e.clientX + ta.offsetWidth) {
                    ta.style.right = 0;
                } else {
                    ta.style.left = e.clientX + "px";
                }
                ta.style.top = e.clientY - "50" + "px";
                isLink = (targetElement.nodeName === "A");
                if (isLink) {
                    open.className = "";
                    open.children[0].href = e.target.href;
                }
                if (obj.search) {
                    search.children[0].href = searchLinkPre[engine.indexOf(obj.engine)] + board;
                }
                var valilableWord = board.match(/[a-zA-Z]{2,}/g) && board.match(/[a-zA-Z]{2,}/g)[0]; //英文
                if (valilableWord && obj.translate) {
                    sendBack('translate', valilableWord);
                }
            } else {
                ta.className = "sg-muti-hide";
            }
        }
    }

    addHandler(ta, 'mousedown', exeTranslate);

    function exeTranslate(evt) {
        e = evt || window.event;
        targetElement = e.target || e.srcElement;
        e.srcElement ? (e.cancelBubble = true) : e.stopPropagation();
        switch (targetElement.id) {
            case "sg-copy":
                if (window.clipboardData) {
                    window.clipboardData.setData('Text', board);
                } else {
                    sendBack('copy', board);
                }
                break;
            default:
                return;
        }
        ta.className = 'sg-muti-hide';
    }

    addHandler(document.body, 'mousewheel', function() {
        ta.className = 'sg-muti-hide';
    });
})();