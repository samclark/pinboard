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
  alert("getOptions");
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
