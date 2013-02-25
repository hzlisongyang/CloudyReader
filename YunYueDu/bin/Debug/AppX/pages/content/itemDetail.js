(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/content/itemDetail.html", {
        // 每当用户导航至此页面时都要调用此功能。它
        // 使用应用程序的数据填充页面元素。
        ready: function (element, options) {
            // var listView = element.querySelector(".itemslist") .winControl;
            var content = element.querySelector(".item-content");
            //console.log(content.textContent);
            var htmlContent = document.createElement("div");

            htmlContent.innerHTML = toStaticHTML(Data.htmlcontent);
            console.log(htmlContent.innerHTML);

            content.appendChild(htmlContent);

            if (element.querySelectorAll(".img-c a")) {
                var imgObjects = element.querySelectorAll(".img-c a");
                for (var i = 0; i < imgObjects.length; i++) {
                    imgObjects[i].addEventListener('click', ImgHandler, false);
                }
            }
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
