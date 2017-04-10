var http = require('../../../service/request.js'),
    dealErr = require('../../../util/err_deal.js')
Page({
  data:{
    location: {},
    list: [],
    page: 1,
    order: 0,
    isLoading: false    //是否请求中
  },
  pullUpLoad: function( e ) {
    var that = this

    if(that.data.isLoading) {
      return false
    }
    //loading动画
    dealErr.loading()

    that.getData()

  },
  distance: function () {   //距离排序
    var that = this

    if(that.data.isLoading) {
      return false
    }

    if(that.data.order === 0)
      return false;
    //清空list
    that.emptyList()

    //loading动画
    dealErr.loading()

    this.setData( {
      page: 1,
      order: 0
    })
    this.getData()
  },
  amount: function () {   //人气排序
    var that = this

    if(that.data.isLoading) {
      return false
    }
    
    if(that.data.order === 1)
      return false;
    //清空list
    that.emptyList()

    //loading动画
    dealErr.loading()

    that.setData( {
      page: 1,
      order: 1
    })
    that.getData()

  },
  comment: function () {   //评价排序
    var that = this

    if(that.data.isLoading) {
      return false
    }
    
    if(that.data.order === 2)
      return false;
    //清空list
    that.emptyList()
      
    //loading动画
    dealErr.loading()

    that.setData( {
      page: 1,
      order: 2
    })
    that.getData()
  },
  emptyList: function () {
    var that = this;

    that.setData({
      list: []
    })
  },
  getData: function() {//请求数据
    var that = this;

    //显示加载动画
    dealErr.loading()

    that.setData({    //正在请求。。。
      isLoading: true
    })

    var url = this.data.APIUrl + '/moofun/dealer',
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps' ,
          comeFrom: 'miniApps',
          page: that.data.page,
          order: that.data.order,
          carId: that.data.carId,
          latitude: that.data.location.latitude,
          longitude: that.data.location.longitude,
        }
    http._get( url, data,
      function( res ) {
        
        //统一处理
        dealErr.dealErr(res, function() {
          //请求成功，页数加1
          that.setData( {
            page: that.data.page + 1
          })

          var data = res.data.data;

          for(var i = 0; i < data.length; i++) {
            // if(!!data[i].avatar.middleUrl)
            //   data[i].avatar.middleUrl = data[i].avatar.middleUrl.replace(/http/, 'https')
            // else
              data[i].avatar.middleUrl = '/image/page/store.png'
            
            if(data[i].avg) {
              data[i].avg = '/image/page/star' + Math.round(data[i].avg) + '.png'
            } else {
              data[i].avg = '/image/page/star0.png'
            }
            if(data[i].hasOwnProperty('distance')) {
              data[i].distance = data[i].distance.toFixed(2)
              data[i].distance = data[i].distance + 'km'
            }
            
            if(data[i].hasOwnProperty('comeFrom')) {
              if(data[i].comeFrom == '1') {
                data[i].buyCar = 1;
              } else if(data[i].comeFrom == '2') {
                data[i].gone = 1;
              } else {
                data[i].buyCar = 1;
                data[i].gone = 1;
              }
            }

            that.data.list.push(data[i])
          }
          
          that.setData({
            list: that.data.list,
            isLoading: false
          })
          //请求完成，隐藏加载Toast
          dealErr.hideToast()
        })

      }, function( res ) {
        dealErr.fail()
      });
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    //获取全局data
    var that = this
    var app = getApp()
    var APIUrl = app.globalData.APIUrl

    this.setData({
      carId: options.carId,
      APIUrl: APIUrl
    })

    //获取当前位置
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        //将位置信息保存到data
        that.setData({
          location: {
            latitude: latitude,
            longitude: longitude,
            speed: speed,
            accuracy: accuracy
          }
        })

        //请求数据
        that.getData()
      },
      fail: function() {
        wx.redirectTo({
          url: '../../member/refuse/index'
        })
        // that.setData({
        //   location: {
        //     latitude: '0',
        //     longitude: '0'
        //   }
        // })

        // //请求数据
        // that.getData()
      }
    })

  },
  selectCities:function(){
    wx.navigateTo({
      url: '../selectCities/index'
    })
  },
  onReady:function(){
    // 页面渲染完成
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