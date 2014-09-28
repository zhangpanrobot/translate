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
		default:
			return;
	}
});