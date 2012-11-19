chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
      chrome.tabs.getSelected(null , function(tab) {
        window.open("https://pinboard.in/add?later=yes&noui=yes&jump=close&url=" + encodeURIComponent(tab.url) + "&title=" + encodeURIComponent(tab.title), "pinboad.in", "location=no,links=no,scrollbars=no,toolbar=no,width=0,height=0");
        var notification = webkitNotifications.createHTMLNotification("notification.html");
        notification.show();
        setTimeout(function(){notification.cancel();}, 3000);
      });
    }
);


function getOptionValue(name, defaultValue) {
  var value = localStorage.getItem(name);
  return value ? value : defaultValue;
}

function setOptionValue(name, value) {
  if (value) {
    localStorage.setItem(name, value);
  } else {
    localStorage.removeItem(name);
  }
}

function getOptionArrayValues(name, defaultValue) {
  var values = localStorage.getItem(name);
  return values ? JSON.parse(values) : defaultValue;
}

function setOptionArrayValues(name, values) {
  if (values) {
    localStorage.setItem(name, JSON.stringify(values));
  } else {
    localStorage.removeItem(name);
  }
}

function getOptionUserName() {
  return getOptionValue("userName", "");
}

function setOptionUserName(value) {
  setOptionValue("userName", value);
}

function getOptionUseHttps() {
  return getOptionValue("useHttps", "yes");
}

function setOptionUseHttps(value) {
  setOptionValue("useHttps", value);
}

function getOptionReuseTabs() {
  return getOptionValue("reuseTabs", "yes");
}

function setOptionReuseTabs(value) {
  setOptionValue("reuseTabs", value);
}

function getOptionMenuItems() {
  return getOptionArrayValues("menuItems", "");
}

function setOptionMenuItems(values) {
  setOptionArrayValues("menuItems", values);
}

function getOptions() {
  return { userName: getOptionUserName(),
    useHttps: getOptionUseHttps(),
    reuseTabs: getOptionReuseTabs(),
    menuItems: getOptionMenuItems()
  };
}

function setOptions(options) {
  setOptionUserName(options.userName);
  setOptionUseHttps(options.useHttps);
  setOptionReuseTabs(options.reuseTabs);
  setOptionMenuItems(options.menuItems);
}

function getAllMenuItems() {
  return { allBookmarks : "All Bookmarks", 
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

function updateIcon() {
  chrome.browserAction.setIcon({path:"icon_19_b.png"});
}

updateIcon();

