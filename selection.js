chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if ("getSelection" == request.method) {
		sendResponse({data: window.getSelection().toString()});
	} 
	else {
		sendResponse({}); // snub them.
	}
});