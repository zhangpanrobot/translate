var engine = ["sogou", "baidu", "google"];
//options switch
var mutiFunc = function() {
	this.copy = true;
	this.search = true;
	this.engine = engine[0];
	this.translate = true;
	this.disable = false;
};
mutiFunc.prototype.switch = function(key) {
	this[key] == true ? false : true;
};
mutiFunc.prototype.switchAll = function() {
	var that = this;

	function disableAll() {
		for (var i in that) {
			typeof(that[i]) === "bolean" && that[i] = false;
		}
		that.disable = true;
	}

	function setDefault() {
		that = new mutiFunc();
	}

	that.disable ? setDefault() : disableAll();
};
mutiFunc.prototype.switchEngine = function(idx) {
	this.engine = engine[idx];
};
var activeFunc = new mutiFunc();
//绑定各种事件


//事件回调
function setStorage(activeFunc) {
	StorageArea.set(activeFunc, function() {});
}