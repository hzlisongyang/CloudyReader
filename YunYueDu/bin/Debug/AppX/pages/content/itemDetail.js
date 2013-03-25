(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/content/itemDetail.html", {

        // 每当用户导航至此页面时都要调用此功能。它
        // 使用应用程序的数据填充页面元素。
        ready: function (element, options) {
            // var listView = element.querySelector(".itemslist") .winControl;
            var content = element.querySelector(".article");
            //console.log(content.textContent);
            var htmlContent = document.createElement("div");

            htmlContent.innerHTML = toStaticHTML(Data.htmlcontent);
            console.log(htmlContent.innerHTML);

            content.appendChild(htmlContent);
            
//重置图片
            var eles = htmlContent.querySelectorAll(".img-2 img");

            for (var i = 0, len = eles.length;i<len;i++){
                eles[i].style.width = "550px";
            }
            if (element.querySelectorAll(".img .img-2 a")) {
                var imgObjects = element.querySelectorAll(".img .img-2 a");
                for (var i = 0; i < imgObjects.length; i++) {
                    imgObjects[i].addEventListener('click', ImgHandler, false);
                }
            }




            var Page = {
                defaultAnimateDelay:200
            };
            //左翻一页
            Page.flipLeft = function (animateDelay) {
                var article = document.querySelector(".article");          
                if (article.style.transform != null) {
                    var maxWidth = article.scrollWidth;
                    var scrollWidth = article.style.transform.match(/translate3d\((-?[1-9]\d+)px/);
                    scrollWidth = scrollWidth !== null ? parseInt(scrollWidth[1], 10) : 0;

                    if (0 < scrollWidth + 630) {
                        scrollWidth = 0;
                    } else {
                        scrollWidth += 630;
                    }
                    article.style.transitionDuration = animateDelay === undefined ? defaultAnimateDelay + "ms" : animateDelay + "ms";
                    article.style.transform = "translate3d(" + (scrollWidth) + "px,0,0)";
                }

                setTimeout(function () {
                    //Page.scrollAble = true;
                }, animateDelay === undefined ? defaultAnimateDelay : animateDelay);

            }


            //右翻一页
            Page.flipRight = function (animateDelay) {

                var article = document.querySelector(".article");
                if (article.style.transform != null) {
                    //console.log("msie");
                    var maxWidth = article.scrollWidth;
                    
                    var scrollWidth = article.style.transform.match(/translate3d\((-?[1-9]\d+)px/);
                    scrollWidth = scrollWidth !== null ? parseInt(scrollWidth[1], 10) : 0;
                    
                    // article.style.transitionDuration = animateDelay === undefined ? defaultAnimateDelay + "ms" : animateDelay + "ms";
                    if (maxWidth > Math.abs(scrollWidth-630)) {
                        scrollWidth -= 630;
                    }
                    console.log(maxWidth,'------',scrollWidth);
                    article.style.transform = "translate3d(" + (scrollWidth) + "px,0,0)";
                }
                setTimeout(function () {
                    //console.log(currentPageNumber);
                    //Page.scrollAble = true;
                    //Page.updateRatio(currentPageNumber - 1);

                }, animateDelay === undefined ? defaultAnimateDelay : animateDelay);

            }


            document.body.addEventListener("keydown", function (e) {
                var keycode = e.keyCode;
                switch (keycode) {
                    case 37:
                        Page.flipLeft(200);
                        break;
                    case 39:
                        Page.flipRight(200);
                        break;
                }
            }, false);

            //-ms-transform: translate3d(0, 0, 0);
 //           var imgs = document.querySelectorAll(".img-2");
   //         for (var i = 0, len = imgs.length; i < len; i++) {
     ///           imgs[i].style.textAlign = "center";
        //        var img = getComputedStyle(imgs[i]);
          //      console.log(img.width);
            //}
        }
    });
})();


function ImgHandler() {
    String.prototype.getQueryString = function (para) {
        var reg = new RegExp("(^|&|\\?)" + para + "=([^&]*)(&|$)"), r;
        if (r = this.match(reg)) return unescape(r[2]); return null;
    };
    var seq = this.href.getQueryString("seq");

    WinJS.Navigation.navigate("/pages/content/flipView.html", { seq: seq });

}
