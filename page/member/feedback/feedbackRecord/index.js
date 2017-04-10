// page/member/feedbackrecord/index.js
var http = require('../../../../service/request.js'),
    dealErr = require('../../../../util/err_deal.js')
var app = getApp()
Page({
  data:{
    page: 1,
    list: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this

    dealErr.loading()    //加载动画

    wx.getStorage({   //获取用户车信息
      key: 'userInfo',
      success: function(res) {
        if(res.data) {
          that.setData({
            userInfo: res.data.user
          })
          
          that.getData(0)
        }
        console.log(that.data.car)
      }
    })
  },
  getData: function (n) {
    var that = this,
        url = app.globalData.APIUrl + '/moofun/feedback/'+that.data.userInfo.uid,
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps',
          comeFrom: 'miniApps',
          pageNum: that.data.page,
          accessToken: that.data.userInfo.accessToken
        }
    
    http._get(url, data, 
      function(res) {
        //统一处理
        dealErr.hideToast()
        dealErr.dealErr(res, function() {
          var list = res.data.data
          //将取到的数据添加到data中
          for(var i = 0; i < list.length; i++)
            that.data.list.push(list[i])
          
          that.setData({
            list: that.data.list,
            amount: that.data.list.length
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
  },
  onPullDownRefresh: function(){
    wx.stopPullDownRefresh()
  }
})