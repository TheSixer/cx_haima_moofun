var http = require('../../../../service/request.js'),
    dealErr = require('../../../../util/err_deal.js')
Page({
  data:{
    mapOpacity: false,
    commentsOpacity: true,
    comments: [],
    cmtPage: 1,
    latitude: '',
    longitude: '',
    markers: [],
    chooseOne:'active'
  },
  pullUpLoad: function( e ) {
    var that = this
    var isLoading = that.data.isLoading

    if(!isLoading) {
      //loading动画
      dealErr.loading()

      that.setData( {
        page: that.data.page + 1
      })
      that.getComments()
    }
      

    console.log( "上拉拉加载更多...." + this.data.page )

  },
  getData: function() {//请求数据
    var that = this,
        url = that.data.APIUrl + '/moofun/dealer/' + that.data.dealer_id,
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps' ,
          comeFrom: 'miniApps'
        }

    http._get( url, data,
      function( res ) {
        //加载完成隐藏Toast
        // dealErr.hideToast()
        //错误处理
        dealErr.dealErr(res, function () {
          var data = res.data.data
          if(data.avg) {
            data.avg = '/image/page/star' + Math.round(data.avg) + '.png'
          } else {
            data.avg = '/image/page/star0.png'
          }
          // if(data.avatar == ''){
          //   data.avatar = {}
          //   data.avatar.middleUrl = '/image/page/store.png'
          //   data.avatar.originalUrl = '/image/page/store.png'
          // } else {
          //   data.avatar.middleUrl = data.avatar.middleUrl.replace(/http/, 'https')
          // }
          if(data.hasOwnProperty('comeFrom')) {
            if(data.comeFrom == '1') {
              data.buyCar = 1;
            } else if(data.comeFrom == '2') {
              data.gone = 1;
            } else {
              data.buyCar = 1;
              data.gone = 1;
            }
          }
          var arr = [{
            iconPth: '/image/destination.png',
            id: 0,
            latitude: data.latitude,
            longitude: data.longitude,
            height: 54,
            width: 34
          }]
          that.setData({
            info: data,
            markers: arr,
            latitude: data.latitude,
            longitude: data.longitude
          })
          //获取评论信息
          that.getComments()
        })
          
      }, function( res ) {
        dealErr.fail()
      });
  },
  call: function() {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.info.parts_tel,
      success: function(res) {
        // success
      }
    })
  },
  getComments: function () {
    var that = this,
        url = that.data.APIUrl + '/moofun/order/comment/' + that.data.dealer_id,
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps' ,
          comeFrom: 'miniApps',
          page: that.data.cmtPage
        }

    http._get( url, data,
      function( res ) {
        //加载完成隐藏Toast
        dealErr.hideToast()
        //错误处理
        dealErr.dealErr(res, function () {
          console.log(res)
          if(res.data.data) {
            var data = res.data.data

            for(var i = 0; i < data.length; i++) {
              if(!!data[i].head_photo.middleUrl)
                data[i].head_photo.middleUrl = data[i].head_photo.middleUrl.replace(/http/, 'https')
              else
                data[i].head_photo.middleUrl = '/image/page/store.png'
              
              console.log(data[i].head_photo.middleUrl)
              that.data.comments.push(data[i])
            }
            that.setData({
              hasComments: true,
              comments: that.data.comments
            })
          } else {
            that.setData({
              hasComments: false
            })
          }
        })
      }, function( res ) {
        dealErr.fail()
      });
  },
  onLoad:function(options){
  //进入页面显示加载动画
    dealErr.loading()
    // 页面初始化 options为页面跳转所带来的参数
    //获取全局data
    var that = this,
        app = getApp(),
        APIUrl = app.globalData.APIUrl

    that.setData({
      APIUrl: APIUrl
    })

    // 页面初始化 options为页面跳转所带来的参数
    that.setData({
      dealer_id: options.dealer_id
    })
    wx.getStorage({
      key: 'userInfo',
      success: function(res){
        if(res.data) {
          if(res.data.car.length === 0) {
            that.setData({
              carId: ''
            })
          } else {
            that.setData({
              carId: res.data.car[0].carId
            })
          }
          that.setData({
            userInfo: res.data
          })
        }
      },
      fail: function() {
        var userInfo = {
          user: {
            uid: '',
            accessToken: ''
          },
          car: {
            carId: ''
          }
        }
        that.setData({
          userInfo: userInfo
        })
      }
    })

    that.getData()
  },
  showMap: function() {
    this.setData({
      mapOpacity: false,
      commentsOpacity: true,
      chooseOne:'active',
      chooseTwo:''
    })
  },
  showComments: function() {
    var that = this 
    if(!that.data.commentsOpacity) {
      return false
    }

    that.setData({
      mapOpacity: true,
      commentsOpacity: false,
      chooseOne:'',
      chooseTwo:'active'
    })

    
  },
  //预约
  order: function() {
    var data = this.data.info,
        that = this

    wx.redirectTo({
      url: '../../../member/reservationServices/index?dealer_id=' + data.dealer_id + '&name=' + data.cn_fullname + '&address=' + data.address + '&uid=' + that.data.userInfo.user.uid + '&carId=' + that.data.carId + '&accessToken=' + that.data.userInfo.user.accessToken
    })
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('myMap')
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function(res){
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  onShow:function(){
    // 页面显示
    wx.getSystemInfo( {
      success: ( res ) => {
        this.setData( {
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})