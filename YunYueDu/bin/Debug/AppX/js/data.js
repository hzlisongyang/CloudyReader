(function () {
    "use strict";

    
    var subArray = [
        { title: "发现", uri: "http://easyread.163.com/common/node.atom?uuid=8abfc27f-e8b0-4993-b54e-7c6bb68fd0eb&n=default", icon: "/images/icon/faxian.png" },
        { title: "热门", uri: "http://easyread.163.com/common/node.atom?uuid=ba356c03-eff5-4357-b5bd-27ada2b2a4c8&n=default", icon: "/images/icon/remen.png" },
        { title: "自主订阅", uri: "http://easyread.163.com/common/node.atom?uuid=60829229-8733-4514-b4eb-8ca8be200213&n=default", icon: "/images/icon/zizhu.png" },
        { title: "报刊", uri: "http://easyread.163.com/common/node.atom?uuid=60829229-8733-4514-b4eb-8ca8be200213&n=default", icon: "/images/icon/baokan.png" },
        { title: "视觉", uri: "http://easyread.163.com/common/node.atom?uuid=cac3f406-5d87-45cf-9daa-a8a1bd64a86d&n=default", icon: "/images/icon/shijue.png" },
        { title: "新闻", uri: "http://easyread.163.com/common/node.atom?uuid=60174b63-bc1d-49ba-bcf8-7856b28e15f0&n=default", icon: "/images/icon/xinwen.png" },
        { title: "科技", uri: "http://easyread.163.com/common/node.atom?uuid=214482e8-437a-4b6d-aa8b-c0660f4da4a8&n=default", icon: "/images/icon/keji.png" },
        { title: "生活", uri: "http://easyread.163.com/common/node.atom?uuid=f1f39fbb-93e0-4cf9-a847-4cc9f7b77ef3&n=default", icon: "/images/icon/shenghuo.png" },
        { title: "娱乐", uri: "http://easyread.163.com/common/node.atom?uuid=284db4de-e5a4-4024-b9ba-e3f0d192775f&n=default", icon: "/images/icon/yule.png" },
        { title: "时尚", uri: "http://easyread.163.com/common/node.atom?uuid=4164eea4-6d09-47df-9ecc-d7197e63193c&n=default", icon: "/images/icon/shishang.png" },
        { title: "财经", uri: "http://easyread.163.com/common/node.atom?uuid=ee1083a0-9e54-4e04-9056-93bdb1b551e9&n=default", icon: "/images/icon/caijin.png" },
        { title: "人文", uri: "http://easyread.163.com/common/node.atom?uuid=868d1f63-6084-4e25-9769-d27f8da12c16&n=default", icon: "/images/icon/renwen.png" },
        { title: "游戏", uri: "http://easyread.163.com/common/node.atom?uuid=2d246f78-5366-4596-bb5d-3166f8c2cc55&n=default", icon: "/images/icon/youxi.png" },
        { title: "文史", uri: "http://easyread.163.com/common/node.atom?uuid=a4f39a3b-b002-477a-bf16-406e9e0547e9&n=default", icon: "/images/icon/wenshi.png" },
        { title: "汽车", uri: "http://easyread.163.com/common/node.atom?uuid=b3def15a-c143-4004-b6af-68ea3ac9bfbe&n=default", icon: "/images/icon/qiche.png" },
        { title: "星座", uri: "http://easyread.163.com/common/node.atom?uuid=2bb29a9c-7b7c-4427-9c20-366c3ac3060f&n=default", icon: "/images/icon/xingzhuo.png" },
        { title: "体育", uri: "http://easyread.163.com/common/node.atom?uuid=ec80e280-ce8e-42f7-8872-40e98d71292f&n=default", icon: "/images/icon/tiyu.png" },
        { title: "灵异", uri: "http://easyread.163.com/common/node.atom?uuid=2ce53cc7-2db5-481c-93b7-50f8504456f4&n=default", icon: "/images/icon/lingyi.png" },
        { title: "外文资讯", uri: "http://easyread.163.com/common/node.atom?uuid=1cb0bfaf-a083-4bdf-b955-dddb5433cbb2&n=default", icon: "/images/icon/waiwen.png" },
        { title: "社交空间", uri: "http://easyread.163.com/common/node.atom?uuid=1fff875a-8e45-4ee6-9f38-d2f702507d20&n=default", icon: "/images/icon/shejiaokongjian.png" },
        { title: "本地资讯", uri: "http://easyread.163.com/common/node.atom?uuid=9817e493-a606-48c9-8482-d741845217b5&n=default", icon: "/images/icon/bendizixun.png" },
        { title: "网易公开课", uri: "http://easyread.163.com/common/node.atom?uuid=09d03a45-3ed2-4bd5-9b02-939fc74acb12&n=default", icon: "/images/icon/gongkaike.png" },
        { title: "网易招聘", uri: "http://easyread.163.com/common/node.atom?uuid=07a76f28-8473-4502-a041-e57913eae514&n=default", icon: "/images/icon/wangyizhaoping.png" },
        { title: "高校", uri: "http://easyread.163.com/common/node.atom?uuid=f203f1d8-3938-4a95-8913-c1ce9e70753e&n=default", icon: "/images/icon/gaoxiao.png" },

    ];
    
    var subList = new WinJS.Binding.List(subArray);

    WinJS.Namespace.define("Data", {
        items: null,
        split: null,
        htmlcontent: null,
        loadMore: null,
        lastUpdated: null,
        global: {
            userEmail: "494886251@qq.com",
            pwd: "lisongyang",
            currentId: null,
            currentReadType: null,
            random: null
        },
        covers: null,//封面数据
        AddSub: {
            entryArr: null,
            subList: subList
        },
        Content: {
            imgList: null
        }
    });
})();