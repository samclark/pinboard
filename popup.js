function closePopups() {
	var popups = chrome.extension.getViews({type: 'popup'});
	for (var i=0; i<popups.length; ++i) {
		popups[i].close();
	}
}

function addMenuItem(title, clickEvent) {
	var menuElement = document.getElementById("menu");
	if (menuElement) {
		var menuItemElement = document.createElement("div");
		menuItemElement.setAttribute("class", "menu-item");
		menuItemElement.addEventListener("click", clickEvent)
		menuItemElement.appendChild(document.createTextNode(title));
		menuElement.appendChild(menuItemElement);
	}
}

function addMenuItems() {
	var options = chrome.extension.getBackgroundPage().getSettings();
	if ("" == options.apiToken) {
		addMenuItem("Setup API Token", function () { chrome.extension.getBackgroundPage().showOptions(); closePopups(); });
	}
	else {
		var len = options.menuItems.length;
		if (0 == len) {
            addMenuItem("Setup Menu Items", function () { chrome.extension.getBackgroundPage().showOptions(); closePopups(); });
        } 
        else {
			var allMenuItems = chrome.extension.getBackgroundPage().getAllMenuItems();
			for (var i=0; i<len; ++i) {
				var menuItem = options.menuItems[i];						
				if ("allBookmarks" == menuItem) {
					addMenuItem(allMenuItems[menuItem], function () { chrome.extension.getBackgroundPage().allBookmarks(); closePopups(); });
				} 
				else if ("privateBookmarks" == menuItem) {
					addMenuItem(allMenuItems[menuItem], function () { chrome.extension.getBackgroundPage().privateBookmarks(); closePopups(); });
				} 
				else if ("publicBookmarks" == menuItem) {
					addMenuItem(allMenuItems[menuItem], function () { chrome.extension.getBackgroundPage().publicBookmarks(); closePopups(); });
				} 
				else if ("unreadBookmarks" == menuItem) {
					addMenuItem(allMenuItems[menuItem], function () { chrome.extension.getBackgroundPage().unreadBookmarks(); closePopups(); });
				} 
				else if ("untaggedBookmarks" == menuItem) {
					addMenuItem(allMenuItems[menuItem], function () { chrome.extension.getBackgroundPage().untaggedBookmarks(); closePopups(); });
				} 
				else if ("starredBookmarks" == menuItem) {
					addMenuItem(allMenuItems[menuItem], function () { chrome.extension.getBackgroundPage().starredBookmarks(); closePopups(); });
				} 
				else if ("networkBookmarks" == menuItem) {
					addMenuItem(allMenuItems[menuItem], function () { chrome.extension.getBackgroundPage().networkBookmarks(); closePopups(); });
				} 
				else if ("recentBookmarks" == menuItem) {
					addMenuItem(allMenuItems[menuItem], function () { chrome.extension.getBackgroundPage().recentBookmarks(); closePopups(); });
				} 
				else if ("popularBookmarks" == menuItem) {
					addMenuItem(allMenuItems[menuItem], function () { chrome.extension.getBackgroundPage().popularBookmarks(); closePopups(); });
				} 
				else if ("saveBookmark" == menuItem) {
					addMenuItem(allMenuItems[menuItem], function () { chrome.extension.getBackgroundPage().saveBookmark(); closePopups(); });
				} 
				else if ("readLater" == menuItem) {
					addMenuItem(allMenuItems[menuItem], function () { chrome.extension.getBackgroundPage().readLater(); closePopups(); });
				} 
				else if ("addNote" == menuItem) {
					addMenuItem(allMenuItems[menuItem], function () { chrome.extension.getBackgroundPage().addNote(); closePopups(); });
				}
			}
		}
	}
}

function getFirstChildElement(element) {
	if (element) {
		var firstChildElement = element.firstChild;
		while (firstChildElement && 1 != firstChildElement.nodeType) {
			firstChildElement = firstChildElement.nextSibling;
		}
		return firstChildElement;
	}
	return null;
}

function getLastChildElement(element) {
	if (element) {
		var lastChildElement = element.lastChild;
		while (lastChildElement && 1 != lastChildElement.nodeType) {
			lastChildElement = lastChildElement.previousSibling;
		}
		return lastChildElement;
	}
	return null;
}

function getNextSiblingElement(element) {
	if (element) {
		var nextSiblingElement = element.nextSibling;
		while (nextSiblingElement && 1 != nextSiblingElement.nodeType) {
			nextSiblingElement = nextSiblingElement.nextSibling;
		}
		return nextSiblingElement;
	}
	return null;
}

function getPreviousSiblingElement(element) {
	if (element) {
		var previousSiblingElement = element.previousSibling;
		while (previousSiblingElement && 1 != previousSiblingElement.nodeType) {
			previousSiblingElement = previousSiblingElement.previousSibling;
		}
		return previousSiblingElement;
	}
	return null;
}

function selectMenuItem(menuItemElement) {
	if (menuItemElement)
		menuItemElement.setAttribute("id", "selected-menu-item");
}

function unselectMenuItem(menuItemElement) {
	if (menuItemElement)
		menuItemElement.setAttribute("id", "");
}

function getSelectedMenuItem() {
	return document.getElementById("selected-menu-item");
}

function keydownHandler(event) {
	if (38 == event.keyCode) { //up
		var selectedMenuItemElement = getSelectedMenuItem();
		if (selectedMenuItemElement) {
			var previousMenuItemElement = getPreviousSiblingElement(selectedMenuItemElement);
			if (previousMenuItemElement) {
				unselectMenuItem(selectedMenuItemElement);
				selectMenuItem(previousMenuItemElement);
			}			
		}
		else {
			var lastMenuItemElement = getLastChildElement(document.getElementById("menu"));
			if (lastMenuItemElement) {
				selectMenuItem(lastMenuItemElement);
			}
		}
	}
	else if (40 == event.keyCode) { //down
		var selectedMenuItemElement = getSelectedMenuItem();
		if (selectedMenuItemElement) {
			var nextMenuItemElement = getNextSiblingElement(selectedMenuItemElement);
			if (nextMenuItemElement) {
				unselectMenuItem(selectedMenuItemElement);
				selectMenuItem(nextMenuItemElement);
			}			
		}
		else {
			var firstMenuItemElement = getFirstChildElement(document.getElementById("menu"));
			if (firstMenuItemElement) {
				selectMenuItem(firstMenuItemElement);
			}
		}
	}
	else if (13 == event.keyCode) { //enter
		var selectedMenuItem = getSelectedMenuItem();
		if (selectedMenuItem) {
			selectedMenuItem.click();
		}
	}
}

document.addEventListener("DOMContentLoaded", function () {
	document.onkeydown = keydownHandler;
	addMenuItems();
});
