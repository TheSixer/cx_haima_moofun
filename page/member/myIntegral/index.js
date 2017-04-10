var http = require('../../../service/request.js'),
    dealErr = require('../../../util/err_deal.js'),
    app = getApp()
Page({
  data:{
    array: []
  },
  getData: function() {
    //进入页面显示加载动画
    dealErr.loading()
    
    var that = this
    var url = that.data.APIUrl + '/moofun/integral/' + this.data.uid,
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps' ,
          comeFrom: 'miniApps',
          carId: that.data.carId,
          accessToken: that.data.accessToken
        }
    
    http._get(url, data, 
      function(res) {
        //统一处理
        dealErr.hideToast()
        dealErr.dealErr(res, function() {
          var arr = [1, 6, 9, 10, 11, 12, 13, 16, 25],
              array = []

          for(var x in res.data.data.list) {
            for(var y in arr){
              if(res.data.data.list[x].id == arr[y])
                array.push(res.data.data.list[x])
            }
          }
          that.setData({
            array: array,
            score: res.data.data.score
          })
        })
      }, function(res) {
        //请求失败
        dealErr.fail()
      })

  },
  getStorage: function() {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        console.log(res)
        if(res.data) {
          if(res.data.car && res.data.car.length !== 0) {
            that.setData({
              carId: res.data.car[0].carId
            })
          } else  {
            that.setData({
              carId: ''
            })
          }
          that.setData({
            hasLogin: true,
            userInfo: res.data,
            uid: res.data.user.uid,
            accessToken: res.data.user.accessToken
          })
          //取到缓存数据，发起请求
          that.getData()
        }
      },
      fail: function(){
        var title = '未登录',
            tips = '登录后可查看积分！'

        dealErr.showTips(title, tips, function() {
          wx.redirectTo({
            url: '../login/index'
          })
        })
      }
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    //获取全局data
    var that = this;
    var app = getApp()
    var APIUrl = app.globalData.APIUrl

    this.setData({
      APIUrl: APIUrl
    })

    that.getStorage()
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