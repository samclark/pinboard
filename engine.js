function openUrl(url) {
	chrome.tabs.getAllInWindow(null, function (tabs) {
		for (var i in tabs) {
			var tab = tabs[i];
			if (tab.url == url || tab.url == url.replace("http://", "https://")) {
				chrome.tabs.update(tab.id, {selected:true});	
				close();
				return;
			}
		}
		chrome.tabs.create({url: url});		
		close();
	});
}

function openOptions() {	
	openUrl(chrome.extension.getURL("options.html"));
}

function openBookmarksPage(pageName) {
	openUrl("http://pinboard.in/u:" + getOptionUserName() + "/" + pageName);
}

function openAllBookmarks() {
	openBookmarksPage("");
}

function openPrivateBookmarks() {
	openBookmarksPage("private/");
}

function openPublicBookmarks() {
	openBookmarksPage("public/");
}

function openUnreadBookmarks() {
	openBookmarksPage("unread/");
}

function openUntaggedBookmarks() {
	openBookmarksPage("untagged/");
}

function openStarredBookmarks() {
	openBookmarksPage("starred/");
}

function saveBookmark() {
    chrome.tabs.getSelected(null , function(tab) {
        if (tab.url.indexOf("http:") != 0 && tab.url.indexOf("https:") != 0) {
            window.open("http://pinboard.in/add?jump=close&url=" + encodeURIComponent(tab.url) + "&title=" + encodeURIComponent(tab.title), "pinboad.in", "location=no,links=no,scrollbars=no,toolbar=no,width=700,height=350");
        } else {
            chrome.tabs.sendRequest(tab.id, {method: "getSelection"}, function(response) {
                window.open("http://pinboard.in/add?jump=close&url=" + encodeURIComponent(tab.url) + "&title=" + encodeURIComponent(tab.title) + "&description=" + encodeURIComponent(response.data.substr(0, 256)), "pinboad.in", "location=no,links=no,scrollbars=no,toolbar=no,width=700,height=350");
            });
        }
    });
}

function readLater() {
	chrome.tabs.getSelected(null , function(tab) {
 		window.open("http://pinboard.in/add?later=yes&noui=yes&jump=close&url=" + encodeURIComponent(tab.url) + "&title=" + encodeURIComponent(tab.title), "pinboad.in", "location=no,links=no,scrollbars=no,toolbar=no,width=0,height=0"); 		
	});
}

