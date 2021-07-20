var that;
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isDoneCount: 2,
  },

  start: function() {
    wx.navigateTo({
      // url: '../singleChoiceExplain/singleChoiceExplain',

      // url: '../result/result',
      // url: '../multiChoiceExplain/multiChoiceExplain',
      url: '../trueOrFalseExplain/trueOrFalseExplain',
    })
  },

  onLoad: function() {
    that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
      console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid

        const db = wx.cloud.database()
        db.collection('users').where({
          _openid: app.globalData.openid
        }).get({
          success: function(res) {
             console.log(res)
            if (!res.data.length) {
              wx.redirectTo({
                url: '../register/register',
              })
            } else {
              app.globalData.realName = res.data[0].realName
              app.globalData.className = res.data[0].className
              app.globalData.studentId = res.data[0].studentId
              app.globalData.totalScore = (res.data[0].score ? res.data[0].score : 0)
              app.globalData.isDoneCount = (res.data[0].isDoneCount ? res.data[0].isDoneCount : 0)
              app.globalData.highestScore = (res.data[0].score ? res.data[0].score : 0)
              that.setData({
                isDoneCount: app.globalData.isDoneCount
              })
              app.globalData.useTime = 0
            }
          },
          fail: function(err) {
            console.log(err)
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  onShow() {
    that.setData({
      isDoneCount: app.globalData.isDoneCount
    })
  }
})