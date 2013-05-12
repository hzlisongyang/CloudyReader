var NewsTemplate = WinJS.Utilities.markSupportedForProcessing(function NewsTemplate(itemPromise) {
    return itemPromise.then(function (currentItem) {
        var result = document.createElement("div");

        // ListView item

        console.log(currentItem.data.type);

        var body = document.createElement("div");
        body.className = "item";
        body.style.overflow = "hidden";
        result.appendChild(body);
        // Display info
        if (currentItem.data.type == "normal") {
            var info = document.createElement("div");
            info.className = "item-info";
            body.appendChild(info);
            // Display title
            var title = document.createElement("h3");
            title.className = "item-title";
            title.innerText = currentItem.data.title;
            info.appendChild(title);

            // Display updated
            var updated = document.createElement("h4");
            updated.className = "item-updated";
            updated.innerText = currentItem.data.updated;
            info.appendChild(updated);

            // Display content
            var content = document.createElement("div");
            content.className = "item-content";
            body.appendChild(content);

            // Display subtitle

            if ("block" == currentItem.data.displayType) {
                var subtitle = document.createElement("p");
                subtitle.className = "item-subtitle win-type-ellipses";
                subtitle.style.width = "125px";
                subtitle.innerText = currentItem.data.content;
                content.appendChild(subtitle);
            } else {
                var subtitle = document.createElement("p");
                subtitle.className = "item-subtitle win-type-ellipses";
                subtitle.innerText = currentItem.data.content;
                content.appendChild(subtitle);
            }
            


            // Display updated
            var bg = document.createElement("div");
            bg.className = "bg";
            bg.style.display = currentItem.data.displayType;
            bg.style.backgroundImage = "url(" + currentItem.data.backgroundImage + ")";
            content.appendChild(bg);

        } else {

            body.style.backgroundImage = "url(" + currentItem.data.backgroundImage + ")";
            body.style.backgroundPosition = "50% 10%";
            body.style.backgroundSize = "cover";


            var overlay = document.createElement("div");
            overlay.className = "item-overlay";
            body.appendChild(overlay);

            var title = document.createElement("h3");
            title.className = "item-title ";
            title.innerText = currentItem.data.title;
            overlay.appendChild(title);
          
            
            var updated = document.createElement("h4");
            updated.className = "item-updated";
            updated.innerText = currentItem.data.updated;
            overlay.appendChild(updated);
        }

        return result;
    });
});

