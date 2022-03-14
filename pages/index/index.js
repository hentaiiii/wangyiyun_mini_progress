import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [],
    topList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
  },
  goRecommendPage() {
    wx.navigateTo({
      url: "/songPackage/pages/recommendMusic/recommendMusic"
    })
  },
  // 数据初始化
  async initData() {
    // 获取banner数据
    let banners = await request('/banner', {type: 2})
    this.setData({
      bannerList: banners.banners
    })
    // 获取推荐歌单
    let recommendList = await request('/personalized', {limit: 10})
    this.setData({
      recommendList: recommendList.result
    })
    // 获取排行榜数据
    // 主要0-4 榜单歌曲只要前三首
    let index = 0
    let topList = []
    while(index < 5) {
      let topListData = await request('/top/list', {idx: index++})
      let topListItem = { name: topListData.playlist.name, tracks: topListData.playlist.tracks.splice(0, 3)}
      topList.push(topListItem)
    }
    this.setData({
      topList
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