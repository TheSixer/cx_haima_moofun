var dealErr = require('../../../util/err_deal.js')
Page({
  data:{
    accessToken: ''
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    if(!options.uid) {
      var title = '未登录',
          tips = '请先登录！'

      dealErr.showTips(title, tips, function() {
        wx.redirectTo({
          url: '../login/index'
        })
      })
    }
    this.setData({
      uid: options.uid,
      username: options.username,
      accessToken: options.accessToken
    })
    console.log(options)
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