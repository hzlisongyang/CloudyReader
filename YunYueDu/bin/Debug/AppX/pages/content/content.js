/// <reference path="contextControl.html" />
/// <reference path="contextControl.html" />
(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var binding = WinJS.Binding;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/pages/content/content.html", {
        /// <field type="WinJS.Binding.List" />

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

    WinJS.Navigation.navigate("/pages/content/flipView.html", {seq:seq});

}
