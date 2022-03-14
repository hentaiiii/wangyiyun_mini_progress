import PubSub from 'pubsub-js'
import request from '../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    musicList: [],
    index: 0
  },
  // 点击歌曲的回调函数
  goMusicDetailPage(event) {
    const index = event.currentTarget.dataset.index
    const id = event.currentTarget.id
    this.setData({
      index
    })
    wx.navigateTo({
      url: `/songPackage/pages/musicDetail/musicDetail?id=${id}`,
    })

  },
  // 获取每日推荐音乐列表
  async getMuiscList() {
    const res = await request('/recommend/songs')
    this.setData({
      musicList: res.recommend
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    this.getMuiscList()

    // 订阅来自musicDetail的消息
    PubSub.subscribe('switchType', (msg, type) => {
      let { index, musicList } = this.data
      if(type === 'next'){ // 下一首
        index = index === (musicList.length - 1) ? -1 : index
        index +=1
      }else { // 上一首
        index = index === 0 ? index = musicList.length : index
        index -= 1
      }
      this.setData({
        index
      })
      // 发布消息给musicDetail页面
      let musicId = musicList[index].id
      PubSub.publish('musicId', musicId)
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