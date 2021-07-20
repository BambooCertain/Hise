// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  if (!event.openid || event.score === null) {
    return {
      status: "error",
      errMsg: "empty openid"
    }
  }

  let res = await db.collection('users').where({
    _openid: event.openid
  }).get();
  let userData = res.data[0];

  let id = userData._id;
  let score = (userData.score ? userData.score : 0);
  if (event.score >= 80 && event.useTime <= 600) {
    ++score;
  }

  await db.collection('users').doc(id).update({
    data: {
      score: score,
      isDoneCount: event.isDoneCount,
      // useTime: event.useTime
    }
  })

  let t = new Date()
  t.setHours(t.getUTCHours() + 8)
  t = t.toString()
  db.collection('records').add({
    data: {
      _openid: event.openid,
      studentId: userData.studentId,
      realName: userData.realName,
      className: userData.className,
      score: event.score,
      isDoneCount: event.isDoneCount,
      totalScore: score,
      time: t,
      useTime: event.useTime
    }
  })

  // if (event.useTime >= 2400) {
  //   event.score = event.score*(-1) - 10000
  // }

  if (event.score < 80 || event.useTime > 600) {
    return {
      status: "error",
      errMsg: "document.update: skip"
    }
  } else {
    return {
      status: "success",
      errMsg: "document.update:ok",
      data: {
        score: 1
      }
    }
  }
}