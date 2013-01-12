function getTextValue(elementId) {
    return document.getElementById(elementId).value;
}

function setTextValue(elementId, text) {
    document.getElementById(elementId).value = text;
}

function getCheckboxState(elementId) {
    return document.getElementById(elementId).checked ? "yes" : "no";
}

function setCheckboxState(elementId, checked) {
    document.getElementById(elementId).checked = ("yes" == checked);
}

function getMenuItems() {
    return $("#active-menu-items").sortable("toArray");
}

function setMenuItems(menuItems) {
    var allMenuItems = chrome.extension.getBackgroundPage().getAllMenuItems();
    for (var i in menuItems) {
        var menuItem = menuItems[i];
        if (menuItem in allMenuItems) {
            addMenuItem("active-menu-items", menuItem, allMenuItems[menuItem]);
        }
    }
    for (var menuItem in allMenuItems) {
        if (-1 == menuItems.indexOf(menuItem)) {
            addMenuItem("inactive-menu-items", menuItem, allMenuItems[menuItem]);
        }
    }
}

function addMenuItem(parentElementId, id, name) {
    var parentElement = document.getElementById(parentElementId);
    if (null != parentElement) {
        var menuItemElement = document.createElement("div");
        menuItemElement.setAttribute("id", id);
        menuItemElement.setAttribute("class", "menu-item");
        menuItemElement.appendChild(document.createTextNode(name));
        parentElement.appendChild(menuItemElement);
    }
}

function loadSettings() {
	var settings = chrome.extension.getBackgroundPage().getSettings();
	setTextValue("api-token", settings.apiToken);
	setCheckboxState("always-open-new-tabs", settings.alwaysOpenNewTabs);
	setCheckboxState("show-desktop-notifications", settings.showDesktopNotifications);
	setMenuItems(settings.menuItems);
}

function showSavedMessage() {
	$("#message").fadeIn('slow', function() { setTimeout(function() { $("#message").fadeOut('fast') }, 500); });
}
			
function saveSettings() {
	var settings = new Settings();
	settings.apiToken = getTextValue("api-token");
	settings.alwaysOpenNewTabs = getCheckboxState("always-open-new-tabs");
	settings.showDesktopNotifications = getCheckboxState("show-desktop-notifications");
	settings.menuItems = getMenuItems("active-menu-items");
	setSettingsInLocalStorage(settings);
	chrome.extension.getBackgroundPage().setSettings(settings);
    showSavedMessage();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('closeButton').addEventListener('click', function() { window.close(); });
	loadSettings();
	$(function() {
		$("#active-menu-items, #inactive-menu-items").sortable( {
			connectWith: ".menu-items" 
		}).disableSelection();
	});
    document.getElementById('saveButton').addEventListener('click', saveSettings);
});
