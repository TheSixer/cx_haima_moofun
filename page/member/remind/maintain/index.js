var http = require('../../../../service/request.js'),
    dealErr = require('../../../../util/err_deal.js')
Page({
  data:{
    index: 0,
    status: false,   //提醒状态
    remindMileage: 4,   // 剩余公里数序号
    remindMileageArr: [],
    remindDays: 14,   //提醒日期
    remindDayArr: [],   //提醒日期数组
  },
  switchChange:function(e){   //是否提醒
      this.setData({
          status: e.detail.value
      })   
  },
  changeRemindMileage:function (e) {   //剩余公里数
    this.setData({
      remindMileage: e.detail.value
    })
  },
  changeRemindDays:function (e) {   //提醒日期
    this.setData({
      remindDays: e.detail.value
    })
  },
  getData: function () {
    var that = this
    var url = that.data.APIUrl + '/moofun/remind/' + that.data.uid,
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps',
          comeFrom: 'miniApps',
          carId: that.data.carId,
          accessToken: that.data.accessToken
        }
    
    http._get(url, data, 
      function(res) {
        //隐藏动画loading
        dealErr.hideToast()
        dealErr.dealErr(res, function() {
          //判断提醒是否存在，不存在则新增（post），存在则修改（put）
          if(res.data.data.maintainLicense) {
            var data = res.data.data.maintainLicense
            
            that.setData({
              requestTypePost: false,
              id: data.id
            })
            //是否提醒
            if(data.status === '0') {
              that.setData({
                status: true   //0默认开启
              })
            } else {
              that.setData({
                status: false
              })
            }
            //剩余公里数
            if(data.remindMileage) {
              that.setData({
                remindMileage: parseInt(data.remindMileage)/100 - 1
              })
            }
            //提醒日期
            if(data.remindDays) {
              that.setData({
                remindDays: parseInt(data.remindDays) - 1
              })
            }
          } else {
            that.setData({
              requestTypePost: true
            })
          }
        })
      }, function(res) {
        dealErr.fail()
      })
  },
  submitRemind: function () {
    //loading
    dealErr.loading()

    var that = this,
        token = '?clientId=haima_mini_apps&deviceId=miniApps&comeFrom=miniApps&accessToken=' + that.data.accessToken
    var url = that.data.APIUrl + '/moofun/remind/maintain/miniApps' + token,
        data = {
          uid: that.data.uid,
          carId: that.data.carId,
          remindMileage: (parseInt(that.data.remindMileage) + 1)*100,
          remindDays: parseInt(that.data.remindDays) + 1,
          status: that.data.status?'0':'1'
        }

    if(that.data.requestTypePost) {
      http._post(url, data, 
        function(res) {
          //隐藏动画loading
          dealErr.succeed('保存成功！')
          dealErr.dealErr(res, function() {
            //跳转至前一页
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          })
        }, function(res) {
          dealErr.fail()
        })
    } else {
      url = that.data.APIUrl + '/moofun/remind/maintain/miniApps/' + that.data.id + token  //修改需要id

      http._put(url, data, 
        function(res) {
          //隐藏动画loading
          dealErr.succeed('保存成功！')
          dealErr.dealErr(res, function() {
            //跳转至前一页
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          })
        }, function(res) {
          dealErr.fail()
        })
    }
  },
  onLoad:function(options){
    //loading
    dealErr.loading()
    // 页面初始化 options为页面跳转所带来的参数
    //获取全局data
    var that = this;
    var app = getApp()
    var APIUrl = app.globalData.APIUrl

    this.setData({
      APIUrl: APIUrl
    })

    that.setData({
      uid: parseInt(options.uid),
      carId: options.carId,
      accessToken: options.accessToken
    })
    
    //创建提醒日期数组
    for(var i = 1; i <= 10; i++) {
      var str = '提前' + i*100 + '公里'
      
      that.data.remindMileageArr.push(str)
      that.setData({
        remindMileageArr: that.data.remindMileageArr
      })
    }
    //创建剩余公里数数组
    for(var i = 1; i <= 100; i++) {
      var str = '提前' + i + '天'
      
      that.data.remindDayArr.push(str)
      that.setData({
        remindDayArr: that.data.remindDayArr
      })
    }
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