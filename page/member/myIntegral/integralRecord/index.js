var http = require('../../../../service/request.js'),
    dealErr = require('../../../../util/err_deal.js'),
    app = getApp()
Page({
  data:{
    page: 1,
    array: [],
    isLoading: false
  },
  getData: function() {
    var that = this

    that.setData({
      isLoading: true
    })

    var url = that.data.apiUrl + '/moofun/integral/list/' + that.data.uid,
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps' ,
          comeFrom: 'miniApps',
          carId: that.data.carId,
          page: that.data.page,
          accessToken: that.data.accessToken
        }
    
    http._get(url, data, 
      function(res) {
        //统一处理
        dealErr.hideToast()
        dealErr.dealErr(res, function() {
          if(res.data.data.length === 0) {
            that.setData({
              empty: true
            })
          } else {
            for(var x in res.data.data) {
              that.data.array.push(res.data.data[x])
            }
            that.setData({
              isLoading: false,
              empty: false,
              array: that.data.array
            })
          }
        })
      }, function(res) {
        //请求失败
        dealErr.fail()
      })
    
  },
  pullUpLoad: function( e ) {
    var that = this

    if(that.data.isLoading) {
      return false
    }

    that.setData({
      page: that.data.page + 1
    })

    //loading动画
    dealErr.loading()

    that.getData()

  },
  onLoad:function(options){
    //loading
    dealErr.loading()
    // 页面初始化 options为页面跳转所带来的参数
    var that = this,
        APIUrl = app.globalData.APIUrl

    that.setData({
      uid: options.uid,
      carId: options.carId,
      accessToken: options.accessToken,
      apiUrl: APIUrl
    })

    //请求数据
    that.getData()
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