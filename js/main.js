//阻止"搜索菜单"的弹出菜单
function $(id) {
    return document.getElementById(id);
};

function stopDefAction(evt) {
    evt.preventDefault();
}
var engine = ["sogou", "baidu", "google"];
var searchLinkPre = ['http://www.sogou.com/web?query=', 'http://www.baidu.com/s?wd=', 'https://www.google.com.hk/?#newwindow=1&q='];
//插入文档
var isLink = false,
    ta, copy, search, open, translate;
chrome.storage.local.get(null, function(obj) {
    if (obj.disableAll) {
        return;
    }
    var board;

    function sendBack(cmd, board) {
        chrome.runtime.sendMessage({
            cmd: cmd,
            text: board
        });
    }
    var translateWrapper = document.createElement("div");
    var docfrag = document.createDocumentFragment();
    var itemList = "<ul><li id='copy' class='" + (obj.copy ? "" : "muti-hide") + "'>复制</li><li id='search' class='" + (obj.search ? "" : "muti-hide") + "'><a target='_blank' href=''>搜索</a></li><li id='open' class='" + (isLink ? "" : "muti-hide") + "'><a target='_blank' href=''>打开</a></li></ul>";
    var divWrapper = document.createElement("div");
    divWrapper.id = "muti-translate";
    divWrapper.className = "muti-hide";
    divWrapper.innerHTML = itemList;
    docfrag.appendChild(divWrapper);
    document.body.appendChild(docfrag);
    ta = document.getElementById("muti-translate");
    open = document.getElementById("open");
    search = document.getElementById("search");
    //get selection(ie and chrome)
    if (window.attachEvent) {
        document.body.attachEvent("onmouseup", function(e) {
            board = document.selection.createRange().text;
            if ((e || event).srcElement.nodeName === "A") { //注入"打开"
                console.log("haha");
            }
        });
    } else {
        document.body.addEventListener("mouseup", function(e) {
            if (document.getSelection().toString()) {
                board = document.getSelection().toString();
                ta.className = "";
                ta.style.left = e.clientX + "px";
                ta.style.top = e.clientY - "50" + "px";
                isLink = (e.target.nodeName === "A");
                if (isLink) {
                    open.className = "";
                    open.children[0].href = e.target.href;
                }
                if (obj.search) {
                    search.children[0].href = searchLinkPre[engine.indexOf(obj.engine)] + board;
                }
                obj.translate ? sendBack('translate', board) : '';
                ta.addEventListener("click", function(e) {
                    switch (e.target.id) {
                        case "copy":
                            sendBack('copy', board);
                            break;
                        default:
                            return;
                    }
                });

                function dataResponse(data) {
                    translateWrapper.textContent = JSON.stringify(data);
                    ta.appendChild(translateWrapper);
                }
                chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                    if (request.cmd == 'translate-back') {
                        dataResponse(JSON.parse(request.data));
                    }
                });
            } else {
                ta.className = "muti-hide";
            }
        });
        document.body.addEventListener("wheel", function(e) {
            ta.className = "muti-hide";
        });
    }
});

//var e = evt || window.event;

/*if(e.preventDefault){
        e.preventDefault();
    }
         
    if (e.stopPropagation){
        e.stopPropagation();
    }else{
        e.returnValue = false; // 解决IE8右键弹出
        e.cancelBubble = true;
    }*/

//$("translate").addEventListener('mouseup', stopDefAction, false);

//鼠标既不在目标, 又不在translate则隐藏, 或者鼠标滚动
// StorageArea.get('copy', function(item) {

// });


// document.body.appendChild(docfrag);