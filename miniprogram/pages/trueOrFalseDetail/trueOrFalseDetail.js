// miniprogram/pages/trueOrFalseDetail/trueOrFalseDetail.js
var app = getApp();
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: [],
    nowQuestion: {},
    nowQuestionNumber: 0,
    trueOrFalseNumber: 0,
    userChose: '',
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let trueOrFalseNumber = getApp().globalData.trueOrFalseNumber
   
    that.setData({
      trueOrFalseNumber: trueOrFalseNumber
    })
    that.start();
    that.getQuestions()
  },

  start: function() {
    getApp().globalData.startTime = new Date();
    getApp().globalData.score = 0
    getApp().globalData.rightCnt = 0
  },

  getQuestions: function () {
    wx.cloud.callFunction({
      name: 'getQuestions',
      data: {
        num: that.data.trueOrFalseNumber,
        singleChoice: 2
      },
      success: res => {
        console.log('[云函数] [getQuestions] ', res.result)
        let questionList = res.result
        // console.log(questionList, questionList.length)
        that.setData({
          questionList: questionList,
          loading: false
        })
        that.showNextQuestion()
      },
      fail: err => {
        console.error('[云函数] [getQuestions] 调用失败', err)
      }
    })
  },

  showNextQuestion: function () {
    if (that.data.nowQuestionNumber == that.data.trueOrFalseNumber) {
      that.overSingleChoice()
      return
    }
    let nowQuestion = that.data.questionList[that.data.nowQuestionNumber]
    console.log(nowQuestion)
    nowQuestion.options = []
    nowQuestion.options[0] = {
      name: 'T',
      detail: '正确'
    }
    nowQuestion.options[1] = {
      name: 'F',
      detail: '错误'
    }

    that.setData({
      userChose: null,
      nowQuestion: nowQuestion,
      nowQuestionNumber: that.data.nowQuestionNumber + 1
    })
  },

  chose: function (event) {
    // console.log(event)
    var answer = that.data.nowQuestion.answer
    var userChose = event.currentTarget.dataset.option
    if (that.data.userChose) {
      return
    }
    that.setData({
      userChose: userChose
    })
    if (userChose == answer) {
      getApp().globalData.score += 2;
      getApp().globalData.rightCnt++;
      setTimeout(that.showNextQuestion, 300)
    }
  },

  overSingleChoice: function (questionNumber) {
    wx.redirectTo({
      // url: '../result/result'
      url: '../singleChoiceExplain/singleChoiceExplain'
      //url: '../multiChoiceExplain/multiChoiceExplain'
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})