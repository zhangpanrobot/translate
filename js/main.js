//阻止"搜索菜单"的弹出菜单
function $(id) {
    return document.getElementById(id);
};

function stopDefAction(evt) {
    evt.preventDefault();
}

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
var board; //board用来搜索及存到剪切板
//get selection(ie and chrome)
if (window.attachEvent) {
    window.attachEvent("onmouseup", function(e) {
        board = document.selection.createRange().text;
        if ((e || event).srcElement.nodeName === "A") { //注入"打开"
            console.log("haha");
        }
    });
} else {
    window.addEventListener("mouseup", function(e) {
        var ta = document.getElementById("muti-translate");

        if (document.getSelection().toString()) {
            isLink = (e.target.nodeName === "A");
            if (isLink) document.getElementById("open").className = "";
            board = document.getSelection().toString();
            ta.className = "";
            ta.style.left = e.clientX + "px";
            ta.style.top = e.clientY - "50" + "px";
            // chrome.runtime.sendMessage({
            //     cmd: 'copy',
            //     text: board
            // });
        } else {
            ta.className = "muti-hide";
        }
    });
}

//插入文档
var isLink = true;
chrome.storage.local.get(null, function(obj) {
    if (obj.disableAll) {
        return;
    } else {
        var docfrag = document.createDocumentFragment();
        var itemList = "<ul><li id='copy' class='" + (obj.copy ? "" : "muti-hide") + "'>复制</li><li id='search' class='" + (obj.search ? "" : "muti-hide") + "'><a target='_blank' href=''>搜索</a></li><li id='open' class='" + (isLink ? "" : "muti-hide") + "'><a target='_blank' href=''>打开</a></li></ul>";
        var divWrapper = document.createElement("div");
        divWrapper.id = "muti-translate";
        divWrapper.className = "muti-hide";
        divWrapper.innerHTML = itemList;
        docfrag.appendChild(divWrapper);
        document.body.appendChild(docfrag);
    }
});

// StorageArea.get('copy', function(item) {

// });


// document.body.appendChild(docfrag);