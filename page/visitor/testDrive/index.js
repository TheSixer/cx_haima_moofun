var http = require('../../../service/request.js'),
    dealErr = require('../../../util/err_deal.js'),
    app = getApp()
Page({
  data: {
     ordering: true,
     bg:true,
     storeList:true,
     carNumber:1,
     value: [0, 0, 0],
     values: [0, 0, 0],
     condition: false,

     loading: false,
     isloading: false,
     page: 1,
     list: [],
     cid: '',
     thisCar: 'S5',
     present: '附近4S店',
     selected: true,
     name: '未选择门店',
     address: '门店地址',
     selectName: '未选择门店',
     selectAddress: '门店地址'
  },
  toMoofun: function() {
    wx.navigateTo({
      url: '../moofun/index'
    })
  },
  showS5: function(){
    this.setData({
      ordering:false,
      bg:false,
      body: '海马-S5试驾',
      thisCar: 'S5'
    })
  },
  showM3: function(){
    this.setData({
      ordering:false,
      bg:false,
      body: '海马-M3试驾',
      thisCar: 'M3'
    })
  },
  showM6: function(){
    this.setData({
      ordering:false,
      bg:false,
      body: '海马-M6试驾',
      thisCar: 'M6'
    })
  },
  showStoreList: function() {
    var that = this

    that.setData({
      ordering: true,
      storeList: false,
      list: []
    })

    that.getStoreList()
  },
  pullUpLoad: function( e ) {
    var that = this

    if(that.data.isloading) {
      return false
    }
    //loading动画
    dealErr.loading()

    that.setData( {
      page: that.data.page + 1
    })
    that.getStoreList()
  },
  orderNow: function() {
    var that = this
    if(!app.globalData.accessToken) {
      var title = '提示',
          tips = '请先登录'

      dealErr.showTips(title, tips, function() {
        that.close()
      })
      return false
    } else if(!this.data.dealerId) {
      var title = '提示',
          tips = '请选择门店'

      dealErr.showTips(title, tips, function() {})
      return false
    }
    dealErr.loading()
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(res){
      if(res.data) {    //如果已有登录信息 则直接获取openId
        that.setData({
          code: res.data
        })
        //如果openID存在则直接支付，否则获取openID
        wx.getStorage({ 
          key: 'openId',
          success: function(res){
            // success
            that.payment(res.data)
          },
          fail: function(res) {
            that.getOpenId()
          }
        })
        
      } else {    //否则重新登录
        //调用登录接口
        wx.login({
          success: function (res) {
            console.log(res)
            that.setData({
              code: res.code
            })

            wx.setStorage({
              key: 'code',
              data: res.code
            })
            //登录成功，获取openID
            that.getOpenId()
          },
          fail: function(res) {
            console.log(res)
          }
        })
      }
    })
  },
  getOpenId: function() {
    dealErr.loading()
    var that = this
    var url = that.data.url + '/moofun/weixin/openid',
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps' ,
          comeFrom: 'miniApps',
          code: that.data.code,
          accessToken: app.globalData.accessToken
        }
    
    http._get(url, data,
      function(res) {
        dealErr.dealErr(res, function() {
          var openId = res.data.data.openid
          console.log(res.data.data.openid)
          wx.setStorage({
            key: 'openId',
            data: openId,
            success: function(res) {
              that.payment(openId)
            }
          })
        })
      }, function(res) {
        dealErr.fail()
      })
  },
  payment: function(openId) {
    dealErr.loading()
    var that = this
    var data = '&openid='+ openId + '&body=' + that.data.body + '&fee=1&attach=' + that.data.dealerId
    var token = '?clientId=haima_mini_apps&deviceId=miniApps&comeFrom=miniApps&accessToken=' + app.globalData.accessToken + data
    var url = that.data.url + '/moofun/weixin/pay/unifiedorder' + token,
        data = {
          // openid: 'oxWXr0K4DmrziW58P_n-qqD5AP-g',
          // body: that.data.body,
          // fee: '1',
          // attach: 'test'
        }
    
    http._post(url, data,
      function(res) {
        dealErr.dealErr(res, function() {
          dealErr.hideToast()
          if(res.data.return_msg === 'OK') {
            var appId = res.data.appid,
                timeStamp = res.data.timeStamp,
                nonce_str = res.data.nonce_str,
                pkg = res.data.package,
                paySign = res.data.paySign,
                signType = res.data.signType

            wx.requestPayment({
              // 'appId': appId,
              'nonceStr': nonce_str,
              'paySign': paySign,
              'package': pkg,
              'signType': signType,
              'timeStamp': timeStamp,
              'success':function(res){
                var title = '提示',
                    str = '支付成功'
                
                dealErr.showTips(title, str, function() {
                  that.close()
                })
              },
              'fail':function(res){
                
                var title = '提示',
                    str = '支付失败！'
                
                dealErr.showTips(title, str, function() {
                  that.close()
                })
              }
            })
          }
        })
      }, function(res) {
        dealErr.fail()
      })
  },
  getStoreList: function() {//请求数据
    var that = this;
    //未获取授权
    if(!that.data.cid && !that.data.latitude) {
      return false
    }
    //显示加载动画
    dealErr.loading()

    that.setData({    //正在请求。。。
      isloading: true
    })

    var url = this.data.url + '/moofun/dealer',
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps' ,
          comeFrom: 'miniApps',
          page: that.data.page,
          // order: '0',
          city: that.data.cid,
          latitude: that.data.latitude,
          longitude: that.data.longitude,
        }
    http._get( url, data,
      function( res ) {
        that.setData({    //请求完成
          isloading: false
        })
        //请求完成，隐藏加载Toast
        dealErr.hideToast()
        //统一处理
        dealErr.dealErr(res, function() {
          var data = res.data.data;

          for(var i = 0; i < data.length; i++) {
            if(!!data[i].avatar.middleUrl)
              data[i].avatar.middleUrl = data[i].avatar.middleUrl.replace(/http/, 'https')
            else
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
            that.data.list.push(data[i])
          }
          
          that.setData({
            list: that.data.list
          })
        })

      }, function( res ) {
        dealErr.fail()
      });
  },
  selectCities:function(){
    wx.navigateTo({
      url: '../selectCities/index'
    })
  },
  radioChange: function(e) {
    
    var arr = e.detail.value.split(",")
    var id = arr[0],
        name = arr[1],
        address = arr[2]

    this.setData({
      dealerId: id,
      selectName: name,
      selectAddress: address,
      selected: false
    })
  },
  comfirm: function() {
    var that = this
    if(that.data.selected) {
      var title = '提示',
          tips = '请选择门店！'
      dealErr.showTips(title, tips, function(){})

      return false 
    }
    this.setData({
      name: this.data.selectName,
      address: this.data.selectAddress
    })
    that.back()
  },
  close:function(){   //关闭预约
    this.setData({
      ordering:true,
      bg:true
    })
  },
  back:function(){  //返回
    this.setData({
      storeList:true,
      ordering:false,
      selected: true,
      selectName: this.data.name,
      selectAddress: this.data.address
    })
  },
  open:function(){
    this.setData({
      condition:!this.data.condition
    })
  },
  onLoad: function (options) {
    var that = this
    
    var api = app.globalData.APIUrl

    that.setData({
      url: api
    })
    //是否由车型鉴赏跳转
    if(options.car) {
      var car = options.car
      if(car === '3') {
        that.showM3()
      } else if(car === '5') {
        that.showS5()
      } else {
        that.showM6()
      }
    }
    wx.getSystemInfo( {
      success: ( res ) => {
        this.setData( {
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })

    that.getLocation()
  },
  getLocation: function() {
    var that = this
    //获取当前位置
    if(that.data.origin_latitude) {
      that.setData({
        cid: '',
        present: '附近4S店',
        latitude: that.data.origin_latitude,
        longitude: that.data.origin_longitude,
        page: 1,
        list: []
      })

      that.getStoreList()
    } else {
      wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          var latitude = res.latitude
          var longitude = res.longitude
          var speed = res.speed
          var accuracy = res.accuracy
          //将位置信息保存到data
          that.setData({
            present: '附近4S店',
            latitude: latitude,
            longitude: longitude,
            origin_latitude: latitude,
            origin_longitude: longitude,
          })
        },
        fail: function() {
          that.setData({
            present: '无法获取当前位置',
            latitude: '0',
            longitude: '0'
          })
        }
      })
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var that = this

    if(app.globalData.cid) {

      that.setData({
        cid: app.globalData.cid,
        present: app.globalData.cName,
        latitude: '',
        longitude: '',
        page: 1,
        list: []
      })
      
      that.getStoreList()
    } else {
      if(that.data.origin_latitude) {
        that.setData({
          cid: '',
          present: '附近4S店',
          latitude: that.data.origin_latitude,
          longitude: that.data.origin_longitude,
          page: 1,
          list: []
        })
      } else {
        that.setData({
          cid: '',
          present: '无法获取当前位置',
          latitude: '0',
          longitude: '0',
          page: 1,
          list: []
        })
      }
      
      that.getStoreList()
    }

  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})