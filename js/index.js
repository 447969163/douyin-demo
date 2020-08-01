// 简化操作
let $ = (function () {
    return {
        //简化dom操作
        dom(elem) {
            if (document.querySelectorAll(elem).length == 1){
                return document.querySelector(elem)
            } else {
                return document.querySelectorAll(elem);
            }
        },
        //简化ajax操作
        ajax({type,url,data,success}){
            //处理data
            let datas = "page=" + data.page + "&count=" + data.count + "&type=" + data.type;
            //ajax
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let result = xhr.responseText;
                    return success(JSON.parse(result));
                }
            }
            xhr.open(type,url,true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
            xhr.send(datas)
        }
    }
})()
//获取dom
let video = $.dom("video");
let title = $.dom(".title");
let name = $.dom(".name");
let passtime = $.dom(".passtime");
let avatar = $.dom(".avatar>img");
let unlike = $.dom(".like>img")[0];
let like = $.dom(".like>img")[1];
let likecount = $.dom(".like-count");
//初始全局索引值
let count = 1;

//交换数据

let change = function (count) {
    //发送请求
    $.ajax({
        type: "post",
        url: "https://api.apiopen.top/getJoke",
        data: {
            page: count,
            count: 1,
            type: "video"
        },
        //填充数据
        success: function(result) {
            let res = result.result[0];
            video.src = res.video;
            title.innerHTML = res.text;
            name.innerHTML = res.name;
            passtime.innerHTML = res.passtime;
            avatar.src = res.header;
            likecount.innerHTML = res.comment;
        }
    })
}

//上滑请求下一页数据

//判断用户上滑操作
let startx = 0;
let starty = 0;
let endx = 0;
let endy = 0;
//获取手指接触屏幕点
document.addEventListener("touchstart",function(e){
    startx = e.touches[0].pageX;
    starty = e.touches[0].pageY;
    video.play();
})
//获取手指离开屏幕触点
document.addEventListener("touchend",function(e){
    endx = e.changedTouches[0].pageX;
    endy = e.changedTouches[0].pageY;
    //计算滑动距离
    let xchange = endx - startx;
    let ychange = endy - starty;
    ychange < -70 ? count += 1 : false;
    change(count);
})

// 点赞
unlike.addEventListener("click",function(){
    this.style.display = "none";
    like.style.display = "block";
})
like.addEventListener("click",function(){
    this.style.display = "none";
    unlike.style.display = "block";
})

//页面初始化
change(count);
// 监听页面载入
window.addEventListener("load",function(){
    //获取设备高度
    let screenHeight = window.screen.availHeight;
    //跟随页面大小改变video区域高度
    $.dom(".video").style.height = screenHeight + 'px';
})
//监听页面大小改变
window.addEventListener("resize",function(){
    //获取设备高度
    let screenHeight = window.screen.availHeight;
    //跟随页面大小改变video区域高度
    $.dom(".video").style.height = screenHeight + 'px';
})