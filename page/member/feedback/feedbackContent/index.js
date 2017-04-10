var http = require('../../../../service/request.js'),
    dealErr = require('../../../../util/err_deal.js'),
    app = getApp()
Page({
  data:{
    content: '',
    btnDis: true
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    var app = getApp()
    var APIUrl = app.globalData.APIUrl

    this.setData({
      APIUrl: APIUrl,
      uid: options.uid,
      username: options.username,
      type: options.type,
      accessToken: options.accessToken
    })
  },
  input: function(e) {
    var content = e.detail.value

    if(content === '') {
      this.setData({
        btnDis: true,
        content: content
      })
    } else {
      this.setData({
        btnDis: false,
        content: content
      })
    }
  },
  submit: function() {
    
    var that = this,
        token = '?clientId=haima_mini_apps&deviceId=miniApps&comeFrom=miniApps&accessToken=' + that.data.accessToken
    var url = that.data.APIUrl + '/moofun/feedback/miniApps/title' + token,
        data = {
          uid: that.data.uid,
          title: that.data.content,
          content: that.data.content,
          name: that.data.username,
          role: '1'
        }
      
      http._post(url, data, 
        function(res) {
        //统一处理
        dealErr.dealErr(res, function() {
          var title = '提交成功',
              tips = '感谢您对我们服务的支持！'
          
          dealErr.showTips(title, tips, function() {
            //跳转到初始页面
            wx.switchTab({
              url: '/page/member/index'
            })
          })
        })
      }, function(res) {
        //请求失败
        dealErr.fail()
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