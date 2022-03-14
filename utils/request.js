/*
* 1. 封装功能函数
*   1. 功能点明确
*   2. 函数内部应该保留固定代码(静态的)
*   3. 将动态的数据抽取成形参，由使用者根据自身的情况动态的传入实参
*   4. 一个良好的功能函数应该设置形参的默认值(ES6的形参默认值)
* 2. 封装功能组件
*   1. 功能点明确
*   2. 组件内部保留静态的代码
*   3. 将动态的数据抽取成props参数，由使用者根据自身的情况以标签属性的形式动态传入props数据
*   4. 一个良好的组件应该设置组件的必要性及数据类型
*     props: {
*       msg: {
*         required: true,
*         default: 默认值，
*         type: String
*       }
*     }
*
* */
// 封装ajax请求
import config from './config.js'
export default (url, data = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      method,
      data,
      header: {
        // cookie一定得是字符串
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
      },
      success: (res) => {
        // 是否是已经登录状态
        if (data.isLogin){
          wx.setStorageSync('cookies', res.cookies)
        }
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}