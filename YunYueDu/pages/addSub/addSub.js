﻿


(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;
    var nav = WinJS.Navigation;//导航事件

    ui.Pages.define("/pages/addSub/addSub.html", {

        ready: function (element, options) {
            
           var listView = element.querySelector(".itemslist").winControl;
           listView.itemDataSource =Data.AddSub.subList.dataSource;
           listView.layout = new ui.ListLayout();
           listView.itemTemplate = element.querySelector(".itemtemplate");
           listView.oniteminvoked = this._itemInvoked.bind(this);

           var uri = Data.AddSub.subList.getAt(0).uri;
           SubCentre.getDetails(uri, itemInvokedHandler);
           document.addEventListener("backbutton", function () {

               if (document.querySelector("#sub_button").textContent == "取消订阅") {

                   idArr.splice(arrIndex, 1);
                   window.localStorage["subId"] = idArr.join("+");
                   document.querySelector("#sub_button").textContent = "添加订阅"
                   document.querySelector("#sub_button").style.backgroundColor = "red";
                   Init.itemsUpdate();
                   arrIndex = idArr.length - 1;
               } else {

                   window.localStorage["subId"] += "+" + id;
                   idArr = String(window.localStorage["subId"]).split("+");
                   arrIndex = idArr.length - 1;

                   document.querySelector("#sub_button").style.backgroundColor = "#ccc";
                   document.querySelector("#sub_button").textContent = "取消订阅";
                   Init.itemsUpdate();

               }
           }, false);
        },

        // 此功能更新页面布局以响应 viewState 更改。
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            var listView = element.querySelector(".itemslist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    }
                    listView.addEventListener("contentanimating", handler, false);
                    var firstVisible = listView.indexOfFirstVisible;
                    this._initializeLayout(listView, viewState);
                    if (firstVisible >= 0 && listView.itemDataSource.list.length > 0) {
                        listView.indexOfFirstVisible = firstVisible;
                    }
                }
            }
        },

        // 此函数将使用新布局更新 ListView
        _initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />

            if (viewState === appViewState.snapped) {
                listView.layout = new ui.ListLayout();
            } else {
                listView.layout = new ui.GridLayout();
            }
        },

        _itemInvoked: function (args) {

            var uri = Data.AddSub.subList.getAt(args.detail.itemIndex).uri;

            console.log(uri);
            SubCentre.getDetails(uri, itemInvokedHandler);

        }

    });

    function itemInvokedHandler(){
        try{
            var detailList = document.querySelector(".detaillist").winControl;
        } catch (e) {
            return !1;
        }
        detailList.itemDataSource = AddSub_Detail.items.dataSource;
        detailList.itemTemplate = document.querySelector(".detailtemplate");
        detailList.layout = new ui.ListLayout();
  
        var scrollPosition = detailList.scrollPosition;


        document.querySelector("#introduce").style.opacity = 0;

        detailList.oniteminvoked = function (args) {
            var uri = AddSub_Detail.items.getAt(args.detail.itemIndex).coverImage;
            var content = AddSub_Detail.items.getAt(args.detail.itemIndex).content;
            var id = AddSub_Detail.items.getAt(args.detail.itemIndex).id;
            var introduce = document.querySelector("#introduce");

            WinJS.UI.Animation.enterContent(introduce, null);
            //console.log(content);
            var title = AddSub_Detail.items.getAt(args.detail.itemIndex).title;
            var idArr = String(window.localStorage["subId"]).split("+");

            document.querySelector("#sub_button").style.backgroundColor = "red";
            document.querySelector("#sub_button").textContent = "添加订阅";
            
            var arrIndex,len=idArr.length;
            for (var i = 0; i < len; i++) {
                if (idArr[i] == id) {
                    document.querySelector("#sub_button").style.backgroundColor = "#ccc";
                    document.querySelector("#sub_button").textContent = "取消订阅";
                    arrIndex = i;
                    break;
                }
            }
            document.querySelector("#sub_pic").style.backgroundImage = "url('" + uri + "')";
            document.querySelector("#sub_title").textContent = title;
            document.querySelector("#sub_content").textContent = content;
            console.log("进入后", arrIndex);

            document.querySelector("#sub_button").onclick = function () {
                if (document.querySelector("#sub_button").textContent == "取消订阅") {
                        if (Data.user !== null) {
                            var account = Data.user;
                            var xhr = new XMLHttpRequest();
                            var subId = idArr[arrIndex];
                            var url = "http://paiege.duapp.com/save.php?rss=" + subId + "&account=" + account + "&type=cancel" + "&date=" + Date.now();
                            xhr.open("get", url, false);
                            xhr.send(null);
                            console.log(url);
                        }
                        idArr.splice(arrIndex, 1);
                        window.localStorage["subId"] = idArr.join("+");
                        document.querySelector("#sub_button").textContent = "添加订阅"
                        document.querySelector("#sub_button").style.backgroundColor = "red";

                        Init.itemsUpdate();
                        
                        arrIndex = idArr.length - 1;     
                        
                } else {
                    if (Data.user !== null) {
                        var account = Data.user;
                        var xhr = new XMLHttpRequest();
                        var subId = id;
                        var url = "http://paiege.duapp.com/save.php?rss=" + subId + "&account=" + account + "&type=add" + "&date=" + Date.now();
                        xhr.open("get", url, false);
                        xhr.send(null);
                        console.log(url);
                    }
                    window.localStorage["subId"] += "+" + id;
                    idArr = String(window.localStorage["subId"]).split("+");
                    arrIndex = idArr.length - 1;

                    document.querySelector("#sub_button").style.backgroundColor = "#ccc";
                    document.querySelector("#sub_button").textContent = "取消订阅";
                    Init.itemsUpdate();

                }

            };

        };
    }

})();
