var http = require('../../../service/request.js'),
    dealErr = require('../../../util/err_deal.js')
var app = getApp()
Page({
  data:{
    page: 1,
    orderPage: 1,
    list: [],
    orderList: [],
    num: 0,           //  显示第几辆车信息，从0开始
    justOne: true,   // 只有一辆车
    url:'/image/arrowtop.png',
    show:'nowrap',
    flag:false,
    flag1:true,
    classone:'first',
    classtwo:'borderTwo',
    isLoading: false,
    amount: 0,
    orderAmount: 0
  },
  pullUpLoad: function( e ) {
    var that = this
    var isLoading = that.data.isLoading

    if(!isLoading) {
      //loading动画
      dealErr.loading()

      if(flag) {
        that.setData({
          pageNow: that.pageNow + 1
        })
        that.getWorkOrderData()
      } else {
        that.setData({
          pageNow: that.pageNow + 1
        })
        that.getOrderInfoData()
      }
    }
      
    console.log( "上拉拉加载更多...." + this.data.pageNow )

  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this

    wx.getStorage({   //获取用户车信息
      key: 'userInfo',
      success: function(res) {
        if(res.data) {
          if(!res.data.car || res.data.car.length === 0) {
            var title = '提示',
                tips = '您还未绑定车辆，请下载Moofun APP绑定您的车辆！'

            dealErr.showTips(title, tips, function() {
              wx.navigateBack({
                delta: 1
              })
            })
            return false
          }
          that.setData({
            car: res.data.car,
            userInfo: res.data.user
          })
          dealErr.loading()    //加载动画
          //获取第一辆车
          that.getWorkOrderData(0)
          that.getOrderInfoData(0)
        }
        
      },
      fail: function(){
        var title = '未登录',
            tips = '请先登录！'

        dealErr.showTips(title, tips, function() {
          wx.redirectTo({
            url: '../login/index'
          })
        })
      }
    })
  },
  getWorkOrderData: function (n) {  //维保
    var that = this,
        url = app.globalData.APIUrl + '/moofun/car/workorder',
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps',
          comeFrom: 'miniApps',
          pageNow: that.data.page,
          // row:'10',
          uid:that.data.userInfo.uid,
          vin: that.data.car[n].vin,
          accessToken: that.data.userInfo.accessToken
        }
    
    that.setData({
      isLoading: true
    })

    http._get(url, data, 
      function(res) {

        dealErr.dealErr(res, function(){
          if(res.data.data.list) {
            var list = res.data.data.list
            //将取到的数据添加到data中
            for(var i = 0; i < list.length; i++) {
              var arr = list[i].type.split(',')
              
              for(var x in arr) {
                if(arr[x] == '维修')
                  list[i].fixed = true
                if(arr[x] == '保养')
                  list[i].maintain = true
                if(arr[x] == '理赔')
                  list[i].claim = true
                if(arr[x] == '保险')
                  list[i].insurance = true
              }
              that.data.list.push(list[i])
            }
            that.setData({
              list: that.data.list,
              isLoading: false,
              amount: that.data.list.length
            })
          } else {
              that.setData({
                amount: that.data.amount
              })
            }
        })
      }, function (res) {
        dealErr.fail()
      })
  },
  getOrderInfoData:function(){  //预约
    var that = this,
        url = app.globalData.APIUrl + '/moofun/order',
        data = {
          clientId:'haima_mini_apps',
          deviceId: 'miniApps',
          comeFrom: 'miniApps',
          row: 20,
          page: that.data.orderPage,
          uid: that.data.userInfo.uid,
          accessToken:that.data.userInfo.accessToken
        }
      
      that.setData({
        isLoading: true
      })

      http._get(url, data, 
        function(res) {
          //请求成功，隐藏动画
          dealErr.hideToast()

          dealErr.dealErr(res, function(){
            
            if(res.data.data) {
              var list = res.data.data
              
              //将取到的数据添加到data中
              for(var i = 0; i < list.length; i++) {
                // list[i].modify_time = that.format(list[i].modify_time)
                that.data.orderList.push(list[i])
              }
              that.setData({
                orderList: that.data.orderList,
                isLoading: false,
                orderAmount: that.data.orderList.length
              })
            } else {
              that.setData({
                orderAmount: that.data.orderAmount
              })
            }
          })
        })
  },
  // format:function (shijianchuo){
  //   //shijianchuo是整数，否则要parseInt转换
  //   var time = new Date(shijianchuo);
  //   var y = time.getFullYear();
  //   var m = time.getMonth()+1;
  //   var d = time.getDate();
  //   var h = time.getHours();
  //   var mm = time.getMinutes();
  //   var s = time.getSeconds();
  //   return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);

  //   function add0(m){return m<10?'0'+m:m }
  // },
  showRepair:function(){
    this.setData({
      flag:true,
      flag1:false,
      classone:'borderFirst',
      classtwo:'two'
    })
  },
  showOrder:function(){
    this.setData({
      flag:false,
      flag1:true,
      classone:'first',
      classtwo:'borderTwo'
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