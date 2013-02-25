(function () {
    "use strict";

    function createClient() {
        var client = new Windows.Web.AtomPub.AtomPubClient();
        client.bypassCacheOnRetrieve = true;
        var credential = new Windows.Security.Credentials.PasswordCredential();
        credential.userName = "494886251@qq.com";
        credential.password = "lisongyang";
        client.serverCredential = credential;
        return client;
    }

    var func = function () {
        console.log("hello ");
    };
/*
    var getSublist = function () {
        try {
            var client = createClient();
            var serviceAddressFiled = "http://easyread.163.com/common/node.atom?name=%2Froot_news";
            var resourceUri = new Windows.Foundation.Uri(serviceAddressFiled);

            client.retrieveFeedAsync(resourceUri).then(function (feed) {

                var currentFeed = feed;
                var id = currentFeed["id"];
                //console.log(currentFeed.items.length);
                //console.log(currentFeed.items[0].title.text);
                var entryArr = [];
                for (var i = 0, len = currentFeed.items.length; i < len; i++) {
                    var currentItem = currentFeed.items[i];
                    var title = currentItem.title.text;
                    var uri = currentItem.links.getAt(0).uri.absoluteCanonicalUri;
                    entryArr.push({
                        title: title,
                        uri: uri
                    });
                   // console.log(title,uri);
                }

                var myData = new WinJS.Binding.List(entryArr);
                return myData;
                //WinJS.Navigation.navigate('/pages/addSub/addSub.html', { Data: AddSub_Data });

            }).done(function (myData) {
                var serviceAddressFiled = "http://easyread.163.com/common/node.atom?name=%2Froot_recommend";
                var resourceUri = new Windows.Foundation.Uri(serviceAddressFiled);
                client.retrieveFeedAsync(resourceUri).then(function (feed) {

                    var currentFeed = feed;
                    var id = currentFeed["id"];
                    for (var i = currentFeed.items.length-1; i >=0; i--) {
                        var currentItem = currentFeed.items[i];
                        var title = currentItem.title.text;
                        var uri = currentItem.links.getAt(0).uri.absoluteCanonicalUri;
                        myData.unshift({
                            title: currentItem.title.text,
                            uri: currentItem.links.getAt(0).uri.absoluteCanonicalUri
                        });
                        console.log(title, uri);
                    }

                    WinJS.Namespace.define("AddSub_Data", {
                        items: myData
                    });
                    WinJS.Navigation.navigate('/pages/addSub/addSub.html', { Data: AddSub_Data });

                });
            });
        }
        catch (ex) {
            console.log(ex);
        } finally {

        }
    };
*/
    var getDetails = function (uri,func) {
        try {
            var client = createClient();
            var serviceAddressFiled = uri;
            console.log(uri);
            var resourceUri = new Windows.Foundation.Uri(serviceAddressFiled);

            client.retrieveFeedAsync(resourceUri).done(function (feed) {
               
                var currentFeed = feed;
                !Data.AddSub.entryArr ? Data.AddSub.entryArr = [] : 1;
                
                for (var i = 0, len = currentFeed.elementExtensions.length; i < len; i++) {
                    var title, id, content, x_stanza_cover_image_thumbnail, x_stanza_cover_image, score, describe;
                    var currentItem = currentFeed.elementExtensions[i].elementExtensions;
                    
                    title = currentItem[0].nodeValue;
                    score = currentItem[3].attributeExtensions[2].value;
                    describe = currentItem[5].attributeExtensions[2].value + "订阅 " + currentItem[5].attributeExtensions[3].value;
                    id = currentItem[1].nodeValue;
                    content = currentItem[6].nodeValue
                    x_stanza_cover_image = currentItem[7].attributeExtensions[2].value;

                    Data.AddSub.entryArr.push({
                        title: title,
                        id: id,
                        content: content,
                        coverImage: x_stanza_cover_image,
                        score: score,
                        describe: describe
                      
                    });
                    
                }
                
                if (currentFeed.nextUri) {
                    uri = currentFeed.nextUri.absoluteCanonicalUri;
                    console.log(uri);
                    getDetails(uri, func);
                } else {
                    var myData = new WinJS.Binding.List(Data.AddSub.entryArr);
                    WinJS.Namespace.define("AddSub_Detail", {
                        items: myData
                    });
                    Data.AddSub.entryArr = null;
                    func();
                }
            });
        }
        catch (ex) {
            console.log(ex);
        } finally {

        }
    };
    //SubCentre  AddSub
    WinJS.Namespace.define('SubCentre', {
        func: func,
        //getSublist: getSublist,
        getDetails: getDetails
    });



})();
