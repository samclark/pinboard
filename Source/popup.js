
function addMenuItem(name, onClickFunction) {
  var parentElement = document.getElementById("menu");
  if (null !== parentElement) {
    var menuItemElement = document.createElement("div");
    menuItemElement.setAttribute("class", "menu-item");
    menuItemElement.setAttribute("onclick", onClickFunction);
    menuItemElement.appendChild(document.createTextNode(name));
    parentElement.appendChild(menuItemElement);
  }
}

function addMenuItems() {
  var options = chrome.extension.getBackgroundPage().getOptions();
  if ("" === options.userName) {
    addMenuItem("Setup User Name", "openUrl(\"" + chrome.extension.getURL("options.html") + "\"); window.close();");
  }
  else {
    var len = options.menuItems.length;
    if (0 === len) {
      addMenuItem("Setup Menu Items", "openUrl(\"" + chrome.extension.getURL("options.html") + "\"); window.close();");
    }
    else {
      var openMethod = "yes" == options.reuseTabs ? "reopenUrl" : "openUrl";
      var protocol = "yes" == options.useHttps ? "https://" : "http://";
      var allMenuItems = chrome.extension.getBackgroundPage().getAllMenuItems();
      for (var i=0; i<len; ++i) {
        var menuItem = options.menuItems[i];
        if ("allBookmarks" == menuItem) {
          addMenuItem(allMenuItems[menuItem], openMethod + "(\"" + protocol + "pinboard.in/u:" + options.userName + "/\");");
        } else if ("privateBookmarks" == menuItem) {
          addMenuItem(allMenuItems[menuItem], openMethod + "(\"" + protocol + "pinboard.in/u:" + options.userName + "/private/\");");
        } else if ("publicBookmarks" == menuItem) {
          addMenuItem(allMenuItems[menuItem], openMethod + "(\"" + protocol + "pinboard.in/u:" + options.userName + "/public/\");");
        } else if ("unreadBookmarks" == menuItem) {
          addMenuItem(allMenuItems[menuItem], openMethod + "(\"" + protocol + "pinboard.in/u:" + options.userName + "/unread/\");");
        } else if ("untaggedBookmarks" == menuItem) {
          addMenuItem(allMenuItems[menuItem], openMethod + "(\"" + protocol + "pinboard.in/u:" + options.userName + "/untagged/\");");
        } else if ("starredBookmarks" == menuItem) {
          addMenuItem(allMenuItems[menuItem], openMethod + "(\"" + protocol + "pinboard.in/u:" + options.userName + "/starred/\");");
        } else if ("networkBookmarks" == menuItem) {
          addMenuItem(allMenuItems[menuItem], openMethod + "(\"" + protocol + "pinboard.in/network/\");");
        } else if ("recentBookmarks" == menuItem) {
          addMenuItem(allMenuItems[menuItem], openMethod + "(\"" + protocol + "pinboard.in/recent/\");");
        } else if ("popularBookmarks" == menuItem) {
          addMenuItem(allMenuItems[menuItem], openMethod + "(\"" + protocol + "pinboard.in/popular/\");");
        } else if ("saveBookmark" == menuItem) {
          addMenuItem(allMenuItems[menuItem], "saveBookmark();");
        } else if ("readLater" == menuItem) {
          addMenuItem(allMenuItems[menuItem], "readLater();");
        } else if ("addNote" == menuItem) {
          addMenuItem(allMenuItems[menuItem], "openUrl(\"" + protocol + "pinboard.in/note/add/\");");
        }
      }
    }
  }
}    

function openUrl(url) {
  chrome.tabs.create({url: url});
  window.close();
}

function reopenUrl(url) {
  chrome.tabs.getAllInWindow(null, function (tabs) {
    for (var i in tabs) {
      var tab = tabs[i];
      if (tab.url == url) {
        chrome.tabs.update(tab.id, {url:url, selected:true});
        return;
      }
    }
    chrome.tabs.create({url: url});
    window.close();
  });
}

function saveBookmark() {
  chrome.tabs.getSelected(null , function(tab) {
    var selection = "";
    if (selection.length > 0)
    window.open("https://pinboard.in/add?jump=close&url=" + encodeURIComponent(tab.url) + "&title=" + encodeURIComponent(tab.title) + "&description=" + encodeURIComponent(selection.substr(0, 256)), "pinboad.in", "location=no,links=no,scrollbars=no,toolbar=no,width=700,height=360");
    else
    window.open("https://pinboard.in/add?jump=close&url=" + encodeURIComponent(tab.url) + "&title=" + encodeURIComponent(tab.title), "pinboad.in", "location=no,links=no,scrollbars=no,toolbar=no,width=700,height=360");
  });
}

function readLater() {
  chrome.tabs.getSelected(null , function(tab) {
    window.open("https://pinboard.in/add?later=yes&noui=yes&jump=close&url=" + encodeURIComponent(tab.url) + "&title=" + encodeURIComponent(tab.title), "pinboad.in", "location=no,links=no,scrollbars=no,toolbar=no,width=0,height=0");
  });
}

window.addEventListener('load', addMenuItems);

