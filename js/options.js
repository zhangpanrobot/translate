var engine = ["sogou", "baidu", "google"];

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
//渲染
function defaulChecked(obj) {
	//清空checked
	var checkedItem = $$("input");
	checkedItem && toArray(checkedItem).forEach(function(item) {
		item["checked"] = false;
	});
	for (var prop in obj) {
		if (prop !== "engine") {
			$("#" + prop)["checked"] = (prop == "disableAll" ? false : true);
		} else {
			$("#" + obj[prop])["checked"] = true;
		}
	}
};
defaulChecked(defaultObj);
var setMuti = $("#setting");
setMuti.addEventListener("click", function(e) {
	var targetLi = e.target.parentNode;
	if (targetLi.tagName === 'LI') {
		var firstChild = targetLi.children[0];
		obj[firstChild.id] = !obj[firstChild.id];
	}
});

$("#disableAll").addEventListener("click", function(e) {
	obj["disableAll"] = !obj["disableAll"];
	setMuti.className = setMuti.className ? "" : "mask";
	//重绘
	obj["disableAll"] ? defaulChecked({
		"engine": engine[0]
	}) : defaulChecked(defaultObj);
});

$("#engine").addEventListener("click", function(e) {
	e.stopPropagation();
	var engineList = $$("#engine input");
	toArray(engineList).forEach(function(item) {
		item["checked"] = false;
	});
	engineList[Math.ceil(Array.prototype.indexOf.call(this.children, e.target) / 2)]["checked"] = true;
	obj["engine"] = e.target['id' || 'for'];
});