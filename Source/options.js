
$(function() {
  $("#active-menu-items, #inactive-menu-items").sortable({
    connectWith: ".menu-items"
  }).disableSelection();
});

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
  for (var thisMenuItem in allMenuItems) {
    if (-1 == menuItems.indexOf(thisMenuItem)) {
      addMenuItem("inactive-menu-items", thisMenuItem, allMenuItems[thisMenuItem]);
    }
  }
}

function addMenuItem(parentElementId, id, name) {
  var parentElement = document.getElementById(parentElementId);
  if (null !== parentElement) {
    var menuItemElement = document.createElement("div");
    menuItemElement.setAttribute("class", "menu-item");
    menuItemElement.setAttribute("id", id);
    menuItemElement.appendChild(document.createTextNode(name));
    parentElement.appendChild(menuItemElement);
  }
}

function showSavedMessage() {
  $("#message").slideDown().delay(1000).slideUp();
}

function load() {
  var options = chrome.extension.getBackgroundPage().getOptions();
  setTextValue("user-name", options.userName);
  setCheckboxState("use-https", options.useHttps);
  setCheckboxState("reuse-tabs", options.reuseTabs);
  setMenuItems(options.menuItems);
}

function save() {
  chrome.extension.getBackgroundPage().setOptions({
    userName: getTextValue("user-name"),
  useHttps: getCheckboxState("use-https"),
  reuseTabs: getCheckboxState("reuse-tabs"),
  menuItems: getMenuItems("active-menu-items")
  });
  showSavedMessage();
}

document.addEventListener('load', function () {
  window.addEventListener("load", load);
});
