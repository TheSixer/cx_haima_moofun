// page/mine/carInfo/index.js
var http = require('../../../service/request.js'),
    dealErr = require('../../../util/err_deal.js'),
    app = getApp()
Page({
  data:{
    pageNow: 1,
    list: [],
    num: 0,           //  显示第几辆车信息，从0开始
    justOne: true,     // 只有一辆车
    currentdate:'',
    allowedPull: true
  },
  // pullLeft: function() {
  //   var that = this
  //   if(that.data.car[0].hasOwnProperty("nowMileage")) {
  //     return false
  //   }
  //   dealErr.loading()

  //   that.getData(0)

  //   that.setData({
  //     allowedPull: false
  //   })
  //   console.log('left')
  // },
  // pullRight: function() {
  //   var that = this
  //   if(that.data.car[1].hasOwnProperty("nowMileage")) {
  //     return false
  //   }
  //   dealErr.loading()

  //   that.getData(1)

  //   that.setData({
  //     allowedPull: false
  //   })

  // },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this

    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var nowTime = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
            + seperator2 + (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds());
    that.setData({
        currentdate:nowTime
    })
    wx.getStorage({   //获取用户车信息
      key: 'userInfo',
      success: function(res) {
        if(!res.data.car || res.data.car.length === 0) {
          var title = '提示',
              tips = '您还没有绑定车辆，请下载Moofun APP绑定您的车辆！'

          dealErr.showTips(title, tips, function() {
            wx.navigateBack({
              delta: 1
            })
          })
        } else {
          that.setData({
            length: res.data.car.length,
            car: res.data.car,
            userInfo: res.data.user
          })
          
          if(res.data.car.length !== 1) {
            that.setData({
              justOne: false
            })
          }

          // dealErr.loading()    //加载动画
          //获取第一辆车
          // that.getData(0)
        }
      },
       fail: function(){
        var title = '未登录',
            tips = '登录后可查看车辆信息！'

        dealErr.showTips(title, tips, function() {
          wx.redirectTo({
            url: '../login/index'
          })
        })
      }
    })
  },
  getData: function (n) {
    var that = this,
        url = app.globalData.APIUrl + '/moofun/car/maintainPlan/'+that.data.car[n].carId,
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps',
          comeFrom: 'miniApps',
          // pageNow: that.data.pageNow,
          // vin: that.data.car[n].vin,
         // vin: 'LMVAFLFC0GA080994',
          carId:that.data.car[n].carId,
          accessToken: that.data.userInfo.accessToken
      }
    
    http._get(url, data, 
      function(res) {
        //统一处理
        dealErr.dealErr(res, function() {
          var list = res.data.data
          //将取到的数据添加到data中
          that.data.car[n].nowMileage = list.nowMileage

          that.setData({
            car: that.data.car,
            allowedPull: true
          })
          dealErr.hideToast()
            
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