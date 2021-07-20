var that;
Page({
  data: {
    ranking_list: []
  },

  onPullDownRefresh: function(options) {
    that.getRank()
  },

  onLoad: function(options) {
    that = this;
    that.getRank()
  },

  getRank: function() {
    wx.cloud.callFunction({
      name: 'getRanking',
      data: {},
      success: res => {
        // console.log('[云函数] [login] user openid: ', res.result.openid)
        let tmp = res.result.data
        let rank = 1
        for (let i in tmp) {
          tmp[i].rank = rank++
        }
        that.setData({
          ranking_list: tmp
        })
        wx.stopPullDownRefresh()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  }
})