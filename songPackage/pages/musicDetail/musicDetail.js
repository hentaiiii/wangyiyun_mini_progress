import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../../utils/request.js'
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicDetail: {},
    isPlay: false, // 是否正在播放
    musicId: '', // 当前音乐id
    musicLink: '', // 当前音乐的链接
    stattTime: '00:00', // 歌曲当前时长
    totalTime: '00:00', // 歌曲总时长
    progressWidth: 0, // 已经播放的进度条时长
  },

  // 切换歌曲的回调函数
  handleSwitch(event) {
    let type = event.currentTarget.id
    // 发布消息给recommendMusic页面
    PubSub.publish('switchType', type)
    // 订阅消息不能放这里面
    // 订阅来自recommendMusic页面的消息
    PubSub.subscribe('musicId', (msg, musicId) => {
      this.backgroundAudioManager.stop()
      // 刷新数据， 重新播放
      this.getMusicLink(musicId)
      this.getMusicDetail(musicId)
      this.musicControl(true, musicId)
      // 取消当前订阅
      PubSub.unsubscribe('musicId')
    })
  },

  // 播放音乐的回调函数
  handleMusicPlay() {
    let { isPlay, musicId } = this.data
    isPlay = !isPlay
    this.setData({
      isPlay
    })
    this.musicControl(isPlay, musicId)
  },

  // 控制音乐播放和暂停的功能函数
  async musicControl(isPlay, musicId) {
    /**这里调用getMusicLink会暂时获取不到数据 */
    let { musicLink } = this.data
    if (isPlay) { // 播放
      this.backgroundAudioManager.src = this.data.musicLink
      this.backgroundAudioManager.title = this.data.musicDetail.name
      // 修改全局播放标识
      appInstance.globalData.isMusicPlay = true
      appInstance.globalData.musicId = musicId
    }else {// 暂停
      this.backgroundAudioManager.pause()
      // 修改全局播放表示
      appInstance.globalData.isMusicPlay = true
      // appInstance.globalData.musicId = musicId
    }
  },
  // 获取音乐链接
  async getMusicLink(musicId) {
    const res = await request('/song/url', { id: musicId })
    this.setData({
      musicLink: res.data[0].url
    })
    this.backgroundAudioManager.src = this.data.musicLink
    this.backgroundAudioManager.title = this.data.musicDetail.name
  },

  // 获取音乐详情信息
  async getMusicDetail(id) {
    const res = await request('/song/detail', {ids: id})
    const totalTime = moment(res.songs[0].dt).format('mm:ss')
    this.setData({ 
      musicDetail: res.songs[0],
      totalTime
    })
    // 动态获取标题
    wx.setNavigationBarTitle({
      title: res.songs[0].name,
      totalTime: totalTime
    })
  },

  // 控制播放状态的封装函数
  changeMusicState(isPlay){
    this.setData({
      isPlay: isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.id
    this.setData({
      musicId
    })
    this.getMusicDetail(musicId)
    this.getMusicLink(musicId)

     // 判断当前音乐是否正在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === this.data.musicId){
      this.setData({
        isPlay: true
      })
    }

    // 创建控制音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager() // title 和 src必填
    
    // 监听音乐的播放/暂停/停止
    this.backgroundAudioManager.onPlay(() => {
      this.changeMusicState(true)
      appInstance.globalData.musicId = musicId
    })
    this.backgroundAudioManager.onPause(() => {
      this.changeMusicState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changeMusicState(false)
    })
    // 监听背景音频播放进度更新事件，只有小程序在前台时会回调
    this.backgroundAudioManager.onTimeUpdate(() => {
      // 实时获取数据
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      // 总进度条长 450  
      const progressWidth = (this.backgroundAudioManager.currentTime * 1000) / (this.data.musicDetail.dt) * 450
      this.setData({
        stattTime: currentTime,
        progressWidth
      })
    })
    // 监听播放结束
    this.backgroundAudioManager.onEnded(() => {
      // 可以封装
      PubSub.publish('switchType', 'next')
      PubSub.subscribe('musicId', (msg, musicId) => {
        this.backgroundAudioManager.stop()
        // 刷新数据， 重新播放
        this.getMusicLink(musicId)
        this.getMusicDetail(musicId)
        this.musicControl(true, musicId)
        // 取消当前订阅
        PubSub.unsubscribe('musicId')
      })
      this.setData({
        stattTime: '00:00', // 歌曲当前时长
        totalTime: '00:00', // 歌曲总时长
        progressWidth: 0, // 已经播放的进度条时长
      })
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