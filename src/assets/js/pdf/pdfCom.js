//打卡功能
//网页当前状态判断，若不处于当前窗口则不发请求
var interval_output = null;
function sendRequst() {
    interval_output = setInterval(function () {
        SetClock();
    }, 180000);
}
// sendRequst();

var hiddenProperty = 'hidden' in document ? 'hidden' :
   'webkitHidden' in document ? 'webkitHidden' :
   'mozHidden' in document ? 'mozHidden' :
   'msHidden ' in document ? 'msHidden ' :
   null;
var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
var onVisibilityChange = function () {
    if (!document[hiddenProperty]) {
        // console.log('页面激活')
        sendRequst();
    } else {
        //console.log('页面非激活');
        clearInterval(interval_output);
    }
}
document.addEventListener(visibilityChangeEvent, onVisibilityChange);

// 打卡 通篇文献阅读十分钟以上打卡成功

$(".vote-x").click(function () {
    $("#clockIframeDiv").hide();
})

function SetClock() {
    var token = getCookie("AID") || getCookie("LID");
    $.ajax({
        url: window.InitData.ClockUrl,
        type: 'get',
        headers: { "token": token },
        data: {
        },
        dataType: "json",
        success: function (data) {
            // if (data.data.clockState && data.data.clockState === true) {
                //var iframUrl = '/sale/entry/studyRecord';
                //$("#clockIframe").attr("src", iframUrl);
                //$("#clockIframeDiv").show();
            // }
        }
    })
}
// 取出cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

