var that;
Page({
  data: {
    questionList: [],
    nowQuestion: {},
    nowQuestionNumber: 0,
    multiChoiceNumber: 0,
    userChose: {},
    loading: true,
    answered: 0, // 未答，答错， 答对
    hint: ''
  },


  onLoad: function() {
    that = this;
    that.setData({
      multiChoiceNumber: getApp().globalData.multiChoiceNumber
    })
    that.getQuestions()
  },


  onShow: function() {},

  getQuestions: function() {
    wx.cloud.callFunction({
      name: 'getQuestions',
      data: {
        num: that.data.multiChoiceNumber,
        singleChoice: 0
      },
      success: res => {
        // console.log('[云函数] [getQuestions] ', res.result)
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
    if (that.data.nowQuestionNumber == that.data.multiChoiceNumber) {
      that.submit()
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
      hint: '',
      userChose: {},
      answered: false,
      nowQuestion: nowQuestion,
      nowQuestionNumber: that.data.nowQuestionNumber + 1
    })
  },

  chose: function(event) {
    // console.log(event)
    if (that.data.answered) {
      return;
    }
    let tmp = event.currentTarget.dataset.option
    let userChose = that.data.userChose
    // console.log(userChose)
    userChose[tmp] = 1
    that.setData({
      userChose: userChose
    })
  },

  unChose: function(event) {
    // console.log(event)
    if (that.data.answered) {
      return;
    }
    let tmp = event.currentTarget.dataset.option
    let userChose = that.data.userChose
    userChose[tmp] = ''
    that.setData({
      userChose: userChose
    })
  },

  answer: function() {
    if (that.data.answered) {
      if(that.data.answered == 1)
        that.showNextQuestion()
      return;
    }
    let answer = that.data.nowQuestion.answer,
      userChose = that.data.userChose,
      flag = true
    for (let i = 0; i < answer.length; ++i) {
      if (!userChose[answer[i]])
        flag = false
    }
    let tot = 0
    for (let i in userChose)
      if (userChose[i])
        ++tot
    if(tot < 2) {
      that.setData({
        hint: "请至少选择两个选项",
      })
      return;
    }
    that.setData({
      answered: 1
    })
    if (tot != answer.length)
      flag = false
    if (flag) {
      getApp().globalData.score+=2;
      getApp().globalData.rightCnt++;
      setTimeout(that.showNextQuestion, 300)
      that.setData({
        hint: "回答正确",
        answered: 2
      })
    } else {
      that.setData({
        hint: "正确答案：" + that.data.nowQuestion.answer + "\r\n" + that.data.nowQuestion.analyze,
      })
    }
  },

  submit: function() {
    wx.redirectTo({
      // url: '../result/result'
      url: '../singleChoiceExplain/singleChoiceExplain'
    });
  }
})