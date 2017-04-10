// page/visitor/moofun/index.js
Page({
  data:{},
  saveBarcode: function () {
    wx.downloadFile({
      url: '/image/moofun/moofunCode.png', //仅为示例，并非真实的资源
      success: function(res) {
        var tempFilePath = res.tempFilePath
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function(res) {
            var savedFilePath = res.savedFilePath
          }
        });
      }
    });
  },
  downloadFile: function() {
    var that = this
    wx.downloadFile({
      url: that.data.url + '/moofun/views/download.jpg', 
      success: function(res) {
        var tempFilePath = res.tempFilePath
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function(res) {
            var savedFilePath = res.savedFilePath
            console.log('save success')
          }
        })
      }
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var app  = getApp()

    var api = app.globalData.APIUrl

    this.setData({
      url: api
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})