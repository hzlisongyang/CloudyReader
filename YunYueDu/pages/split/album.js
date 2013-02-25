var AlbumsTemplate = WinJS.Utilities.markSupportedForProcessing(function AlbumsTemplate(itemPromise) {
    return itemPromise.then(function (currentItem) {
        var result = document.createElement("div");



        var body = document.createElement("div");
        body.className = currentItem.data.type;
        body.style.overflow = "hidden";
        body.style.background = "url(" + currentItem.data.backgroundImage + ") "
        body.style.backgroundSize = "cover";
        result.appendChild(body);
        // Display overlay
        var info = document.createElement("div");
        info.className = "item-info";
        body.appendChild(info);
        // Display title
        var title = document.createElement("h3");
        title.className = "album-title  win-type-ellipses";
        title.innerText = currentItem.data.title;
        info.appendChild(title);


        return result;
    });
});


var groupInfo = WinJS.Utilities.markSupportedForProcessing(function groupInfo() {
    return {
        enableCellSpanning: true,
        cellWidth: 250,
        cellHeight: 250
    };
});


(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var binding = WinJS.Binding;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/pages/split/album.html", {
        // 每当用户导航至此页面时都要调用此功能。它
        // 使用应用程序的数据填充页面元素。
        ready: function (element, options) {
            document.getElementById("cmdMore").addEventListener("click", doClickMore, false);
            document.getElementById("cmdRefresh").addEventListener("click", doClickRefresh, false);


            var listView = element.querySelector(".splitslist").winControl;

            listView.itemDataSource = Data.split.dataSource;

            element.querySelector("header[role=banner] .pagetitle").textContent = options.title;  
            
            listView.itemDataSource = Data.split.dataSource;
            listView.itemTemplate = AlbumsTemplate;// element.querySelector(".itemtemplate");

            //事件
            listView.oniteminvoked = this._itemInvoked.bind(this);


           this._initializeLayout(listView, Windows.UI.ViewManagement.ApplicationView.value);

            
            listView.forceLayout();
   
        },

        unload: function () {
            //this._items.dispose();
        },
        // 此功能更新页面布局以响应 viewState 更改。
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            var listView = element.querySelector(".splitslist").winControl;
 
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
                listView.layout =new ui.GridLayout();
                listView.layout.groupInfo = groupInfo;
            }
        }

    ,
        _itemInvoked: function (args) {
            
            //console.log(Items.date.getAt(args.detail.itemIndex).id);

            var id = Data.split.getAt(args.detail.itemIndex).id;
            var url = "http://cdn.easyread.163.com/news/article.atom?uuid=" + id;
            console.log(url);
            getItem(url);

            function getItem(url) {
                var user = "494886251@qq.com";
                var password = "lisongyang";

                WinJS.xhr({ type: "GET", url: url, user: user, password: password }).done(
                    function fulfilled(result) {
                        if (result.status === 200) {
                            var xmlDocument = new Windows.Data.Xml.Dom.XmlDocument();
                            xmlDocument.loadXml(result.responseText);
                            var text = xmlDocument.getElementsByTagName("content")[0].innerText;
                            Data.htmlcontent = text;
                            WinJS.Navigation.navigate("/pages/content/content.html");
                        }
                    },
                    function onError() {
                        console.log("读取 Content 失败");

                    }
                    );
            }
        }
    });

    function doClickMore() {
        var appBar = document.querySelector("#createAppBar").winControl;
        appBar.hide();
        var user = Data.global.userEmail;
        var password = Data.global.pwd;

        var url = Data.loadMore;

        WinJS.xhr({ type: "GET", url: url, user: user, password: password }).done(
            function fulfilled(result) {
                if (result.status === 200) {
                    var xmlDocument = new Windows.Data.Xml.Dom.XmlDocument();
                    xmlDocument.loadXml(result.responseText);

                    //解析entry
                    var entrys = xmlDocument.getElementsByTagName("entry");
                    var splitArr = [];
                    for (var i = 0, len = entrys.length; i < entrys.length; i++) {
                        var updateTime = entrys[i].childNodes.getAt(3).innerText;
                        var updated = updateTime.substring(5, 10) + " " + updateTime.substring(11, 16);
                        var type = "item-album";

                        Data.split.push({
                            title: entrys[i].childNodes.getAt(0).innerText,
                            author: entrys[i].childNodes.getAt(1).innerText,
                            id: entrys[i].childNodes.getAt(2).innerText,
                            updated: updated,
                            content: entrys[i].childNodes.getAt(6).innerText,
                            backgroundImage: entrys[i].childNodes.length == 9 ? entrys[i].childNodes.getAt(7).attributes.getNamedItem("href").innerText : "",
                            displayType: entrys[i].childNodes.length == 9 ? "block" : "none",
                            type: type
                        });
                    }

                    var links = xmlDocument.getElementsByTagName("link");
                    var next = links[links.length - 1].attributes.getNamedItem('href').innerText;

                    Data.loadMore = "http://cdn.easyread.163.com" + next;

                    var listView = document.querySelector(".splitslist").winControl;
                    listView.loadMorePages();
                }
            },
            function onError(request) {
                if (storage.getItem(id)) {

                    var splitArr = JSON.parse(storage.getItem(id));
                    console.log(splitArr.length);
                    var myData = new WinJS.Binding.List(splitArr);
                    Data.split = myData;
                    //WinJS.Navigation.navigate("/pages/split/split.html", { title: itemTitle });

                } else {

                    var splitArr = [];
                    var myData = new WinJS.Binding.List(splitArr);
                    Data.split = myData;
                    //WinJS.Navigation.navigate("/pages/split/split.html", { title: itemTitle });
                }
            }
        );
    }
    function doClickRefresh() {
        var appBar = document.querySelector("#createAppBar").winControl;
        appBar.hide();
        var user = Data.global.userEmail;
        var password = Data.global.pwd;

        var url = Data.loadMore;

        WinJS.xhr({ type: "GET", url: url, user: user, password: password }).done(
            function fulfilled(result) {
                if (result.status === 200) {
                    var xmlDocument = new Windows.Data.Xml.Dom.XmlDocument();
                    xmlDocument.loadXml(result.responseText);

                    //解析entry
                    var entrys = xmlDocument.getElementsByTagName("entry");
                    var splitArr = [];
                    for (var i = 0, len = entrys.length; i < entrys.length; i++) {
                        var updateTime = entrys[i].childNodes.getAt(3).innerText;
                        var updated = updateTime.substring(5, 10) + " " + updateTime.substring(11, 16);
                        var type = "item-album";

                        Data.split.push({
                            title: entrys[i].childNodes.getAt(0).innerText,
                            author: entrys[i].childNodes.getAt(1).innerText,
                            id: entrys[i].childNodes.getAt(2).innerText,
                            updated: updated,
                            content: entrys[i].childNodes.getAt(6).innerText,
                            backgroundImage: entrys[i].childNodes.length == 9 ? entrys[i].childNodes.getAt(7).attributes.getNamedItem("href").innerText : "",
                            displayType: entrys[i].childNodes.length == 9 ? "block" : "none",
                            type: type
                        });
                    }

                    var links = xmlDocument.getElementsByTagName("link");
                    var next = links[links.length - 1].attributes.getNamedItem('href').innerText;

                    Data.loadMore = "http://cdn.easyread.163.com" + next;

                    var listView = document.querySelector(".splitslist").winControl;
                    listView.loadMorePages();
                }
            },
            function onError(request) {
                if (storage.getItem(id)) {

                    var splitArr = JSON.parse(storage.getItem(id));
                    console.log(splitArr.length);
                    var myData = new WinJS.Binding.List(splitArr);
                    Data.split = myData;
                    //WinJS.Navigation.navigate("/pages/split/split.html", { title: itemTitle });

                } else {

                    var splitArr = [];
                    var myData = new WinJS.Binding.List(splitArr);
                    Data.split = myData;
                    //WinJS.Navigation.navigate("/pages/split/split.html", { title: itemTitle });
                }
            }
        );
    }

})();
