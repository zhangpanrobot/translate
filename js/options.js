var engine = ["sogou", "baidu", "google"];
var setMuti = $("#setting");

function $(selector) {
	return document.querySelector(selector);
}

function $$(selector) {
	return document.querySelectorAll(selector);
}

function toArray(obj) {
	return Array.prototype.slice.call(obj);
}
var defaultObj = {
	"copy": true,
	"search": true,
	"engine": engine[0],
	"translate": true,
	"disableAll": false
};
var obj = {};
chrome.storage.local.get(null, function(item) {
	obj = Object.keys(item).length ? item : defaultObj;
	defaulChecked(obj);
});
//渲染
function defaulChecked(obj) {
	//清空checked
	var checkedItem = $$("input");
	checkedItem && toArray(checkedItem).forEach(function(item) {
		item["checked"] = false;
	});
	for (var prop in obj) {
		if (obj.disableAll) {
			if (prop !== "engine") {
				$("#" + prop)["checked"] = false;
				$("#disableAll")["checked"] = true; 
				setMuti.className = "mask";
			} else {
				$("#" + obj[prop])["checked"] = false;
				$("#sogou")["checked"] = true;
			}
		} else {
			if(prop !== "engine") {
				$("#" + prop)["checked"] = obj[prop];
				setMuti.className = "";
			} else {
				$("#sogou")["checked"] = false;
				$("#" + obj[prop])["checked"] = true;
			}
		}
	}
};

setMuti.addEventListener("click", function(e) {
	var targetLi = e.target.parentNode;
	if (targetLi.tagName === 'LI') {
		var firstChild = targetLi.children[0];
		obj[firstChild.id] = !obj[firstChild.id];
	}
	chrome.storage.local.set(obj);
});

$("#disableAll").addEventListener("click", function(e) {
	obj.disableAll = !obj.disableAll;
	obj = obj.disableAll?obj: defaultObj;
	if(obj.disableAll){
		obj.engine = "sogou";
	}
	setMuti.className = setMuti.className ? "" : "mask";
	//重绘
	defaulChecked(obj);
	chrome.storage.local.set(obj);
});

$("#engine").addEventListener("click", function(e) {
	e.stopPropagation();
	var engineList = $$("#engine input");
	toArray(engineList).forEach(function(item) {
		item["checked"] = false;
	});
	engineList[Math.ceil(Array.prototype.indexOf.call(this.children, e.target) / 2)]["checked"] = true;
	obj["engine"] = e.target['id' || 'for'];
	chrome.storage.local.set(obj);
});