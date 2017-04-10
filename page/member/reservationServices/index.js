var http = require('../../../service/request.js'),
    dealErr = require('../../../util/err_deal.js'),
    app = getApp()
var timestamp = Date.parse(new Date())
var da = new Date((timestamp/1000 + 86400)*1000)
var year = da.getFullYear(),
    month = da.getMonth()>9?da.getMonth()+1:'0'+(da.getMonth()+1),
    date = da.getDate()>9?da.getDate():'0'+da.getDate(),
    hours = da.getHours()<10?'0'+da.getHours():da.getHours(),
    minutes = da.getMinutes()<10?'0'+da.getMinutes():da.getMinutes(),
    seconds = da.getSeconds()<10?'0'+da.getSeconds():da.getSeconds()
var time = [year,month,date].join('-'),
    today = [hours,minutes,seconds].join(':')
Page({
  data:{
    yuyue: true,
    selectStore: false,
    flag: true,
    name: '请选择',
    address: '',
    pick: false,
    now: time,
    date1: time,
    date2: time,
    cAddress: '',
    cName: '',
    cPhone: '',
    items: [
      {name: '维修', value: '1',src:'/image/page/fix.png'},
      {name: '保养', value: '2',src:'/image/page/oil.png'}
    ],
    item1: '',
    item2: '',
    //选择门店
    location: {},
    list: [],
    page: 1,
    order: 0,
    isLoading: false    //是否请求中
  },
  checkboxChange: function(e) {
    var that = this
    var val = e.detail.value
    
    if(val.length === 1) {
      if(val[0] == '维修') {
        that.setData({
          orderType: '1'
        })
      } else {
        that.setData({
          orderType: '2'
        })
      }
    } else if(val.length === 2) {
      that.setData({
        orderType: '3'
      })
    } else {
      that.setData({
        orderType: ''
      })
    }


    if(val == "维修") {
      if(that.data.item1 == '') {
        that.setData({
          item1: '1'
        })
      } else {
        that.setData({
          item1: ''
        })
      }
    } else {
      if(that.data.item2 == '') {
        that.setData({
          item2: '2'
        })
      } else {
        that.setData({
          item2: ''
        })
      }
    }
    
  },
  switchChange:function(e){
    var that = this

    if(that.data.support_pick == '0') {
      var title = '提示',
          tips = '抱歉，您选择的门店不支持上门取车！'
      dealErr.showTips(title, tips, function(){
        that.setData({
          pick: false
        })
      })
      return false
    }

    if(!e.detail.value) {
      that.setData({
        pick: false
      })
    } else {
      that.setData({
        pick: true
      })
    }
    this.setData({
        flag: !e.detail.value,
    })   
  },
  bindDateChange1: function(e) {
    var that = this
    
    that.setData({
      date1: e.detail.value
    })
  },
  bindDateChange2: function(e) {
    var that = this
    
    that.setData({
      date2: e.detail.value
    })
  },
  setAddress: function(e) {
    this.setData({
      cAddress: e.detail.value
    })
  },
  setName: function(e) {
    this.setData({
      cName: e.detail.value
    })
  },
  setPhone: function(e) {
    this.setData({
      cPhone: e.detail.value
    })
  },
  toOrderStore:function(){
    this.setData({
      yuyue: false,
      selectStore: true
    })
  },
  checkInfo: function() {
    var that = this
    
    if(!that.data.orderType) {
      var title = '提示',
          tips = '请选择预约类型！'
      dealErr.showTips(title, tips, function(){})
      return false
    }

    if(that.data.address === '') {
      var title = '提示',
          tips = '请选择预约门店！'
      dealErr.showTips(title, tips, function(){})
      return false
    }

    if(that.data.pick) {
      if(that.data.cAddress === '') {
        var title = '提示',
            tips = '请填写取车地址！'
        dealErr.showTips(title, tips, function(){})
        return false
      } else {
        that.setData({
          pickType: '2'
        })
      }
    } else {
      that.setData({
        pickType: '1',
        cAddress: ''
      })
    }
    
    if(that.data.pick && !that.data.cName) {
      var title = '提示',
          tips = '请填写联系人！'
      dealErr.showTips(title, tips, function(){})
      return false
    }

    if(!that.data.cPhone) {
      var title = '提示',
          tips = '请填写联系电话！'
      dealErr.showTips(title, tips, function(){})
      return false
    }
    var reg = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;  //手机号码
    // if(!reg.test(that.data.cPhone)) {
    //   var title = '提示',
    //       tips = '电话号码格式不正确！'
    //   dealErr.showTips(title, tips, function(){})
    //   return false
    // }

    that.submit()

  },
  submit: function() {
    dealErr.loading()
    var that = this

    if(that.data.pick) {
      that.setData({
        date: that.data.date1
      })
    } else {
      that.setData({
        date: that.data.date2
      })
    }
    var stringTime = that.data.date + ' ' + today

    var t = Date.parse(new Date(stringTime))/1000
    
    if(that.data.pick) {
      that.setData({
        qtime: t
      })
    } else {
      that.setData({
        qtime: ''
      })
    }

    var token = '?clientId=haima_mini_apps&deviceId=miniApps&comeFrom=miniApps&accessToken=' + that.data.accessToken
    var url = that.data.APIUrl + '/moofun/order/miniApps' + token,
        data = {
          uid: that.data.uid,
          carId: that.data.carId,
          dealerId: that.data.dealerId,
          orderType: that.data.orderType,
          pickType: that.data.pickType,
          startTime: that.data.qtime,
          orderTime: t,
          phone: that.data.cPhone,
          cPhone: that.data.cPhone,
          cName: that.data.cName,
          cAddress: that.data.cAddress
        }

    http._post(url, data, 
      function(res) {
        dealErr.hideToast()
        dealErr.dealErr(res, function() {
          var title = '提示',
              tips = '预约成功'

          dealErr.showTips(title, tips, function(){    
            wx.navigateBack({
              delta: 1
            })
          })
        })
      }, function(res) {

      })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    //进入页面显示加载动画
    // this.loadingToast()
    // 页面初始化 options为页面跳转所带来的参数
    //获取全局data
    var that = this
    //从其他页面跳转预约
    if(options.dealer_id) {
      if(!options.uid) {
        var title = '未登录',
            tips = '请先登录！'

        dealErr.showTips(title, tips, function() {
          wx.redirectTo({
            url: '../login/index'
          })
        })
      } else if(!options.carId) {
        var title = '警告',
            tips = '您还未绑定车辆，请下载Moofun APP！'

        dealErr.showTips(title, tips, function() {
          wx.switchTab({
            url: '/page/member/index'
          })
        })
      } else {
        that.setData({
          uid: options.uid,
          carId: options.carId,
          accessToken: options.accessToken,
          dealerId: options.dealer_id,
          name: options.name,
          address: options.address,
          yuyue: true,
          selectStore: false
        })
      }
    } else if(!options.uid) {
      var title = '未登录',
            tips = '请先登录！'

      dealErr.showTips(title, tips, function() {
        wx.redirectTo({
          url: '../login/index'
        })
      })
    } else if(!options.carId) {
      var title = '警告',
            tips = '您还未绑定车辆，请下载Moofun APP！'

      dealErr.showTips(title, tips, function() {
        wx.switchTab({
          url: '/page/member/index'
        })
      })
    }

    var app = getApp()
    var APIUrl = app.globalData.APIUrl

    

    this.setData({
      APIUrl: APIUrl,
      uid: options.uid,
      carId: options.carId,
      accessToken: options.accessToken
    })

    wx.getSystemInfo( {
      success: ( res ) => {
        this.setData( {
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
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
        dealErr.loading()
        //请求数据
        that.getData()
      },
      fail: function() {
        //将位置信息保存到data
        that.setData({
          location: {
            latitude: '0',
            longitude: '0'
          }
        })

        //请求数据
        that.getData()
      }
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
  },

  //选择门店
  pullUpLoad: function( e ) {
    var that = this
    var isLoading = that.data.isLoading

    if(!isLoading) {
      //loading动画
      dealErr.loading()

      that.setData( {
        page: that.data.page + 1
      })
      that.getData()
    }
    
    console.log( "上拉拉加载更多...." + that.data.page )

  },
  radioChange: function(e) {
    
    var arr = e.detail.value.split(",")
    var id = arr[0],
        support_pick = arr[1],
        name = arr[2],
        address = arr[3]
    this.setData({
      dealerId: id,
      support_pick: support_pick,
      name: name,
      address: address,
      yuyue: true,
      selectStore: false
    })

    if(support_pick == '0') {
      this.setData({
        pick: false,
        flag: true
      })
    }
  },
  distance: function () {   //距离排序
    var that = this
    var isLoading = that.data.isLoading
    //清空list
    that.emptyList()

    if(that.data.order === 0)
      return false;

    if(!isLoading) {
      //loading动画
      dealErr.loading()

      that.setData( {
        page: 1,
        order: 0
      })
      that.getData()
    }
  },
  amount: function () {   //人气排序
    var that = this
    var isLoading = that.data.isLoading
    //清空list
    that.emptyList()

    if(that.data.order === 1)
      return false;
      
    if(!isLoading) {
      //loading动画
      dealErr.loading()

      that.setData( {
        page: 1,
        order: 1
      })
      that.getData()
    }
  },
  comment: function () {   //评价排序
    var that = this
    var isLoading = that.data.isLoading
    //清空list
    that.emptyList()

    if(that.data.order === 2)
      return false;
      
    if(!isLoading) {
      //loading动画
      dealErr.loading()

      that.setData( {
        page: 1,
        order: 2
      })
      that.getData()
    }
  },
  emptyList: function () {
    var that = this

    that.setData({
      list: []
    })
  },
  getData: function() {//请求数据
    var that = this

    that.setData({    //正在请求。。。
      isLoading: true
    })

    var url = that.data.APIUrl + '/moofun/dealer',
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

        //请求完成，隐藏加载Toast
        dealErr.hideToast()
        dealErr.dealErr(res, function () {
          var data = res.data.data;
          
          for(var i = 0; i < data.length; i++) {
            // if(!!data[i].avatar.middleUrl)
            //   data[i].avatar.middleUrl = data[i].avatar.middleUrl.replace(/http/, 'https')
            // else
              data[i].avatar.middleUrl = '/image/page/store.png'
            
            if(data[i].hasOwnProperty('distance')) {
              data[i].distance = data[i].distance.toFixed(2)
              data[i].distance = data[i].distance + 'km'
            }
            //star
            if(data[i].avg) {
                data[i].avg = '/image/page/star' + Math.round(data[i].avg) + '.png'
            } else {
              data[i].avg = '/image/page/star0.png'
            }
            //上门取车、购车店、去过的店
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
        })
          
      }, function( res ) {
        dealErr.fail()
      });
  }
})