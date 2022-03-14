// pages/personal/personal.js
import request from '../../utils/request.js'
let startY = 0
let moveY = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coverTranform: '',
    coverTransition: 'transform .5s linear',
    userInfo: {}, // 用户信息
    recentPlayList: [] // 最近播放记录
  },
  // 跳转登录页
  toLoginPage(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  // 动画三连环回调
  handleTouchStart(event){
    // 清除过渡
    this.setData({
      coverTransition: ''
    })
    startY = event.touches[0].clientY
  },
  handleTouchMove(event) {
    moveY = event.touches[0].clientY - startY
    if (moveY < 0){
      return
    } else if (moveY >= 80){
      moveY = 80
    }
    this.setData({
      coverTranform: `translateY(${moveY}rpx)`
    })
  },
  handleTouchEnd() {
    this.setData({
      coverTranform: ''
    })
  },
  // 获取播放记录
  async getRecentPalyList(uid){
    let index = 0
    const res = await request('/user/record', { uid, type: 0 })
    let allData = res.allData.splice(0,10).map(item => {
      item.id = index++
      return item
    })
    this.setData({
      recentPlayList: allData
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({
          userInfo: JSON.parse(res.data)
        })
        // 获取播放记录
        this.getRecentPalyList(this.data.userInfo.userId)
      },
    })
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