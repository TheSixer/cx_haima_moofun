var http = require('../../../service/request.js'),
    dealErr = require('../../../util/err_deal.js')
Page({
  data:{
    page: 1,
    hasActivity: true,
    activities: []
  },
  onLoad:function(options){
      var that = this
    // 页面初始化 options为页面跳转所带来的参数
    var app  = getApp()

    that.setData({
      url: app.globalData.APIUrl
    })

    that.getData()
  },
  getData: function() {
    var that = this

    var url = that.data.url + '/moofun/miniapp/activity',
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps' ,
          comeFrom: 'miniApps',
          'type': '2',
          status: '1',
          pageCount: 10,
          page: that.data.page
        }
    
    http._get(url, data, 
      function(res) {
        dealErr.dealErr(res, function() {
          if(res.data.data.total === 0) {
            that.setData({
              hasActivity: false
            })
          } else {
            var arr = res.data.data.list,
                url = res.data.data.url
            for(var x in arr) {
              arr[x].imgUrl = url + arr[x].imgUrl
              that.data.activities.push(arr[x])
            }
            that.setData({
              activities: that.data.activities
            })
          }
            
        })
      }, function(res) {
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