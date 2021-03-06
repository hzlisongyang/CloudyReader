﻿// 有关“拆分”模板的简介，请参阅以下文档:
// http://go.microsoft.com/fwlink/?LinkID=232447
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    var splash = null; 
    var dismissed = false;
    var coordinates = { x: 0, y: 0, width: 0, height: 0 };

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                splash = args.detail.splashScreen;
                var extendedSplashImage = document.getElementById("extendedSplashImage");
                var extendedSplashProgress = document.getElementById("extendedSplashProgress");
                extendedSplashImage.style.top = splash.imageLocation.y + "px";
                extendedSplashImage.style.left = splash.imageLocation.x + "px";
                extendedSplashImage.style.height = splash.imageLocation.height + "px";
                extendedSplashImage.style.width = splash.imageLocation.width + "px";
                extendedSplashProgress.style.top = (250 + splash.imageLocation.y) + "px";             
                Init.getCovers() && navigator.splashscreen.hidden();//picHandler

            } else {
                // TODO: 此应用程序已从挂起状态重新激活。
                // 在此处恢复应用程序状态。
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            var userAccount = window.localStorage.getItem("userAccount");
            if(userAccount){
                Data.user = userAccount;
            }
            var capture = navigator.device.capture;

            var networkState = navigator.connection.type;
            if (networkState !== Connection.NONE) {
                args.setPromise(WinJS.UI.processAll().then(function () {
                    if (nav.location) {
                        nav.history.current.initialPlaceholder = true;
                        return nav.navigate(nav.location, nav.state);
                    } else {
                        WinJS.Promise.timeout(1000).then(function () {
                            if (window.localStorage["subId"]) {
                                Init.subList();//存在subId
                            } else {
                                Init.getList();
                            }
                        });
                    }
                }));
            } else {
                navigator.notification.alert("网络错误");
            }
        }
    });

    app.oncheckpoint = function (args) {
        // TODO: 即将挂起此应用程序。在此处保存
        //需要持续挂起的任何状态。如果您需要
        //在应用程序挂起之前完成异步操作
        //，请调用 args.setPromise()。
        args.setPromise(WinJS.UI.processAll().then(function () {

        }))
        app.sessionState.history = nav.history;

    };

    app.start();
})();
