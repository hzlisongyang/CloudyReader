(function () {
    "use strict";

    window.userName = "494886251@qq.com";
    window.userPwd = "lisongyang";


    WinJS.Namespace.define("BlobSample", {
        asyncError: function (error) {
            console.log("Async failure", "sample", "error");
        }
    });

    function createClient() {
        var client = new Windows.Web.AtomPub.AtomPubClient();
        client.bypassCacheOnRetrieve = true;
        var credential = new Windows.Security.Credentials.PasswordCredential();
        credential.userName = Data.global.userEmail;
        credential.password = Data.global.pwd;
        client.serverCredential = credential;
        return client;
    }

    var client = new XMLHttpRequest();

    function downloadAndSave(url, i,flag) {
        try {
            if (url) {
                if (client) {
                    client.open("GET", url, false);
                    client.responseType = "blob";
                    client.onreadystatechange = function () {
                        if (client.readyState === 4) {
                            if (client.status !== 200) {
                                console.log("Unable to download blob - status code: " + client.status.toString(), "sample", "error");
                            } else {
                                var blob = client.response;
                                if (flag == "cover") {
                                    writeBlobToFile(blob, i);
                                } else {
                                    savaThumbnail(blob, i)
                                }
                            }
                        }
                    }
                    client.send(null);
                } else {
                    console.log("Cannot create new XMLHttpRequest object", "sample", "error");
                }
            } else {
                console.log("Enter the full url to an image", "sample", "error");
            }
        }
        catch (e) {
            console.log("Exception while using XMLHttpRequest object " + e);
        }
    }

    function savaThumbnail(blob, i) {
        var thumbnail = "thumbnail_" + i + ".jpg";
        var folder = Windows.Storage.ApplicationData.current.localFolder;
        console.log(folder.path);//输出local地址

        folder.createFileAsync(thumbnail, Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
            file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (output) {
                var input = blob.msDetachStream();
                var decoderId = Windows.Graphics.Imaging.BitmapDecoder.jpegDecoderId;
                Windows.Graphics.Imaging.BitmapDecoder.createAsync(decoderId, input).then(function (decoder) {
                    var memStream = new Windows.Storage.Streams.InMemoryRandomAccessStream();
                    var encoder;
                    Windows.Graphics.Imaging.BitmapEncoder.createForTranscodingAsync(memStream, decoder).then(function (_encoder) {
                        encoder = _encoder;
                        // Scaling occurs before flip/rotation.
                        encoder.bitmapTransform.scaledWidth = 615;
                        encoder.bitmapTransform.scaledHeight = 449;
                        
                        // Fant is a relatively high quality interpolation algorithm.
                        encoder.bitmapTransform.interpolationMode = Windows.Graphics.Imaging.BitmapInterpolationMode.fant;

                        // Generate a new thumbnail from the updated pixel data.
                        // Note: Only JPEG, TIFF and JPEG-XR images support encoding thumbnails.
                        encoder.isThumbnailGenerated = true;

                        //encoder.bitmapTransform.rotation = Windows.Graphics.Imaging.BitmapRotation.clockwise90Degrees;

                        return encoder.flushAsync();
                    }).done(function () {

                        memStream.seek(0);
                        output.seek(0);
                        output.size = 0;

                        Windows.Storage.Streams.RandomAccessStream.copyAsync(memStream, output).then(function () {
                            output.flushAsync().then(function () {
                                output.close();
                                memStream.close();
                                input.close();
                            }, BlobSample.asyncError).done(function () {

                            }, BlobSample.asyncError);
                        }, BlobSample.asyncError);
                    });

                }).done(function (inputStream) {


                });

            }, BlobSample.asyncError);
        }, BlobSample.asyncError);
    }


    function writeBlobToFile(blob, i) {
        var fileName = "cover_" + i + ".jpg";
        var folder = Windows.Storage.ApplicationData.current.localFolder;
        //console.log(folder.path);//输出local地址
        folder.createFileAsync(fileName, Windows.Storage.CreationCollisionOption.replaceExisting).then(function (file) {
            file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (output) {
                var input = blob.msDetachStream();

                var value = input;
                Windows.Storage.Streams.RandomAccessStream.copyAsync(input, output).then(function () {
                    output.flushAsync().then(function () {
                        output.close();
                        input.close();
                    }, BlobSample.asyncError).done(function () {

                    }, BlobSample.asyncError);
                }, BlobSample.asyncError);

            }, BlobSample.asyncError);
        }, BlobSample.asyncError).done(function () {

        });
    }



    var getCovers = function (callBack) {
        var user = Data.global.userEmail;
        var password = Data.global.pwd;
        var url = "http://easyread.163.com/cover/index.atom";
        WinJS.xhr({ type: "GET", url: url, user: user, password: password }).then(
            function onComplete(request) {
                if (request.status === 200) {
                    var xmlDocument = new Windows.Data.Xml.Dom.XmlDocument();
                    xmlDocument.loadXml(request.responseText);
                    var storage = window.localStorage;
                    var listArr = null;
                    storage.getItem("covers") ? listArr = JSON.parse(storage.getItem("covers")) : listArr = [];
                    var entrys = xmlDocument.getElementsByTagName("entry");
                    for (var i = entrys.length - 1, len = entrys.length; i >= 0; i--) {
                        var coverImage = entrys[i].selectNodes("link")[1].attributes.getNamedItem("href").innerText;
                        var boolean = true;
                        !storage["currentIndex"] ? storage["currentIndex"] = 0 : 1;

                        var currentIndex = parseInt(storage["currentIndex"],10);
                        for (var j = 0, l = listArr.length; j < l; j++) {
                            if (listArr[j].xCoverImageHorizontal === coverImage) {
                                boolean = false;
                                break;
                            }
                        }
                        if (boolean !== false) {
                            currentIndex + 1 <= 4 && currentIndex + 1 >= 0 ? storage["currentIndex"] = currentIndex + 1 : storage["currentIndex"] = 0;
                            downloadAndSave(coverImage, currentIndex, "cover");
                            downloadAndSave(coverImage, currentIndex, "thumbnail");                            
                            listArr.unshift({
                                key: currentIndex,
                                title: entrys[i].selectSingleNode("title").innerText,
                                id: entrys[i].selectSingleNode("id").innerText,
                                updated: entrys[i].selectSingleNode("updated").innerText,
                                content: entrys[i].selectSingleNode("content").innerText,
                                xCoverImageHorizontal: coverImage
                            });
                        }
                    }

                    listArr.length = 5;
                    storage.setItem("covers", JSON.stringify(listArr));

                    Init.State.networkState = 1;//判断网络

                    Data.covers = listArr;
                    WinJS.Promise.timeout(1000).then(function () {
                        return WinJS.Navigation.navigate('/pages/cover/cover.html');
                    });

                } else {

                    throw "net connect";
                }
            },
            function onError(request) {
                Init.State.networkState = 0;
                var storage = window.localStorage;
                if (storage["lastUpdated"]) {
                    var listArr = JSON.parse(storage.getItem("covers"));

                    Data.covers = listArr;

                    return WinJS.Navigation.navigate('/pages/cover/cover.html');
                }
                navigator.notification.alert("网络错误");
                navigator.notification.beep(2);

            }
       );
    };


    var getList = function () {
        var user = Data.global.userEmail;
        var password = Data.global.pwd;
        WinJS.xhr({ type: "GET", url: "http://easyread.163.com/recommend.atom", user: user, password: password }).done(
            function fulfilled(result) {
                if (result.status === 200) {
                    var xmlDocument = new Windows.Data.Xml.Dom.XmlDocument();
                    xmlDocument.loadXml(result.responseText);
                    var entrys = xmlDocument.getElementsByTagName("entry");
                    var listArr = [];
                    var idArr = [];

                    var localSettings = Windows.Storage.ApplicationData.current.localSettings;
                    var container = localSettings.createContainer("subId", Windows.Storage.ApplicationDataCreateDisposition.always);

                    var storage = window.localStorage;

                    for (var i = 0, len = entrys.length; i < len; i++) {
                        var backgroundImage, readType = "news", id, title, updated, subtitle;

                        id = entrys[i].selectSingleNode("id").innerText;
                        title = entrys[i].selectSingleNode("title").innerText;
                        updated = entrys[i].selectSingleNode("updated").innerText;
                        subtitle = entrys[i].selectSingleNode("content").innerText;



                        var links = entrys[i].selectNodes("link");
                        for (var j = 0 ; j < links.length; j++) {
                            var temp = links[j].attributes.getNamedItem("rel");
                            if (temp && temp.innerText == "x-stanza-cover-image") {
                                backgroundImage = links[j].attributes.getNamedItem("href").innerText;
                            }

                        }


                        for (var j = 7 ; j < entrys[i].childNodes.length - 5; j++) {
                            var nodeName = entrys[i].childNodes[j].nodeName;
                            var node = entrys[i].childNodes[j];
                            if (nodeName == "pris:entry_status") {
                                readType = node.attributes.getNamedItem("type").innerText;
                                //console.log(readType);
                            }

                        }
                        //console.log("Init ",title, "----", readType);

                        if (readType != "book") {

                            listArr.push({
                                title: title,
                                id: id,
                                updated: updated,
                                subtitle: subtitle,
                                backgroundImage: backgroundImage,
                                readType: readType
                            });
                        
                            idArr.push(id);
                        }
                    }

                    storage.setItem("subList", JSON.stringify(listArr));
                    window.localStorage["subId"] = idArr.join("+");
                   
                    var myData = new WinJS.Binding.List(listArr);
                    Data.items = myData;

                    //return WinJS.Navigation.navigate('/pages/items/items.html');
                }
            }
            , function onError(request) {
                var storage = window.localStorage;

                if (storage["lastUpdated"]) {
                    var listArr = JSON.parse(storage.getItem("subList"));
                    var myData = new WinJS.Binding.List(listArr);
                    Data.items = myData;
                    //return WinJS.Navigation.navigate('/pages/items/items.html');
                } else {

                }

            }
            );
    };

    //扩展
    Array.prototype.asyncEach = function (iterator) {
        var list = this,
            n = list.length,
            i = -1;
        var resume = function () {
            i += 1;
            if (i === n) return;
            iterator(list[i], i, resume);
        };
        resume();
    };


    var subList = function () {
        if (Init.State.networkState == 1) {
            var user = window.userName;
            var password = window.userPwd;

            var listArr = [];
            var idArr = String(window.localStorage["subId"]).split("+");

            var client = createClient();
            idArr.asyncEach(function (url, index, resume) {

                var serviceAddressFiled = "http://easyread.163.com/addsub.atom?id=" + url;
                var resourceUri = new Windows.Foundation.Uri(serviceAddressFiled);

                client.retrieveFeedAsync(resourceUri).then(function (feed) {
                    var backgroundImage, readType = "news", id, title, updated, subtitle;
                    var currentFeed = feed;

                    title = currentFeed.items[0].title.text;
                    id = currentFeed.items[0].id
                    updated = currentFeed.items[0].lastUpdatedTime;
                    subtitle = currentFeed.items[0].content.text;


                    var links = currentFeed.items[0].links;
                    for (var j = 0 ; j < links.length; j++) {
                        if (links[j].relationship == "x-stanza-cover-image") {
                            backgroundImage = links[j].uri.absoluteCanonicalUri;
                        }
                    }


                    for (var j = 0 ; j < currentFeed.items[0].elementExtensions.length; j++) {
                        var nodeName = currentFeed.items[0].elementExtensions[j].nodeName;
                        var node = currentFeed.items[0].elementExtensions[j];

                        if (nodeName == "entry_status") {

                            readType = node.attributeExtensions[0].value;
                        }
                    }

                    //console.log("Init ", title, "----", readType);

                    listArr.push({
                        title: title,
                        id: id,
                        updated: updated,
                        subtitle: subtitle,
                        backgroundImage: backgroundImage,
                        readType: readType
                    });



                }).done(function () {
                    if (index == idArr.length - 1) {
                        var storage = window.localStorage;
                        storage.setItem("subList", JSON.stringify(listArr));
                        var myData = new WinJS.Binding.List(listArr);
                        Data.items = myData;

                        //return WinJS.Navigation.navigate('/pages/items/items.html');
                    }
                    resume();
                });


            });
        } else {
            var storage = window.localStorage;
            var listArr = JSON.parse(storage.getItem("subList"));
            var myData = new WinJS.Binding.List(listArr);
            Data.items = myData;
            //return WinJS.Navigation.navigate('/pages/items/items.html');
        }
    };

    var subList2 = function () {

        var user = window.userName;
        var password = window.userPwd;
        var listArr = [];
        var idArr = String(window.localStorage["subId"]).split("+");
        //console.log(idArr.length);
        var client = createClient();
        idArr.asyncEach(function (url, index, resume) {
            var serviceAddressFiled = "http://easyread.163.com/addsub.atom?id=" + url;
            var resourceUri = new Windows.Foundation.Uri(serviceAddressFiled);
            //console.log(serviceAddressFiled);
            client.retrieveFeedAsync(resourceUri).then(function (feed) {
                var backgroundImage, readType = "news", id, title, updated, subtitle;
                var currentFeed = feed;

                title = currentFeed.items[0].title.text;
                id = currentFeed.items[0].id
                updated = currentFeed.items[0].lastUpdatedTime;
                subtitle = currentFeed.items[0].content.text;


                var links = currentFeed.items[0].links;
                for (var j = 0 ; j < links.length; j++) {

                    if (links[j].relationship == "x-stanza-cover-image") {
                        backgroundImage = links[j].uri.absoluteCanonicalUri;
                    }
                }

                for (var j = 0 ; j < currentFeed.items[0].elementExtensions.length; j++) {
                    var nodeName = currentFeed.items[0].elementExtensions[j].nodeName;
                    var node = currentFeed.items[0].elementExtensions[j];

                    if (nodeName == "entry_status") {

                        readType = node.attributeExtensions[0].value;
                    }
                }

                //console.log("Init ", title, "----", readType);

                listArr.push({
                    title: title,
                    id: id,
                    updated: updated,
                    subtitle: subtitle,
                    backgroundImage: backgroundImage,
                    readType: readType
                });



            }).done(function () {
                if (index == idArr.length - 1) {
                    var storage = window.localStorage;
                    storage.setItem("subList", JSON.stringify(listArr));
                    var myData = new WinJS.Binding.List(listArr);
                    Data.items = myData;

                }
                resume();
            });
        });
    };

    //itemsUpdate
    var itemsUpdate = function () {

        var user = window.userName;
        var password = window.userPwd;
        var listArr = [];
        var idArr = String(window.localStorage["subId"]).split("+");
        //console.log(idArr.length); 获取长度
        var client = createClient();
        idArr.asyncEach(function (url, index, resume) {
            var serviceAddressFiled = "http://easyread.163.com/addsub.atom?id=" + url;
            var resourceUri = new Windows.Foundation.Uri(serviceAddressFiled);
            //console.log(serviceAddressFiled);
            client.retrieveFeedAsync(resourceUri).then(function (feed) {
                var backgroundImage, readType = "news", id, title, updated, subtitle;
                var currentFeed = feed;

                title = currentFeed.items[0].title.text;
                id = currentFeed.items[0].id
                updated = currentFeed.items[0].lastUpdatedTime;
                subtitle = currentFeed.items[0].content.text;


                var links = currentFeed.items[0].links;
                for (var j = 0 ; j < links.length; j++) {

                    if (links[j].relationship == "x-stanza-cover-image") {
                        backgroundImage = links[j].uri.absoluteCanonicalUri;
                    }
                }

                for (var j = 0 ; j < currentFeed.items[0].elementExtensions.length; j++) {
                    var nodeName = currentFeed.items[0].elementExtensions[j].nodeName;
                    var node = currentFeed.items[0].elementExtensions[j];

                    if (nodeName == "entry_status") {
                        readType = node.attributeExtensions[0].value;
                    }
                }

                //console.log("Init ", title, "----", readType);

                listArr.push({
                    title: title,
                    id: id,
                    updated: updated,
                    subtitle: subtitle,
                    backgroundImage: backgroundImage,
                    readType: readType
                });


            }).done(function () {
                if (index == idArr.length - 1) {
                    var storage = window.localStorage;
                    storage.setItem("subList", JSON.stringify(listArr));
                    var myData = new WinJS.Binding.List(listArr);
                    Data.items = myData;

                }
                resume();
            });
        });
    };

    WinJS.Namespace.define("Init", {
        getCovers: getCovers,
        State: {
            timer: 1,
            networkState: 1
        },
        getList: getList,
        itemsUpdate: itemsUpdate,
        subList: subList,
        subList2: subList2
    });


})();