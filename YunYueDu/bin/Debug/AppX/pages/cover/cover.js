(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;

    ui.Pages.define("/pages/cover/cover.html", {
        // 每当用户导航至此页面时都要调用此功能。它
        // 使用应用程序的数据填充页面元素。
        ready: function (element, options) {
            var picHost = document.getElementById("picHost");
            var toggleSwitch = element.querySelector(".enterHome").winControl;
            toggleSwitch.addEventListener("change", enterHomeHandler);
            
            picHandler();
            notifications();

        }
    });

    function enterHomeHandler() {
        document.querySelector(".enterHome").winControl.checked = true;
 
        clearInterval(window.interval);
        var picHost = document.getElementById("picHost");
        
        picHost.style.zIndex = -10;
        //picHost.style.opacity = 0;
 /*       picHost.style.display = "hidden";
        WinJS.Promise.cancel;
        clearInterval(window.tii);*/

        WinJS.Navigation.navigate('/pages/items/items.html');
    }

    function picHandler() {
        
        var picHost = document.getElementById("picHost");
        var coverContent = document.getElementById("coverContent");
        var title = document.getElementById("title");
        var content = document.getElementById("content");
        document.getElementById("extendedSplashScreen").style.display = "none";

        picHost.style.zIndex = 10;
        var index=4;
        (function timer() {
            
            index + 1 >= 4 ? index = 0 : index = index + 1;
            coverContent.style.opacity = 0;
            title.innerText = Data.covers[index].title;
            content.innerText = Data.covers[index].content;
            picHost.style.backgroundImage = "url('" + "ms-appdata:///local/cover_" + Data.covers[index].key + ".jpg" + "')";
            picHost.style.backgroundSize = "cover";
            WinJS.UI.Animation.fadeIn(picHost).then(function () {
                WinJS.UI.Animation.enterContent(coverContent, null);
            });

            window.interval = setInterval(function () {
                index + 1 >= 4 ? index = 0 : index = index + 1;
                if (Data.covers[index]) {
                    coverContent.style.opacity = 0;
                    title.innerText = Data.covers[index].title;
                    content.innerText = Data.covers[index].content;
                    picHost.style.backgroundImage = "url('" + "ms-appdata:///local/cover_" + Data.covers[index].key + ".jpg" + "')";
                    picHost.style.backgroundSize = "cover";
                    WinJS.UI.Animation.fadeIn(picHost).then(function () {
                        WinJS.UI.Animation.enterContent(coverContent, null);
                    })
                }
            },5000)

/*
            WinJS.Promise.timeout(interval).done(
                    function (complete) {
                        index + 1 >= 4 ? index = 0 : index = index + 1;
                        coverContent.style.opacity = 0;
                        title.innerText = Data.covers[index].title;
                        content.innerText = Data.covers[index].content;
                        picHost.style.backgroundImage = "url('" + "ms-appdata:///local/cover_" + Data.covers[index].key + ".jpg" + "')";
//                        picHost.style.backgroundPosition = "0% 0%"
                        picHost.style.backgroundSize = "cover";

                    
                        WinJS.UI.Animation.fadeIn(picHost).then(function () {
                            WinJS.UI.Animation.enterContent(coverContent, null);
                        }).done(function () {

                            Init.State.timer && WinJS.Promise.timeout(5000).done(function () {
                                return timer(100);
                            });
                            ///*
                            var i = Math.random(20) + 100, heiht = 0;
                            
                                var flag = -1;
                                window.tii = setInterval(function () {
                                    i < 101 ? flag = 1 : 1;
                                    i > 120 ? flag = -1 : 1;
                                    picHost.style.backgroundSize = i + "% auto";
                                    picHost.style.backgroundPosition = "0% "+heiht+"%";
                                    i = i + flag * 0.1;
                                    heiht = heiht +  0.5;
                                }, 1000/36);
    

                        });
                    });
*/
        })();

    }



    function notifications() {
        var notifications = Windows.UI.Notifications;//TileWideImageAndText01
        notifications.TileUpdateManager.createTileUpdaterForApplication().enableNotificationQueue(true);

        for (var i = 0; i <= 4; i++) {
            if (Data.covers[i]) {
                var template = notifications.TileTemplateType.tileWideImageAndText01;
                var tileXml = notifications.TileUpdateManager.getTemplateContent(template);
                /*images*/
                var tileImageAttributes = tileXml.getElementsByTagName("image");
                tileImageAttributes[0].setAttribute("src", "ms-appdata:///local/thumbnail_" + Data.covers[i].key + ".jpg");
                tileImageAttributes[0].setAttribute("alt", "red graphic");
                /*text*/
                var tileTextAttributes = tileXml.getElementsByTagName("text");
                tileTextAttributes[0].appendChild(tileXml.createTextNode(Data.covers[i].content));
                var tileNotification = new notifications.TileNotification(tileXml);
                notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);

            }
        }
    }
})();