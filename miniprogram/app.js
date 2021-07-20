App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      wx.showModal({
        title: "提示",
        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
      });
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: "已经有新版本了哟",
        content: "新版本已经上线啦，请您删除当前小程序，重新搜索打开"
      });
    });
  },

  globalData: { 
    userInfo: null,
    singleChoiceNumber: 20,
    multiChoiceNumber: 0,
    trueOrFalseNumber: 10,
    score:0, // 答对分数
    rightCnt:0, // 答对题数
    openid:null,
    realName: '',
    className: '',
    studentId: '',
    totalScore: 0,
    isDoneCount: 0, // 已做次数
    startTime: null,
    useTime: 0,
  }
})