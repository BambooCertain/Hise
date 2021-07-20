var that;
var app = getApp()
Page({
  data: {
    score: 0,
    useTime: '',
    rightCnt: 0,
    loading: true,
  },

  onLoad: function(options) {
    that = this;
    let score = getApp().globalData.score
    getApp().globalData.isDoneCount++
    let useTime = Math.floor((new Date() - app.globalData.startTime) / 1000);

    let minute = Math.floor(useTime/60);
    let second = useTime % 60;
    let useTime_str = minute + "分" + second + "秒";
    // if(minute >= 10) {
    //   useTime_str += "，您已超出规定作答时间，本次答题成绩无效。"
    // }

    that.setData({
      score: score,
      useTime: useTime_str,
      rightCnt: getApp().globalData.rightCnt,
    })
    console.log("score:" + score);
    console.log("useTime:" + useTime);
    wx.cloud.callFunction({
      name: 'uploadScore',
      data: {
        openid: app.globalData.openid,
        score: score,
        isDoneCount: app.globalData.isDoneCount,
        useTime: useTime,
      },
    }).then(res => {
       console.log(res)
       console.log(res.result.data);
      if (res.result.status === "success") {
        app.globalData.totalScore += res.result.data.score;
      }
      that.setData({
        loading: false
      })
    })
  },
  returnMainPage: function() {
    wx.switchTab({
      url: '../choiceMain/choiceMain'
    })
  },
})