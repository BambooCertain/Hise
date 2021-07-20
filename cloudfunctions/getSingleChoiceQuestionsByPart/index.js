// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  let allQuestionsList = [];

  // 各部分题目数量
  let nums = [0, 20, 8, 8, 8, 8, 8];

  for (let part = 1; part <= 1; ++part) {
    let res = await db.collection('questions')
      .where({
        part: part
      })
      .get();
    let arr = res.data;
    let questionList = []

    //随机答案（限单选题）
    let isRandom = event.random;

    for (let i = 0; i < nums[part]; i++) {
      let ran = Math.floor(Math.random() * (arr.length - i));
      if (isRandom === true) {
        for (let j = 0; j < 4; ++j) {
          let op1 = String.fromCharCode(Math.floor(Math.random() * 4) + 65);
          let op2 = String.fromCharCode(Math.floor(Math.random() * 4) + 65);
          [arr[ran][op1], arr[ran][op2]] = [arr[ran][op2], arr[ran][op1]];
          if (arr[ran]["answer"] == op1) {
            arr[ran]["answer"] = op2;
          } else if (arr[ran]["answer"] == op2) {
            arr[ran]["answer"] = op1;
          }
        }
      }

      questionList.push(arr[ran]);
      let tmp = arr[ran];
      arr[ran] = arr[arr.length - i - 1];
      arr[arr.length - i - 1] = tmp;
    }

    //加密答案
    let isEncrypt = event.encrypt;
    if (isEncrypt === true) {
      // do-something
    }

    allQuestionsList.push.apply(allQuestionsList, questionList);
  }

  return allQuestionsList;
}