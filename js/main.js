//阻止"搜索菜单"的弹出菜单
var body = document.body;
$ = function(id) {
    return document.getElementById(id);
};

function stopDefAction(evt) {
    evt.preventDefault();
}

var e = evt || window.event;

/*if(e.preventDefault){
        e.preventDefault();
    }
         
    if (e.stopPropagation){
        e.stopPropagation();
    }else{
        e.returnValue = false; // 解决IE8右键弹出
        e.cancelBubble = true;
    }*/

$("translate").addEventListener('mouseup', stopDefAction, false);
var board; //board用来搜索及存到剪切板
//get selection(ie and chrome)
if (window.attachEvent) {
    body.attachEvent("onmouseup", function(e) {
        board = document.selection.createRange().text;
        if ((e || event).srcElement.nodeName === "A") { //注入"打开"
            console.log("haha");
        }
    });
} else {
    body.addEventListener("mouseup", function(e) {
        board = document.getSelection().toString();
    });
}

//get storage
StorageArea.get();
//插入文档
var docfrag = document.createDocumentFragment();
StorageArea.get('copy', function(item) {

});


body.appendChild(docfrag);