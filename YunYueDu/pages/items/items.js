var ItemsTemplate = WinJS.Utilities.markSupportedForProcessing(function ItemsTemplate(itemPromise) {
    return itemPromise.then(function (currentItem) {
        var result = document.createElement("div");

        //console.log(currentItem.data.type);

        var body = document.createElement("div");
        body.className = "item";
        body.style.overflow = "hidden";
        body.style.backgroundImage="url("+currentItem.data.backgroundImage+")"
        result.appendChild(body);
        // Display overlay
            var overlay = document.createElement("div");
            overlay.className = "item-overlay";
            body.appendChild(overlay);
            // Display title
            var title = document.createElement("h4");
            title.className = "item-title win-type-ellipsis";
            title.innerText = currentItem.data.title;
            overlay.appendChild(title);
            // Display subtitle
            var subtitle = document.createElement("h6");
            subtitle.className = "item-subtitle win-type-ellipsis";
            subtitle.innerText = currentItem.data.subtitle;
            overlay.appendChild(subtitle);

            return result;
    });
});



(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;
    var nav = WinJS.Navigation;//导航事件

    ui.Pages.define("/pages/items/items.html", {
        // 每当用户导航至此页面时都要调用此功能。它
        // 使用应用程序的数据填充页面元素。
        init: function (element, options) {

        },
        ready: function (element, options) {
            document.getElementById("cmdAdd").addEventListener("click", doClickAdd, false);
            document.getElementById("cmdRefresh").addEventListener("click", doClickRefresh, false);
            document.getElementById("cmdCover").addEventListener("click", backCover, false);
            document.getElementById("cmdRegister").addEventListener("click", doRegister, false);
            document.getElementById("cmdLogin").addEventListener("click", doLogin, false);
            document.getElementById("close").addEventListener("click", doClose, false);
            document.getElementById("login").addEventListener("click", login, false);
            document.getElementById("cmdGet").addEventListener("click", getShare, false);
            
                var listView = element.querySelector(".itemslist").winControl;
                listView.itemDataSource = Data.items.dataSource;
                listView.itemTemplate = ItemsTemplate;// element.querySelector(".itemtemplate");
                listView.oniteminvoked = this._itemInvoked.bind(this);
                //listView.forceLayout();
                this._initializeLayout(listView, Windows.UI.ViewManagement.ApplicationView.value);
            
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
            var storage = window.localStorage;

            var currItem = Data.items.getAt(args.detail.itemIndex);
            Data.global.currentReadType = currItem.readType;
            var id = currItem.id;
            Data.global.currentId = id;
            var url = "http://easyread.163.com/news/source/index.atom?id=" + id + "&rand=" + Date.now();
            var itemTitle = currItem.title;
            
            console.log(url);

            currItem.readType!="book" &&  getItem(url);//判断是不是书
            
            function getItem(url) {
                var user = Data.global.userEmail;
                var password = Data.global.pwd;

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
                                var type = null;
                                var content = entrys[i].childNodes.getAt(6).innerText;
                                var backgroundImage = "";


                                for (var j = 0 ; j < entrys[i].childNodes.length; j++) {
                                    var nodeName = entrys[i].childNodes[j].nodeName;
                                    var node = entrys[i].childNodes[j];
                                    if (nodeName == "pris:image_thumbnail") {
                                        backgroundImage = node.attributes.getNamedItem("href").innerText;
                                    }

                                }

                                console.log(currItem.readType, "background",backgroundImage);

                                //console.log("进入了",Data.global.currentReadType);
                                if (Data.global.currentReadType == 'album') {
                                    type = "item-album";
                                    
                                } else {
                                    content == "" ? type = "onlyPic" : type = "normal";
                                }

                                if (i == 0) {
                                    Data.global.currentReadType == 'album' ? type = "item-album-large" : true;
                                    Data.lastUpdated = updateTime;
                                }

                                

                                splitArr.push({
                                    title : entrys[i].childNodes.getAt(0).innerText,
                                    author : entrys[i].childNodes.getAt(1).innerText,
                                    id : entrys[i].childNodes.getAt(2).innerText,
                                    updated: updated,
                                    content: content,
                                    backgroundImage: backgroundImage,
                                    displayType: backgroundImage.length>2? "block" : "none",
                                    type:type
                                });
                            }

                            var links = xmlDocument.getElementsByTagName("link");
                            var next = links[links.length - 1].attributes.getNamedItem('href').innerText;
 
                            Data.loadMore = "http://cdn.easyread.163.com" + next;

                            id && storage.setItem(id, JSON.stringify(splitArr));
                            var myData = new WinJS.Binding.List(splitArr);

                            Data.split = myData;

                            if (currItem.readType == "album" || currItem.readType == "istyle") {
                                WinJS.Navigation.navigate("/pages/split/album.html", { title: itemTitle });
                            } else {
                                WinJS.Navigation.navigate("/pages/split/news.html", { title: itemTitle });
                            }
                        }
                    },
                    function onError(request) {
                        if (storage.getItem(id)) {

                            var splitArr = JSON.parse(storage.getItem(id));
                            //console.log(splitArr.length);
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


        }
    });

    /*添加订阅*/
    function doClickAdd() {
        var appBar = document.querySelector("#createAppBar").winControl;
        appBar.hide();

        WinJS.Navigation.navigate('/pages/addSub/addSub.html');
        //SubCentre.getSublist();
    }
    function doClickRefresh() {
        var appBar = document.querySelector("#createAppBar").winControl;
        appBar.hide();
        if (window.localStorage["subId"]) {

            Init.itemsUpdate();
            var listView = document.querySelector(".itemslist").winControl;
            listView.loadMorePages();
            listView.recalculateItemPosition();
            listView.itemDataSource = Data.items.dataSource;
            //listView.itemTemplate = document.querySelector(".itemtemplate");
        } else {

            Init.itemsUpdate();
            var listView = document.querySelector(".itemslist").winControl;
            listView.itemDataSource = Data.items.dataSource;
            listView.itemTemplate = document.querySelector(".itemtemplate");
        }
        
        
    }

    function backCover() {
        WinJS.Navigation.navigate('/pages/cover/cover.html');
    }

    function doRegister() {
        var appBar = document.querySelector("#createAppBar").winControl;
        appBar.hide();

        window.open('http://paiege.duapp.com/register.html', '_blank', 'location=yes');
        //SubCentre.getSublist();
    }
    function doLogin() {
        var appBar = document.querySelector("#createAppBar").winControl;
        appBar.hide();

        document.getElementById("loginForm").style.display = "block";
        //SubCentre.getSublist();
    }
    function doClose() {
        document.getElementById("loginForm").style.display = "none";

        //SubCentre.getSublist();
    }
    function login() {
        var account = document.getElementById("account").value;
        var password = document.getElementById("password").value;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if(xhr.readyState ==4 && xhr.status == 200){
                console.log(xhr.responseText);
                var value = xhr.responseText;
                var subId = window.localStorage["subId"];
                if (value!="no") {
                    WinJS.UI.processAll().then(function () {
                        document.getElementById("loginForm").style.display = "none";
                        console.log(window.localStorage["subId"].length);
                    }).done(function () {
                        navigator.notification.alert("登录成功");
                    });
                } else {
                   
                    navigator.notification.alert("账号或密码错误");
                }
            }
        }
        var url = "http://paiege.duapp.com/mlogin.php?account=" + account + "&password=" + password;
        navigator.no
        xhr.open("GET",url,false);
        xhr.send(null);
        getCeolocation();
    }

    function getShare() {
        var loc = "";
        navigator.geolocation.getCurrentPosition(function (position) {
            loc = position.coords.latitude + position.coords.longitude;
        }, function () {
            console.log("haha");
        });
       // var a =navigator.notification.confirm("哈哈哈哈");
        navigator.notification.alert("成功更新"+2+"条记录");
    }
})();
