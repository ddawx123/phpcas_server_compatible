var words = new Array("帮助别人减轻三分烦恼，自己就会享受七分快乐。",
    "每个人都有潜在的能量，只是很容易被习惯所掩盖，被时间所迷离，被惰性所消磨。",
    "有理想在的地方，地狱就是天堂。有希望在的地方，痛苦也成欢乐。",
    "不要对挫折叹气，姑且把这一切看成是在你成大事之前，必须经受的准备工作。",
    "河流之所以能够到达目的地，是因为它懂得怎样避开障碍。",
    "一个成功的竞争者应该经得起风雨，应该具有抗挫折的能力。",
    "不要让对失败的恐惧，绊住你尝试新事物的脚步。",
    "学会理解，因为只有理解别人，才会被别人理解。",
    "学会忘记，因为只有忘记已经失去的才能立足当前，展望未来。",
    "学会快乐，因为只有开心度过每一天，活得才精彩。",
    "心宽阔了，才能明白没有一个人是孤岛，才能欣赏到对岸的风景，才能懂得如何接纳他人。",
    "当困难来临时，用微笑去面对，用智慧去解决。",
    "没有人富有的可以不用别人的帮助，也没有人穷的不能在某方面给他人帮助。",
    "规划的根本目的是为了更快、更有效地达成目标。",
    "不要惧怕学习，知识是没有重量的，你永远可以轻易的带着它与你同行。",
    "在你有一肚子火要发之前，先给自己10分钟沉思一会儿。",
    "收敛自己的脾气，偶尔要刻意沉默，因为冲动会做下让自己无法挽回的事情。",
    "多抱怨一天，就少幸福一天，多回头看一天，就少前进一天。",
    "人生就像一张有去无回的单程车票，没有彩排，每一场都是现场直播。",
    "高傲自大只能让你止步不前，但是正直和谦虚可以引领你走向成功。",
    "要么你去驾驭生命，要么是生命驾驭你。",
    "成大事者能把困境变为成功的有力跳板。",
    "如果你想要更上一层楼，就为别人提供超出预期更多更好的服务。",
    "没有问题就是最大的问题。没有问题的安逸如同没有引爆的地雷一样危险。",
    "失败能打垮人的头脑，胜利也能冲昏人的头脑。",
    "天时不如地利，地利不如人和。",
    "目标从梦想开始，幸福从心态把握，成功则在行动中实现。");

var i = null;
var in_pass = false;
//是否IE8\9
var IEor = navigator.userAgent.indexOf("MSIE 9") >= 0 || navigator.userAgent.indexOf("MSIE 8") >= 0
//是否小于等于IE8
var belowIE8 = navigator.userAgent.indexOf("MSIE 8") >= 0 || navigator.userAgent.indexOf("MSIE 7") >= 0
//用户自定义的颜色
var userColor = "0,187,238"
var lts = "e21s1";

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r !== null) {
        return unescape(r[2]); //返回参数值
    }
    else {
        return "http://www.dingstudio.cn";
    }
}
function login() {
    if (!hasText($(".un_input input").val())) {
        $(".un_input").velocity("stop", true);
        $(".un_input").velocity("callout.shake", { duration: 400 });
        return;
    }
    if (!hasText($(".passwd input").val())) {
        $(".passwd").velocity("stop", true);
        $(".passwd").velocity("callout.shake", { duration: 400 });
        return;
    }
    $(".passwd input,.un_input input").attr("readonly", "readonly");
    $.ajax({
        url: "https://passport.dingstudio.cn/sso/api?format=json&action=login",
        method: "GET",
        dataType: "jsonp",
        data: {
            "username": $(".un_input input").val(),
            "userpwd": $(".passwd input").val()
        },
        jsonp: "callback",
        async: false,
        success: function (data) {
            if (data.code === 200) {
                var token = data.data.usertoken;
                $(".blurbg").children().not(".welcome_word,#bgimg,#bgsvg").velocity("fadeOut", 300);
                $(".welcome_word").velocity("fadeIn", {
                    duration: 400, complete: function () {
                        $(".welcome_word").velocity("fadeOut", {
                            duration: 400, delay: 1000, complete: function () {
                                //location.href = getUrlParam("service");
                                gen_postlogin(token);
                            }
                        });
                    }
                });
            } else {
                if (data.code == 403) {
                    console.log(data.message);
                    $(".passwd,.un_input").velocity("callout.shake", { duration: 400 });
                    $(".passwd input,.un_input input").val("").removeAttr("readonly");
                    $(".err").html('用户名或密码不正确，请重试。');
                } else {
                    $(".passwd").velocity("callout.shake", { duration: 400 });
                    $(".passwd input").val("");
                    $(".passwd input,.un_input input").removeAttr("readonly");
                }
            }
        }
    });
}
function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
}

