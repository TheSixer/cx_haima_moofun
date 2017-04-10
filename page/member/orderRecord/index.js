var http = require('../../../service/request.js')
var app = getApp()
Page({
  data:{
    page: 1,
    list: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this

    that.loading()    //加载动画

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
        url = app.globalData.APIUrl + '/moofun/tianmao/order/'+that.data.userInfo.uid,
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps',
          comeFrom: 'miniApps',
          pageNum: that.data.page,
          buyerId:that.data.userInfo.uid,
          accessToken: that.data.userInfo.accessToken
        }
    
    http._get(url, data, 
      function(res) {
        //请求成功，隐藏动画
        that.hideToast()
        
        if(res.data.code === 200) {
          var list = res.data.data
          //将取到的数据添加到data中
          for(var i = 0; i < list.length; i++)
            that.data.list.push(list[i])
          
          that.setData({
            list: that.data.list,
            amount: that.data.list.length
          })
        } else {
          var title = '错误',
              txt = res.data.message

          that.showModal(title, txt)
        }
      }, function (res) {
        console.log(res)
      })
  },
  showModal: function(title, content) {   //弹出提示框

    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },
  loading: function() {   //加载中
    wx.showToast({
      icon: 'loading',
      duration: 10000
    })
  },
  hideToast: function() {   //隐藏加载中动画
    wx.hideToast()
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