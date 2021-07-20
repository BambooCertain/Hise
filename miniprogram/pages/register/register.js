var that;
var app=getApp()
Page({

  data: {
    currentUserId: null
  },
  
  registerSuccess: function(e) {
    var currentUserId = this.data.currentUserId;
    var realName = e.detail.value.realName;
    var className = e.detail.value.className;
    var studentId = e.detail.value.studentId;
    var isDoneCount = 0;
    
    if(realName&&className&&studentId){
      const db = wx.cloud.database()

      // db.collection('users').where({
      //   _ioenid:''
      // })

      db.collection('users').add({
        data: {
          realName: realName,
          className: className,
          studentId: studentId,
          isDoneCount: isDoneCount
        },
        success: function (res) {
          // console.log(res)
        }
      })
    } 
    if (!realName) {
      wx.showToast({
        title: '请填写您的姓名',
        image: '../../images/warn.png',
        duration: 2000
      })
    } else if (!className) {
      wx.showToast({
        title: '请填写您的班级',
        image: '../../images/warn.png',
        duration: 2000
      })
    } else if (!studentId) {
      wx.showToast({
        title: '请填写您的学号',
        image: '../../images/warn.png',
        duration: 2000
      })
     
    } 
    else {
      wx.switchTab({
        url: '../choiceMain/choiceMain'
      })
    }
  },
})