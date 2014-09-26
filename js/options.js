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
};
var obj = {};
//渲染
function defaulChecked(obj) {
	//清空checked
	var checkedItem = $$("input[checked]");
	checkedItem&&toArray(checkedItem).forEach(function(item) {
		item.removeAttribute("checked");
	});
	for (var prop in obj) {
		if (prop !== "engine") {
			$("#" + prop).setAttribute("checked", "");
		} else {
			$("#" + obj[prop]).setAttribute("checked", "");
		}
	}
};
defaulChecked(defaultObj);
var setMuti = $("#setting");
setMuti.addEventListener("click", function(e) {
	var targetLi = e.target.parentNode;
	if (targetLi.tagName === 'LI') {
		var firstChild = targetLi.children[0];
		checkToggle(e, firstChild);
		obj[firstChild.id] = obj[firstChild.id] ? false : true;
	}
});

$("#disableAll").addEventListener("click", function(e) {
	var firstChild = e.currentTarget.children[0];
	checkToggle(e, firstChild);
	obj["disableAll"] = !obj["disableAll"];
	setMuti.className = setMuti.className? "":"mask";
	//重绘
	obj["disableAll"]?defaulChecked({"engine":engine[0]}):defaulChecked(defaultObj);
});

$("#engine").addEventListener("click", function(e) {
	e.stopPropagation();
	var engineList = $$("#engine input");
	toArray(engineList).forEach(function(item) {
		item.removeAttribute("checked");
	});
	engineList[Math.ceil(Array.prototype.indexOf.call(this.children, e.target) / 2)].setAttribute("checked", "");
	obj["engine"] = e.target['id' || 'for'];
});

function checkToggle(e, firstChild) {
	firstChild.hasAttribute("checked") ? firstChild.removeAttribute("checked") : firstChild.setAttribute("checked", "");
}