(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var binding = WinJS.Binding;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/pages/split/news.html", {

        /// <field type="WinJS.Binding.List" />

        // 每当用户导航至此页面时都要调用此功能。它
        // 使用应用程序的数据填充页面元素。
        ready: function (element, options) {
            document.getElementById("cmdMore").addEventListener("click", doClickMore, false);
            document.getElementById("cmdRefresh").addEventListener("click", doClickRefresh, false);
            document.getElementById("cmdShare").addEventListener("click", doShare, false);
            var listView = element.querySelector(".itemslist").winControl;

            // 存储有关此页将显示的组和选择内容的
            this._group = (options && options.groupKey);

            element.querySelector("header[role=banner] .pagetitle").textContent = options.title;  //类目标题

            //  ListView 数据绑定

            listView.itemDataSource = Data.split.dataSource;
            listView.itemTemplate = NewsTemplate;// element.querySelector(".itemtemplate");

            //事件
            listView.oniteminvoked = this._itemInvoked.bind(this);
            //listView.layout = new ui.ListLayout();
            listView.layout = new ui.GridLayout();

            this._initializeLayout(listView, Windows.UI.ViewManagement.ApplicationView.value);



        },

        unload: function () {
            //this._items.dispose();
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
        }

    ,
        _itemInvoked: function (args) {

            var id = Data.split.getAt(args.detail.itemIndex).id;
            var url = "http://cdn.easyread.163.com/news/article.atom?uuid=" + id;
            console.log(url,"新闻类");
            getItem(url);

            function getItem(url) {
                var user = Data.global.userEmail;
                var password = Data.global.pwd;

                WinJS.xhr({ type: "GET", url: url, user: user, password: password }).done(
                    function fulfilled(result) {
                        if (result.status === 200) {
                            var xmlDocument = new Windows.Data.Xml.Dom.XmlDocument();
                            xmlDocument.loadXml(result.responseText);
                            //repleaceAll
                            String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
                                if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
                                    return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
                                } else {
                                    return this.replace(reallyDo, replaceWith);
                                }
                            }                     
                            //内容
                            var content = xmlDocument.getElementsByTagName("content")[0].innerText;
                            content = content.replaceAll("web:getimageclick;", "#&");
                            Data.htmlcontent = content;


                            var imgArr = [];//init
                            var imgs = xmlDocument.getElementsByTagName("pris:image_category");
                            for (var i = 0; i < imgs.length; i++) {
                                var uri = imgs[i].attributes.getNamedItem('a_href').nodeValue;
                                imgArr.push({
                                    picture: uri
                                });
                                console.log(uri);
                            }
                            Data.Content.imgList = new WinJS.Binding.List(imgArr);

                            //WinJS.Navigation.navigate("/pages/content/content.html");
                            WinJS.Navigation.navigate("/pages/content/itemDetail.html");
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
                    var xmlDocument, links, next, listView;
                    xmlDocument = new Windows.Data.Xml.Dom.XmlDocument();
                    xmlDocument.loadXml(result.responseText);
                    //解析entry
                    var entrys = xmlDocument.getElementsByTagName("entry");
                    var splitArr = [];

                    for (var i = 0, len = entrys.length; i < entrys.length; i++) {
                        var updateTime = entrys[i].childNodes.getAt(3).innerText;
                        var updated = updateTime.substring(5, 10) + " " + updateTime.substring(11, 16);
                        var content = entrys[i].childNodes.getAt(6).innerText;
                        var backgroundImage = entrys[i].childNodes.length == 9 ? entrys[i].childNodes.getAt(7).attributes.getNamedItem("href").innerText : "";
                        var type = null;
                        

                        if (Data.global.currentReadType == 'album') {
                            type = "item-album";
                            
                        } else {
                            content == "" ? type = "onlyPic" : type = "normal";
                        }

                        if (i == 0) {
                            Data.global.currentReadType == 'album' ? type = "item-album-large" : true;
                            Data.lastUpdated = updateTime;
                        }

                        Data.split.push({
                            title: entrys[i].childNodes.getAt(0).innerText,
                            author: entrys[i].childNodes.getAt(1).innerText,
                            id: entrys[i].childNodes.getAt(2).innerText,
                            updated: updated,
                            content: content,
                            backgroundImage: backgroundImage,
                            displayType: entrys[i].childNodes.length == 9 ? "block" : "none",
                            type: type
                        });
                    }

                    links = xmlDocument.getElementsByTagName("link");
                    next = links[links.length - 1].attributes.getNamedItem('href').innerText;
                    Data.loadMore = "http://cdn.easyread.163.com" + next;
                    listView = document.querySelector(".itemslist").winControl;
                    listView.loadMorePages();
                }
            },
            function onError(request) {
                if (storage.getItem(id)) {
                    var splitArr = JSON.parse(storage.getItem(id));
                    console.log(splitArr.length);
                    var myData = new WinJS.Binding.List(splitArr);
                    Data.split = myData;
                    WinJS.Navigation.navigate("/pages/split/news.html", { title: itemTitle });

                } else {

                    var splitArr = [];
                    var myData = new WinJS.Binding.List(splitArr);
                    Data.split = myData;
                    WinJS.Navigation.navigate("/pages/split/news.html", { title: itemTitle });
                }


            }
        );
    }
    function doClickRefresh() {
        var appBar = document.querySelector("#createAppBar").winControl;
        appBar.hide();

        var user = Data.global.userEmail;
        var password = Data.global.pwd;
        var lastUpdated = Data.lastUpdated;
        var id = Data.global.currentId;
        var url = "http://easyread.163.com/news/source/index.atom?id=" +id + "&rand=" +Date.now();
        console.log(url);

        WinJS.xhr({ type: "GET", url: url, user: user, password: password }).done(
            function fulfilled(result) {
                if (result.status === 200) {
                    var xmlDocument = new Windows.Data.Xml.Dom.XmlDocument();
                    xmlDocument.loadXml(result.responseText);

                    //解析entry
                    var entrys = xmlDocument.getElementsByTagName("entry");
                    var splitArr = [];
                    for (var i = entrys.length - 1; i >= 0; i--) {
                        var updateTime = entrys[i].childNodes.getAt(3).innerText;
                        var updated = updateTime.substring(5, 10) + " " + updateTime.substring(11, 16);
                        var type =null;
                        var content = entrys[i].childNodes.getAt(6).innerText;
                        var backgroundImage = entrys[i].childNodes.length == 9 ? entrys[i].childNodes.getAt(7).attributes.getNamedItem("href").innerText : "";

                        if (Data.global.currentReadType == 'album') {
                            type = "item-album";
                        } else {
                            content == "" ? type = "onlyPic" : type = "normal";
                        }

                        if (i == 0) {
                            Data.global.currentReadType == 'album' ? type = "item-album-large" : true;
                            Data.lastUpdated = updateTime;
                        }

                        if (lastUpdated < updateTime) {

                            Data.split.unshift({
                                title: entrys[i].childNodes.getAt(0).innerText,
                                author: entrys[i].childNodes.getAt(1).innerText,
                                id: entrys[i].childNodes.getAt(2).innerText,
                                updated: updated,
                                content: content,
                                backgroundImage: backgroundImage,
                                displayType: entrys[i].childNodes.length == 9 ? "block" : "none",
                                type: type
                            });
                        }
                    }

                    var listView = document.querySelector(".itemslist").winControl;
                    listView.itemDataSource = Data.split.dataSource;
                    //listView.itemTemplate = document.querySelector(".itemtemplate");


                }
            },
            function onError(request) {
                if (storage.getItem(id)) {

                    var splitArr = JSON.parse(storage.getItem(id));
                    console.log(splitArr.length);
                    var myData = new WinJS.Binding.List(splitArr);
                    Data.split = myData;
                    WinJS.Navigation.navigate("/pages/split/split.html", { title: itemTitle });

                } else {

                    var splitArr = [];
                    var myData = new WinJS.Binding.List(splitArr);
                    Data.split = myData;
                    WinJS.Navigation.navigate("/pages/split/split.html", { title: itemTitle });
                }


            }
        );
    }

    function doShare() {
        var id = Data.global.currentId;
        var loc = "";
        navigator.geolocation.getCurrentPosition(function (position) {
            loc += Math.random(position.coords.latitude) + Math.round(position.coords.longitude);
        }, function () {
            console.log("geolocation error");
        });
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText=='true') {
                navigator.notification.alert("分享成功");
            }
        }
        xhr.open('get','http://www.paiege.duapp.com?'+'loc&'+loc+'id&'+id,flase);
        xhr.send(null);
    }
})();
