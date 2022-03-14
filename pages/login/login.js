/**
 * 登录流程
 *  1.收集表单数据
 *  2.前端校验
 *    1)校验用户名是否合法
 *    2)如果合法 用户名和密码传给后端 -- 不合法提示用户重新输入
 * 3.后端校验
 *  1)获取前端传递过来的数据
 *  2）验证用户名是否存在
 *  3）验证密码是否正确
 *  4)用户名和密码全部正确返回相应数据 用户信息或者token
 */
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },
  // 登录
  async login() {
    const { phone, password } = this.data
    // 前端验证手机号
    if(!phone) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none' // error 失效
      })
      return
    }
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '用户名格式错误!',
        icon: 'none'
      })
      return
    }
    // 前端验证密码
    if(!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none' // error 失效
      })
      return
    }

    // 发送请求登录页面
    const res = await request('/login/cellphone', {phone, password, isLogin: true})
    if(res.code === 200){
      wx.showToast({
        title: '登录成功!',
        icon: 'success'
      })
      // 本地存储用户信息 跳转到个人中心页面
      wx.setStorage({
        key: 'userInfo',
        data: JSON.stringify(res.profile),
      })
      wx.reLaunch({url: '/pages/personal/personal'})

    } else if (res.code === 400) {
      wx.showToast({
        title: '手机号错误',
        icon: 'none'
      })
    } else if (res.code === 502) {
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '登录失败！',
        icon: 'none'
      })
    }

  },
  // 收集登录表单数据
  handleInput(event) {
    // console.log(event.currentTarget.id)
    const type = event.currentTarget.id
    // console.log(event.currentTarget.dataset.type)
    this.setData({
      [type]: event.detail.value
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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