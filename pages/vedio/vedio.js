// pages/vedio/vedio.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoTitleList: [], // 视频标题列表
    videoList: [], // 每个标题下面的列表
    navId:'', // 当前视频标题的id
    videoId: '', // 当前播放video的id
    videoUpdateTime: [], // 记录视频播放的时长
    triggered: false, // 控制下拉刷新

  },
  // 获取对应标题的视频列表
  async getVideoList(id){
    if (!id) { // 判断navId为空串的情况
      return;
    }
    const res = await request('/video/group', {id})
    // 关闭消息提示框
    wx.hideLoading()

    let index = 0
    const videoList = res.datas.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList,
      triggered: false // 关闭上拉刷新状态
    })
  },
  // 获取视频标题的列表
  async getVideoTitleList() {
    const res = await request('/video/group/list')
    this.setData({
      // splice 和slice的区别: slice不修改原数据 splice修改原数据
      videoTitleList: res.data.slice(0,14),
      navId: res.data.slice(0, 14)[0].id
    })
    this.getVideoList(this.data.navId)
  },
  // nav导航切换的回调函数
  changeNav(event) {
    this.setData({
      navId: event.currentTarget.dataset.id >>> 0,
      videoList: []
    })
    // 打开消息提示框
    wx.showLoading({
      title: '正在加载'
    })
    this.getVideoList(this.data.navId)
  },
  // 视频播放时候的回调函数
  handlePlay(event) {
    /**
     * 问题：多个视频同时播放的问题
     * 需求：
     *  1.找到上一个播放的视频
     *  2.播放视频时关闭上一个视频
     */
    let vid = event.currentTarget.id
    // 当图片代替video的时候不需要考虑多个视频同时播放的问题
    // undefined或者有值
    // this.vid !== vid && this.videoContext && this.videoContext.stop()
    // this.vid = vid
    this.setData({
      videoId: vid
    })
    // 点一下自动播放
    // let { videoUpdateTime } = this.data
    this.videoContext = wx.createVideoContext(vid)
    const { videoUpdateTime } = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if (videoItem){
      this.videoContext.seek(videoItem.currentTime);
    }
    this.videoContext.play()
  },
  // 视频播放进度变化时的回调函数
  handleTimeUpdate(event) {
    const { currentTime, duration } = event.detail
    let videoTimeObj = { vid: event.currentTarget.id, currentTime }
    let { videoUpdateTime} = this.data
    // videoUpdateTime中之前有没有播放过
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if (videoItem) {
      // 之前有
      videoItem.currentTime = videoTimeObj.currentTime
    }else {
      // 之前没有
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },
  // 视频播放结束的回调
  handleEnded(event) {
    let { videoUpdateTime } = this.data
    let vid = event.currentTarget.id
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => {item.vid === vid}),1)
  },
  // 下拉刷新的回调函数
  handleFresherrefresh() {
    this.getVideoList(this.data.navId)
  },
  // scrollView滑动到底部的回调
  handleScrolltolower() {
    console.log('在这里加载更多....')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoTitleList()
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
    console.log('用户有下拉动作')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('页面上拉触底')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (type) {
    // menu(全局转发) button(局部转发按钮）
    return {
      title: '自定义的转发内容',
      page: '/pages/video/video',
      imageUrl: '/static/images/nvsheng.jpg'
    }
  }
})