$(function () {
    $(".welcome_word").html(words[parseInt(Math.random() * (words.length - 1))]);
    $(document).keydown(function (e) {
        if (in_pass && e.which == 13) {
            login();
        }
    });
    $(".icon-right").click(function () {
        login();
    });
    $("#bg").attr("src", userBgImage);
    $("#bluri").attr("src", userBgImage.replace("/b", "/sb"));
    var mm = $("#bluri");
    if (!IEor) {
        $("#bgimg").remove();
        if (mm[0].complete) {
            stackBlurImageObj(mm[0], "bgsvg", 10, false);
            adjust();
        } else {
            mm[0].onload = function () {
                stackBlurImageObj(mm[0], "bgsvg", 10, false);
                adjust();
            };
        }
    } else {
        $("#bgsvg").remove();
        $("#bgimg").attr("src", userBgImage);
    }
    $(".icon-cancel").click(function () {
        in_pass = false;
        var sq = [
            { e: $(this).parent().parent(), p: "transition.slideDownBigOut", o: { duration: 400, easing: "easeOutCirc" } },
            { e: $(".welcome_content .title2"), p: { top: "35%", "height": "100px", "margin-left": "-250px", "width": "500px" }, o: { duration: 400, sequenceQueue: false, easing: "easeInOutExpo" } },
            { e: $(".click_icon .p1,.welcome_content .logo,.welcome_content .title1"), p: "fadeIn", o: { delay: 200, duration: 200, sequenceQueue: false } }
        ]
        $(".welcome_bg").velocity("fadeOut", 300);
        $.Velocity.RunSequence(sq);
        $("#bg").velocity("fadeIn", 300);
    });
    $(".click_icon").children().click(function () {
        var item = $(".panel_password");
        in_pass = true;
        if ($(this).hasClass("q")) {
            startQRTracker();
            item = $(".panel_qrcode");
        }
        var sq = [
            { e: $(".click_icon .p1,.welcome_content .logo,.welcome_content .title1"), p: "transition.fadeOut", o: { duration: 10 } },
            { e: item, p: "transition.slideUpBigIn", o: { duration: 600, easing: "easeInOutExpo", display: "block" } },
            { e: $(".welcome_content .title2"), p: { top: "15%", "height": "50px", "width": "250px", "margin-left": "-125px" }, o: { duration: 600, sequenceQueue: false, easing: "easeOutCirc" } }
        ]
        $(".welcome_bg").velocity({ opacity: 0.2 }, { display: "block" }, 300);
        $("#bg").velocity("fadeOut", 300);
        $.Velocity.RunSequence(sq);
    });
    $("#forget").click(function () {
        window.open("https://passport.dingstudio.cn/sso/login.php?mod=findpassword");
    });
    $("#help").click(function () {
        window.open("https://passport.dingstudio.cn/sso/login");
    });
    if (!isPC()) {
        $(".logo").css({ width: 84, height: 84, left: "50%", "margin-left": "-42px" });
        $(".title2").css({ width: 240, height: 48, left: "50%", "margin-left": "-120px" });
        $(".click_icon .p").click();
        $(".head").hide();
        $(".panel_password").css("top", "-150px");
        $(".icons").hide();
        $(".icons3").hide();
        $(".icons2").hide();
        $(".icons1").css({ "margin-left": "-35px" });
    }
    $(window).resize(function () {
        clearTimeout(i);
        i = setTimeout(function () { adjust(); }, 50);
    });
    adjust();
    $("#bg").load(function () {
        $(".blurbg").velocity("fadeIn", 300, function () {
            $(".welcome_content").velocity("transition.slideUpBigIn");
        })
    })
    $.ajax({
        url: 'https://passport.dingstudio.cn/sso/api?format=json&action=status',
        method: 'get',
        dataType: 'jsonp',
        jsonp: 'callback',
        data: {
            cors_domain: window.location.protocol + '//' + window.location.host
        },
        success: function (r) {
            if (r.code === 200 && r.data.authcode === 1) {
                $(".blurbg").children().not(".welcome_word,#bgimg,#bgsvg").velocity("fadeOut", 300);
                $(".welcome_word").velocity("fadeIn", {
                    duration: 400, complete: function () {
                        $(".welcome_word").velocity("fadeOut", {
                            duration: 400, delay: 1000, complete: function () {
                                var url = getUrlParam('service');
                                url = decodeURIComponent(url);
                                if (url.indexOf('?') != -1) {
                                    console.log('Found parameter.');
                                    window.location.href = url + '&ticket=ST-' + r.data.token;
                                } else {
                                    console.log('Could not found parameter.');
                                    window.location.href = url + '?ticket=ST-' + r.data.token;
                                }
                            }
                        });
                    }
                });
            }
        }
    })
});
function startQRTracker() {
    var qrlogin_check = window.setInterval(function () {
        $.ajax({
            url: 'https://passport.dingstudio.cn/sso/qrlogin.php?act=getLoginStatus',
            method: 'get',
            dataType: 'jsonp',
            jsonp: 'callback',
            data: {
                cors_domain: window.location.protocol + '//' + window.location.host
            },
            async: true,
            success: function (ResponseText) {
                if (ResponseText.code == 200) {
                    var token = ResponseText.data.usertoken;
                    clearInterval(qrlogin_check);
                    $(".blurbg").children().not(".welcome_word,#bgimg,#bgsvg").velocity("fadeOut", 300);
                    $(".welcome_word").velocity("fadeIn", {
                        duration: 400, complete: function () {
                            $(".welcome_word").velocity("fadeOut", {
                                duration: 400, delay: 1000, complete: function () {
                                    //location.href = getUrlParam("service");
                                    gen_postlogin(token);
                                }
                            });
                        }
                    });
                }
                else if (ResponseText.code == 401) {
                    console.log('Waiting for app login.');
                }
                else if (ResponseText.code == 404) {
                    clearInterval(qrlogin_check);
                }
                else {
                    console.log('Now result code: ' + ResponseText.code + ', please check system running status.');
                }
            },
            error: function (e) {
                console.log('Connect failed.');
            }
        });
    }, 1500);
}
function adjust() {
    var w = $(window).width();
    var h = $(window).height();
    if (w / 16 * 9 > h) {
        h = parseInt(w / 16 * 9) * 1.05;
        w = w * 1.05;
    } else {
        w = parseInt(h / 9 * 16) * 1.05;
        h = h * 1.05;
    }
    $("#bgsvg,#bg,#bgimg,#bgsvg image").width(w).height(h);
    $("#bgimg,#bg,#bgsvg").css({ "left": "50%", "top": "50%", "margin-left": "-" + ((parseInt(w / 2)) + "px"), "margin-top": ("-" + (parseInt(h / 2)) + "px") });
    if (navigator.userAgent.indexOf("MSIE 9") > 0 || navigator.userAgent.indexOf("MSIE 8") > 0) {
        $("#bgimg").css("margin-left", "-" + (parseInt(w / 2) + 10) + "px").css("margin-top", "-" + (parseInt(h / 2) + 10) + "px");
    }
}
function hasText(a) {
    if (typeof (a) == "undefined") {
        return false;
    }
    if (a == null) {
        return false;
    }
    if (a == "null") {
        return false;
    }
    if (typeof (a) == "string") {
        a = a.replace(/(^\s*)|(\s*$)/g, "");
    }
    if (a === "") {
        return false;
    }
    return true;
}
function gen_postlogin(ticket) {
    var fm = document.createElement('form');
    fm.action = location.href;
    fm.method = 'post';
    var tk = document.createElement('input');
    tk.name = 'ticket';
    tk.type = 'hidden';
    tk.value = ticket;
    fm.appendChild(tk);
    document.getElementsByTagName('body').item(0).appendChild(fm);
    fm.submit();
}