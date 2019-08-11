window.onload = function () {
/* 初始化页面功能*/
    /* 搜索*/
    search();
    /*轮播图*/
    banner();
    /*倒计时 */
    downTime();
}

// 搜索
var search = function() {
    /*
     * 1.页面初始化的时候  距离顶部是0的距离的时候  透明度是0
     * 2.当页面滚动的时候  随着页面距离顶部的距离变大  透明度变大
     * 3.当滚动的距离超过了轮播图的距离的时候 保持不变
     * */
    // 获取搜索框和banner的dom元素
    var search = document.querySelector(".jd_content");
    var banner = document.querySelector(".jd_banner");

    // 获取高度
    var height = banner.offsetHeight;
    
    window.scroll = function() {
        // 获取到顶部的距离 scrollTop
        var top = document.body.scrollTop;
        // ie获取的方法
        // var top = document.documentElement.scrollTop
        var opacity = 0;
        if(top> height) {
            /*当滚动的距离超过了轮播图的距离的时候 保持不变*/
            opacity = 0.85;
        }else {
            /*当页面滚动的时候  随着页面距离顶部的距离变大  透明度变大*/
            opactiy = 0.85 * (top/height);
        }
        /*设置颜色给搜索盒子*/
            // 颜色转换成rgba格式
        search.style.background = 'rgba(216,80,92,'+ opacity +')';
    }
    
}


// 轮播图
var banner = function() {
    /*
    * 1.无缝滚动&无缝滑动（定时器 过渡 位移）
    * 2.点盒子对应改变 （改变当前样式）
    * 3.可以滑动 （touch事件  监听触摸点坐标改变距离  位移）
    * 4.当滑动距离不够的时候   吸附回去  （过渡  位移）
    * 5.当滑动距离够了的时候    跳转  上一张  下一张 （判断方向  过渡  位移）
    * */
//    获取dom元素  banner 图片盒子  点盒子 所有点
    var banner = document.querySelector('.jd_banner');
    // first-child是queryselector独有的
    var imagesBox = document.querySelector('ul:first-child');
    var pointBox = document.querySelector('ul:last-child');
    // li要全选
    var points = pointBox.querySelectorAll('li');
    // 获取banner容器宽度  
    var width = banner.offsetWidth;

    // 一些公共方法
    // 添加过渡
    var addTransition = function() {
        imagesBox.style.transition = 'all 0.3s';
        // 设置兼容性
        imagesBox.style.webkitTransition = 'all 0.3s';
    }
    // 清除过渡
    var removeTransition = function() {
        imagesBox.style.transition = 'none';
        imagesBox.style.webkitTransition = 'none';
    }
    // 设置位移,移动轮播图宽度
    var setTranslateX = function(translateX) {
        imagesBox.style.transform = 'translateX('+translateX+'px)'
        imagesBox.style.webkitTransform = 'translateX'+translateX+'px)'
    }

    // 1.无缝滚动&无缝滑动（定时器 过渡 位移）
    var index = 1
    var timer = setInterval(function(){
        index++;
        // 过渡
        addTransition();
        // 位移
        setTranslateX(-index * width);
        // setPoints();
    },3000)
    // 监听过渡结束的时间点，过渡结束事件 transitionend
    imagesBox.addEventListener('transitionend',function(){
        // 无缝滚动  当滚动到最后一张的时候转到第一张图 index=1
        if(index >= 9){
            index = 1;
            // 清除过渡
            removeTransition();
            // 改变图片位置
            setTranslateX(-index * width);
        }
        // 无缝滑动  滑到第一张，再往前滑，就直接到最后一张，左滑遇到8右滑遇到1
        else if(index < 0) {
            index = 8;
            removeTransition();
            setTranslateX(-index * width);
        }
        // 点会跟着index的变化而变化
        /*正常*/
        /*index 取值范围  1-8  对应点的  0-7 */
        setPoints();
        console.log(index)
    })

    // 点击盒子，对应颜色改变
    var setPoints = function(){
        // 清空点样式
        for(var i=0; i< points.length; i++){
            // 循环到的点清除样式
            points[i].classList.remove('now');
        }
        // 给对应的点加上样式,这里的index是从1开始的，所以要-1才跟下标一致
        points[index-1].classList.add('now');
        
    }
    // *3.可以滑动 （touch事件  监听触摸点坐标改变距离  位移）
    var startX = 0/*记录开始的X坐标*/
    var distanceX = 0;/*记录坐标坐标轴的改变的*/
    var isMove = false;
    imagesBox.addEventListener('touchstart',function(e){
        // 清除定时器
        clearInterval(timer)
        // 坐标轴开始的位置  clientX当前视点  拿到clientX的值
        var startX = e.touches[0].clientX;
    })

    imagesBox.addEventListener('touchmove',function(e){
       
        var moveX = e.touches[0].clientX;
        var distanceX = moveX - startX;
        /* distanceX 大于0的时候  向右滑动  */
        /* distanceX 小于0的时候  向左滑动  */
        
        /*滑动*/
        /*基于当前的位置*/
        /*计算将要去做定位*/
        var translateX = -index * width + distanceX;
        // 清除过渡
        removeTransition();
        // 确定位移,做定位
        setTranslateX(translateX)
        isMove = true;
        
    })
    
    imagesBox.addEventListener('touchend',function(e){
        /*滑动事件结束之后来判断当前滑动的距离*/
        /*有一个范围  如果大于三分之一切换图片 反之吸附回去定位回去*/
        if(isMove) {
            if(Math.abs(distanceX) < width/3){
                /* 4.当滑动距离不够的时候   吸附回去  （过渡  位移）*/
                 /*过渡*/
                addTransition();
                // 位移
                setTranslateX(-index * width)
            }else {
                /*5.当滑动距离够了的时候    跳转  上一张  下一张 （判断方向  过渡  位移）*/
                if(distanceX > 0){
                    /*向右滑  上一张*/
                    index--
                }else {
                    /*向左滑 下一张*/
                    index++
                }
                addTransition();
                setTranslateX(-index * width);
            }
        }
        /*加上定时器*/
        /*严谨做法  保证只加一次,这样子滑动效果不会反复触发*/
        clearInterval(timer);
        timer = setInterval(() => {
            index++
            addTransition();
            setTranslateX(-index * width);
        }, 3000);
        // 重置参数
        startX = 0;
        distanceX = 0;
        isMove = false;
    })    
}
    
// 倒计时
function downTime() {
     /*
    * 1.模拟倒计时的时间  是11个小时
    * 2.利用定时器  1  秒一次   重新展示时间
    * */
}