var app = getApp();
var that;
Page({
  data: {
    userInfo: {},
    realName: '',
    className: '',
    studentId: '',
    score: ''
  },
 
  onShow: function () {
    that = this
    that.setData({
      realName: app.globalData.realName,
      className: app.globalData.className,
      studentId: app.globalData.studentId,
      score: app.globalData.totalScore
    })
  }
})