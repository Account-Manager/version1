jQuery.sap.declare("manager.util.storage");

manager.util.Storage = function() {
    if (localStorage.language == undefined){
        localStorage.language = "DE";
    }
};

manager.util.Storage.prototype.getLanguage = function() {
    return localStorage.language;
};

manager.util.Storage.prototype.setLanguage = function(sLocale) {
    localStorage.language = sLocale;
};