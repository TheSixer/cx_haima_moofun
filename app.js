var config = require('./service/config.js')
App({
  onLaunch: function () {
    console.log('App Launch')
    var logs = wx.getStorageSync('logs') || []
    
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  getUserInfo:function(cb){
    var that = this;

    wx.getStorage({
      key: 'code',
      success: function(res) {
        typeof cb == "function" && cb(res)
      },
      fail: function(res) {
        typeof cb == "function" && cb(res)
      }
    })
    
  },
  globalData: {
    hasLogin: false,
    userInfo: null,
    APIUrl: config.config.api
  }
})
