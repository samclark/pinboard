function save_drop_down_list_option(elementId, storageName) {
		var element = document.getElementById(elementId);
		var value = element.children[element.selectedIndex].value;
		localStorage[storageName] = value;
	}

function load_drop_down_list_option(elementId, storageName) {
	var value = localStorage[storageName];
	if (!value) {
		return;
	}

	var element = document.getElementById(elementId);

	for (var i=0; i<element.children.length; i++) {
		var child = element.children[i];
		if (child.value == value) {
			child.selected = "true";
			break;
		}
	}
}

function getOptionValue(name, defaultValue) {	
	var value = localStorage[name];	
	if (!value) {
		return defaultValue;
	}		
	return value;
}

function setOptionValue(name, value) {	
	if (value) {
		localStorage[name] = value;
	}
	else {
		localStorage.removeItem(name);
	}
}

function getOptionUserName() {
	return getOptionValue("userName", "");
}

function setOptionUserName(value) {
	return setOptionValue("userName", value);
}

function getOptionShowAllBookmarks() {
	return getOptionValue("showAllBookmarks", "yes");
}

function setOptionShowAllBookmarks(value) {
	return setOptionValue("showAllBookmarks", value);
}

function getOptionShowPrivateBookmarks() {
	return getOptionValue("showPrivateBookmarks", "no");
}

function setOptionShowPrivateBookmarks(value) {
	return setOptionValue("showPrivateBookmarks", value);
}

function getOptionShowPublicBookmarks() {
	return getOptionValue("showPublicBookmarks", "no");
}

function setOptionShowPublicBookmarks(value) {
	return setOptionValue("showPublicBookmarks", value);
}

function getOptionShowUnreadBookmarks() {
	return getOptionValue("showUnreadBookmarks", "no");
}

function setOptionShowUnreadBookmarks(value) {
	return setOptionValue("showUnreadBookmarks", value);
}

function getOptionShowUntaggedBookmarks() {
	return getOptionValue("showUntaggedBookmarks", "no");
}

function setOptionShowUntaggedBookmarks(value) {
	return setOptionValue("showUntaggedBookmarks", value);
}

function getOptionShowStarredBookmarks() {
	return getOptionValue("showStarredBookmarks", "no");
}

function setOptionShowStarredBookmarks(value) {
	return setOptionValue("showStarredBookmarks", value);
}

function getOptionShowSaveBookmark() {
	return getOptionValue("showSaveBookmark", "yes");
}

function setOptionShowSaveBookmark(value) {
	return setOptionValue("showSaveBookmark", value);
}

function getOptionShowReadLater() {
	return getOptionValue("showReadLater", "yes");
}

function setOptionShowReadLater(value) {
	return setOptionValue("showReadLater", value);
}