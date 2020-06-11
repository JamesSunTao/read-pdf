<template>
  <div class="study-wrap"> 
      <div class="video-r">
        <div class="study-r">
            <videoRight/>  
        </div>
      </div>
     
      <div class="video-box" v-if="sourceType=='11'">
        <!-- //视频  支持视屏格式 MP4(mp4) webm(webm) ogv(ogg)-->
        <video
        id="myVideo"
            controls
            class="video-js"
            vjs-big-play-centered 
            poster="">
            <source :src="videoAndAudioUrl" type="video/mp4">
        </video>
      </div>
      <div class="video-box audio-box"  v-if="sourceType=='10'">
           <!-- //音频 -->
        <video
        id="myVideo"
            controls
            class="video-js video-js-audio">
            <source :src="videoAndAudioUrl" type="audio/mp3">
        </video>
      </div>
  </div>
</template>

<script>
import videoRight from './videoRight'
import { mapState, mapMutations } from 'vuex';
export default {
components:{
  videoRight
},
data () {
   return {
       sourceType:window.InitData.DcType,
       videoAndAudioUrl:window.InitData.videoAndAudioUrl
    //    myPlayer:null
   };
},
computed:{

},
mounted() { 
    this.initVideo();
    this.sourceType;
 
},
methods: {
    ...mapMutations(['setMyPlayer']),
    initVideo() {
        //初始化视频方法
        let isPictureInPictureToggle = true,
            isFullscreenToggle = true,
            isBigPlayButton = true;

        if (this.sourceType == '10') {
            isPictureInPictureToggle = false;
            isFullscreenToggle = false;
            isBigPlayButton = false;
        }
        let myPlayer = this.$video(myVideo, {
            //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
            controls: true,
            //自动播放属性,muted:静音播放
            autoplay: false,
            loop:false,
            //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
            preload: "auto",
            type: 'application/x-mpegURL',
            // aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
//             fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
            //设置视频播放器的显示宽度（以像素为单位）
            width: "800px",
            //设置视频播放器的显示高度（以像素为单位）
            height: "600px", 
            //允许用户从选择数组中选择播放速度
            playbackRates: [0.5, 1, 1.5, 1.8, 2],
            bigPlayButton:isBigPlayButton,
            controlBar: {
                currentTimeDisplay:true, // 当前播放时间
                fullscreenToggle: isFullscreenToggle,//显示全屏按钮，默认为true
                pictureInPictureToggle: isPictureInPictureToggle,//隐藏画中画按钮，默认为true
                volumePanel: true,//隐藏声音面板
                currentTimeDisplay: true,//显示当前播放时间
                timeDivider: true,//显示时间分割线 
                durationDisplay: false,//显示总时间
                remainingTimeDisplay: true,//隐藏剩余时间，
            },
            
        });      
        
        this.setMyPlayer(myPlayer);
    }

}
}

</script>
<style scoped>
/* .study-wrap{max-height: calc(100% - 100px);} */
/* .btn-block-box{padding:10px 13px;background:#fff}
.btn-block{display:block;height:36px;line-height:36px;text-align:center;color:#fff;background:#3594ff;border-radius:4px} */
.video-box{position: relative; background:#1b1b1b;overflow:hidden;height:100%;}
.video-r{float:right;width:410px;height:100%}
.video-r .study-r{height:calc(100%);float:none}
#myVideo{position: absolute;left: 0;right: 0;top: 0;bottom: 0; margin:auto;}


</style>
<style>
.vjs-poster{background-repeat: no-repeat; background-position: 50% 50%; background-size: cover;cursor: pointer;}
.audio-box video{background: url(../../assets/images/audio.gif) no-repeat center;
    background-position: center;
    position: relative; }
.video-js-audio{ background:#000;box-shadow: 0 0 15px #3474d9; border:10px solid #000;}
/* .video-js .vjs-big-play-button{top:50%;left: 50%;margin-top:-0.8em;margin-left: -1.5em;} */
/* .video-js-audio .vjs-big-play-button{display:none;} */
.div-mp3{position: absoute;background: orange;height: 100%;width: 100%;}
.audio-box .vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar{opacity: 1 !important;}
.audio-box .video-js .vjs-control-bar{display: flex !important;}
/* 进度条背景色 */
.video-js .vjs-play-progress{
  color: #ffb845;
   height: 6px;
  background-color: #ffb845;
}
.video-js .vjs-progress-control .vjs-mouse-display{
    height: 6px;
  background-color: #ffb845;
}
.vjs-mouse-display .vjs-time-tooltip{
  padding-bottom: 6px;
  background-color: #ffb845;
}
.video-js .vjs-play-progress .vjs-time-tooltip{
  display: none!important;
}
</style>