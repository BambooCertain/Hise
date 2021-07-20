var app = getApp();
var that;

Page({
  data: {
    questionList: [],
    nowQuestion: {},
    nowQuestionNumber: 0,
    singleChoiceNumber: 0,
    userChose: '',
    loading: true
  },

  onLoad: function() {
    that = this;
    let singleChoiceNumber = getApp().globalData.singleChoiceNumber
    // 若不从单选题开始，则注释下列语句
    // that.start();

    that.setData({
      singleChoiceNumber: singleChoiceNumber
    })
    that.getQuestions()
  },

  start: function () {
    getApp().globalData.startTime = new Date();
    getApp().globalData.score = 0
    getApp().globalData.rightCnt = 0
  },

  onShow: function() {},

  getQuestions: function() {
    // wx.cloud.callFunction({
    //   name: 'getQuestions',
    //   data: {
    //     num: that.data.singleChoiceNumber,
    //     singleChoice: 1
    //   },
    //   success: res => {
    //     // console.log('[云函数] [getQuestions] ', res.result)
    //     let questionList = res.result
    //     // console.log(questionList, questionList.length)
    //     that.setData({
    //       questionList: questionList,
    //       loading: false
    //     })
    //     that.showNextQuestion()
    //   },
    //   fail: err => {
    //     console.error('[云函数] [getQuestions] 调用失败', err)
    //   }
    // })

    wx.cloud.callFunction({
      name: 'getSingleChoiceQuestionsByPart',
      data: {
        random: true,
      },
      success: res => {
        console.log('[云函数] [getSingleChoiceQuestionsByPart] ', res.result)
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

  showNextQuestion: function() {
    if (that.data.nowQuestionNumber == that.data.singleChoiceNumber) {
      that.overSingleChoice()
      return
    }
    let nowQuestion = that.data.questionList[that.data.nowQuestionNumber]
    // console.log(nowQuestion)
    nowQuestion.options = []
    nowQuestion.options[0] = {
      name: 'A',
      detail: nowQuestion.A
    }
    nowQuestion.options[1] = {
      name: 'B',
      detail: nowQuestion.B
    }
    nowQuestion.options[2] = {
      name: 'C',
      detail: nowQuestion.C
    }
    nowQuestion.options[3] = {
      name: 'D',
      detail: nowQuestion.D
    }
    that.setData({
      userChose: null,
      nowQuestion: nowQuestion,
      nowQuestionNumber: that.data.nowQuestionNumber + 1
    })
  },

  chose: function(event) {
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
      getApp().globalData.score += 4;
      getApp().globalData.rightCnt++;
      setTimeout(that.showNextQuestion, 300)
    }
  },

  overSingleChoice: function(questionNumber) {
    wx.redirectTo({
      url: '../result/result'
      // url: '../multiChoiceExplain/multiChoiceExplain'
    });
  }
})