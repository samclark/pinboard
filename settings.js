function Settings() {
	this.apiToken = "";
	this.alwaysOpenNewTabs = "no";
	this.showDesktopNotifications = "yes";
	this.menuItems = [];
}

function getValueFromLocalStorage(name, defaultValue) {
    var value = localStorage.getItem(name);		
    return value ? value : defaultValue;
}

function setValueInLocalStorage(name, value) {	
    if (value) {
        localStorage.setItem(name, value);
    }
    else {
        localStorage.removeItem(name);
    }
}

function getArrayValuesFromLocalStorage(name, defaultValue) {	
	var values = localStorage.getItem(name);	
	return values ? JSON.parse(values) : defaultValue;
}

function setArrayValuesInLocalStorage(name, values) {	
	if (values) {
		localStorage.setItem(name, JSON.stringify(values));
	}
	else {
		localStorage.removeItem(name);
	}
}

function getSettingsFromLocalStorage() {
	var settings = new Settings();
	settings.apiToken = getValueFromLocalStorage("apiToken", "");
	settings.alwaysOpenNewTabs = getValueFromLocalStorage("alwaysOpenNewTabs", "no");
	settings.showDesktopNotifications = getValueFromLocalStorage("showDesktopNotifications", "yes");
	settings.menuItems = getArrayValuesFromLocalStorage("menuItems", []);
	return settings;	
}

function setSettingsInLocalStorage(settings) {
	setValueInLocalStorage("apiToken", settings.apiToken);
	setValueInLocalStorage("alwaysOpenNewTabs", settings.alwaysOpenNewTabs);
	setValueInLocalStorage("showDesktopNotifications", settings.showDesktopNotifications);
	setArrayValuesInLocalStorage("menuItems", settings.menuItems);
}
