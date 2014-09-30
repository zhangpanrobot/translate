chrome.runtime.onMessage.addListener(function(msg) {
	switch (msg.cmd) {
		case 'copy':
			var input = document.createElement('textarea');
			document.body.appendChild(input);
			input.value = msg.text;
			input.focus();
			input.select();
			document.execCommand('Copy');
			input.remove();
			break;
		case 'translate':
			var xhp = new XMLHttpRequest();
			xhp.onreadystatechange = function() {
				if (xhp.readyState == 4 && xhp.status == 200) { //xhp.responseText;
					chrome.tabs.query({
						active: true
					}, function(tabs) {
						chrome.tabs.sendMessage(tabs[0].id, {
							cmd: 'translate-back',
							data: xhp.responseText
						});
					});
				}
			}
			xhp.open('GET', 'http://fanyi.youdao.com/openapi.do?keyfrom=sogou-inc&key=1309482814&type=data&doctype=json&version=1.1&q=' + msg.text, true);
			xhp.send();
		default:
			return;
	}
});