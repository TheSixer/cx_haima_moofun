var http = require('../../service/request.js'),
    dealErr = require('../../util/err_deal.js')
var app = getApp()
Page({
  data: {
    hasLogin: false,
    userInfo: {},
    userName: '点击登录',
    sign: "签到",
    hasSign: false,
    userHead: '/image/user/userhead.png',
    btnDisabled: false,
    integralOpacity: 0,
    animationData: {},
    isLoading: false
  },
  toLogin:function() {
    wx.navigateTo({
      url: 'login/index'
    })
  },
  logout: function() {
    wx.clearStorage()
    wx.redirectTo({
      url: 'login/index'
    })
  },
  sign: function () {
    this.setData({
      integralOpacity: 1
    })

    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0',
      success: function(res) {
        console.log(res);
      }
    });

    this.animation = animation;
    animation.opacity(0).translateY(-30).step();

    this.setData({
      isLoading: false,
      hasSign: true,
      sign: "已签到",
      animationData:animation.export()
    })
  },
  http_sign: function() {
    if(!this.data.hasLogin) {
      var title = '提示',
          tips = '您还未登陆账号，请先登录！'

      dealErr.showTips(title, tips, function(){})

      return false
    }
    if(this.data.isLoading) {
      return false
    }
    this.setData({
      isLoading: true
    })
    //loading
    dealErr.loading()

    var that = this,
        token = '?clientId=haima_mini_apps&deviceId=miniApps&comeFrom=miniApps&accessToken=' + that.data.accessToken
    var url = that.data.APIUrl + '/moofun/integral/miniApps' + token,
        data = {
          uid: that.data.userInfo.user.uid,
          carId: that.data.carId
        }

    http._post(url, data, 
      function(res) {
        //统一处理
        dealErr.dealErr(res, function() {
          //success
          dealErr.hideToast()
          //改变状态
          that.sign()
        })
      }, function(res) {
        //处理失败
        dealErr.fail()
      })
  },
  getData: function() {   //获取积分，判断是否签到

    dealErr.loading()

    var that = this
    var url = that.data.APIUrl + '/moofun/integral/' + this.data.userInfo.user.uid,
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
          var data = res.data.data.list
          for(var x in data) {
            if(data[x].id == 1 && data[x].status === '1') {
              that.setData({
                hasSign: true,
                sign: "已签到"
              })
            }
          }
        })
      }, function (res) {
        //处理失败
        dealErr.fail()
      })
  },
  getStorage: function() {
    var that = this
    //调用应用实例的方法获取全局数据
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        
        if(res.data.user) {
          that.setInfo(res.data)
        }
      } 
    })
  },
  setInfo: function(info) {
    var that = this

    that.setData({
      hasLogin: true,
      userInfo: info,
      accessToken: info.user.accessToken
    })
    if(info.car && info.car.length !== 0) {
      that.setData({
        carId: info.car[0].carId
      })
      app.globalData.carId = info.car[0].carId
    } else {
      that.setData({
        carId: ''
      })
      app.globalData.carId = ''
    }
    if(info.user.nickName) {
      that.setData({
        userName: info.user.nickName
      })
    } else {
      that.setData({
        userName: info.user.username
      })
    }
    app.globalData.accessToken = info.user.accessToken

    if(info.user.realHeadUrl) {
      that.setData({
        userHead: info.user.realHeadUrl.middleUrl
      })
    }
    console.log(that.data.userHead)
      

    // //获取积分，判断是否签到
    if(that.data.hasSign)
      return false
    else
      that.getData()
  },
  onPullDownRefresh: function(){
    //重新获取用户数据
    this.refresh()

  },
  refresh: function() {
    var that = this,
        accessToken = that.data.userInfo.user.accessToken
    var url = that.data.APIUrl + '/moofun/user/' + that.data.userInfo.user.uid,
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps' ,
          comeFrom: 'miniApps',
          accessToken: accessToken
        }
    
    http._get(url, data, 
      function(res) {
        dealErr.dealErr(res, function() {
          wx.stopPullDownRefresh()
          res.data.data.user.accessToken = accessToken
          wx.setStorage({
            key: 'userInfo',
            data: res.data.data
          })
          that.setInfo(res.data.data)
        })
      }, function(res) {
        wx.stopPullDownRefresh()
        dealErr.fail()
      })
  },
  onLoad: function () {
    var that = this
    //如果用户已登录，获取用户本地信息
    // if(!that.data.hasLogin)
      // that.getStorage()
    
    var APIUrl = app.globalData.APIUrl

    this.setData({
      APIUrl: APIUrl
    })

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var that = this
    //如果用户已登录，获取用户本地信息
    that.getStorage()
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})
