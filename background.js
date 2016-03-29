var cachedSettings = null;

function getSettings() {
    return cachedSettings;
}

function setSettings(settings) {
	cachedSettings = settings;
}

function getAllMenuItems() {
	return {
		allBookmarks : "All Bookmarks",
		privateBookmarks : "Private Bookmarks",
		publicBookmarks : "Public Bookmarks",
		unreadBookmarks : "Unread Bookmarks",
		untaggedBookmarks : "Untagged Bookmarks",
		starredBookmarks : "Starred Bookmarks",
		networkBookmarks : "Network Bookmarks",
		recentBookmarks : "Recent Bookmarks",
		popularBookmarks : "Popular Bookmarks",
		saveBookmark : "Save Bookmark",
		readLater : "Read Later",
		addNote : "Add Note"
	};
}

function getUserNameFromApiToken(apiToken) {
	return apiToken ? apiToken.substring(0, apiToken.indexOf(":")) : "";
}

function openUrl(url) {
	if ("yes" == getSettings().alwaysOpenNewTabs) {
		chrome.tabs.create({url: url});
	} else {
		chrome.tabs.getAllInWindow(null, function (tabs) {
			for (var i in tabs) {
				var tab = tabs[i];
				if (tab.url == url) {
					chrome.tabs.update(tab.id, {url:url, selected:true});
					return;
				}
			}
			chrome.tabs.create({url: url});
		});
	}
}

function showOptions() {
	chrome.tabs.create({url: chrome.extension.getURL("options.html")});
}

function allBookmarks() {
	openUrl("https://pinboard.in/u:" + getUserNameFromApiToken(getSettings().apiToken) + "/");
}

function privateBookmarks() {
	openUrl("https://pinboard.in/u:" + getUserNameFromApiToken(getSettings().apiToken) + "/private/");
}

function publicBookmarks() {
	openUrl("https://pinboard.in/u:" + getUserNameFromApiToken(getSettings().apiToken) + "/public/");
}

function unreadBookmarks() {
	openUrl("https://pinboard.in/u:" + getUserNameFromApiToken(getSettings().apiToken) + "/unread/");
}

function untaggedBookmarks() {
	openUrl("https://pinboard.in/u:" + getUserNameFromApiToken(getSettings().apiToken) + "/untagged/");
}

function starredBookmarks() {
	openUrl("https://pinboard.in/u:" + getUserNameFromApiToken(getSettings().apiToken) + "/starred/");
}

function networkBookmarks() {
	openUrl("https://pinboard.in/network/");
}

function recentBookmarks() {
	openUrl("https://pinboard.in/recent/");
}

function popularBookmarks() {
	openUrl("https://pinboard.in/popular/");
}

function saveBookmark() {
	chrome.tabs.getSelected(null , function(tab) {
		chrome.tabs.executeScript(tab.id, {code: "window.getSelection().toString();"}, function(selection) {
			var url = "https://pinboard.in/add?jump=close&url=" + encodeURIComponent(tab.url) + "&title=" + encodeURIComponent(tab.title);
			if (null != selection && 0 < selection.length && null != selection[0] && 0 < selection[0].length) {
				url = url + "&description=" + encodeURIComponent(selection[0]);
			}
			window.open(url.substr(0, 2000), "pinboad.in", "location=no,links=no,scrollbars=no,toolbar=no,width=700,height=550");	
		});
    });
}

function readLater() {
	chrome.tabs.getSelected(null , function(tab) {
		$.ajax({
			contentType: "text/plain",
			crossDomain: true,
			data: {
		    	auth_token: getSettings().apiToken,
				url: tab.url,
				description: tab.title,
				shared: "no",
				toread: "yes"
			},
			dataType: "json",
			timeout: 10 * 1000,
			type: "GET",
            url: "https://api.pinboard.in/v1/posts/add"
		}).always(function (data) {
			if (200 == data.status) {
				var result = $(data.responseXML).find("result").attr("code");
				if ("done" == result) {
				  if ("yes" == getSettings().showDesktopNotifications) {
            chrome.notifications.create("", {
                type: 'basic',
                iconUrl: "icon_48.png",
                title: "Saved Read Later",
                message: ""
              }, function(notificationId){
                setTimeout(function(){
                  chrome.notifications.clear(notificationId, function(wasCleared) { });
                }, 2000);
            });
          }
				}
				else {
          chrome.notifications.create("", {
              type: 'basic',
              iconUrl: "icon_48.png",
              title: "Error Saving Read Later",
              message: result
            }, function(notificationId){ }
          );
				}
			}
			else {
        chrome.notifications.create("", {
            type: 'basic',
            iconUrl: "icon_48.png",
            title: "Error Saving Read Later",
            message: data.statusText
          }, function(notificationId){ }
        );
			}
		});
	});
}

function addNote() {
	openUrl("https://pinboard.in/note/add/");
}

document.addEventListener("DOMContentLoaded", function () {
	chrome.commands.onCommand.addListener(function(command) {
		if ("save-bookmark" == command) {
	  		saveBookmark();
	  	}
	  	else if ("read-later" == command) {
	  		readLater();
	  	}
	});

	setSettings(getSettingsFromLocalStorage());

	chrome.browserAction.setIcon({ path: "icon_19_dark.png" });
});
