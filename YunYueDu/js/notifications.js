/*发布*/
(function () {
    "use strict";
    function notifications() {

        var notifications = Windows.UI.Notifications;//TileWideImageAndText01
        var template = notifications.TileTemplateType.tileWideImageAndText01;
        var tileXml = notifications.TileUpdateManager.getTemplateContent(template);
        /*images*/
        var tileImageAttributes = tileXml.getElementsByTagName("image");
        tileImageAttributes[0].setAttribute("src", "ms-appx:///images/splashscreen.png");
        tileImageAttributes[0].setAttribute("alt", "red graphic");
        /*text*/
        var tileTextAttributes = tileXml.getElementsByTagName("text");
        tileTextAttributes[0].appendChild(tileXml.createTextNode("Hello World! My very own tile notification"));

        var tileNotification = new notifications.TileNotification(tileXml);

        notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);

    }


})();