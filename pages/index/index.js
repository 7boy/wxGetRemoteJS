// 这里依赖了eval5   为了缩小体积 我把用到的东西提取出来了
import {Interpreter} from "../../utils/eval5/interpreter/main";
// 获取应用实例
const app = getApp()
Page({
  async onLoad() {
    let res = await this.loadJS('https://onein.7coder.top/lib/dayjs.min.js', 'dayjs')
    // 存储在globalData方便全局调用
    app.globalData.dayjs = res
    this.setData({
      time: app.globalData.dayjs().format('YYYY-MM-DD')
    })
  },
  loadJS(url, type) {
    let obj = {}
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        success(res) {
          // 常用的函数传进去 
          var interpreter = new Interpreter(obj, {
            timeout: 2000,
            console: console,
            setTimeout: setTimeout,
            clearTimeout: clearTimeout,
            setInterval: setInterval,
            clearInterval: clearInterval,
            wx: typeof wx === "undefined" ? undefined : wx,
            globalContextInFunction: obj
          });
          // 只能解析es5 不需要mudel.export 直接能拿到里面的内容
          interpreter.evaluate(res.data);
          resolve(obj[type])
        }
      })
    })
  },
})
