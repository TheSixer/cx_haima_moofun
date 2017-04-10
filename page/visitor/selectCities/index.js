var http = require('../../../service/request.js');
var dealErr = require('../../../util/err_deal.js');
var app = getApp();
var bmap = require('../../../util/bmap-wx.js');//引入百度地图接口
var originalData =[];
Page({
  data:{
    list: [],
    city:[] //接受百度地图查询到的参数
  },
  here: function() {
    app.globalData.here = true
    app.globalData.cid = ''
    app.globalData.cName = ''

    wx.navigateBack({
      delta: 1
    })
  },
  getCity: function(e) {
    var cid = e.target.id
    var cName = e.target.dataset.hi

    app.globalData.here = false
    app.globalData.cid = cid
    app.globalData.cName = cName
    
    wx.navigateBack({
      delta: 1
    })
  },
  getCities: function () {
    var that = this
    var url = that.data.url + '/moofun/dealer/cities',
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps' ,
          comeFrom: 'miniApps'
        }

    http._get(url, data, 
      function(res) {
        dealErr.dealErr(res, function() {
          var arr = res.data.data
          for(var x in arr) 
            arr[x].key = arr[x].citykey.substr(0,1)
          
          
          var arr2 = that.data.arr
          for(var j = 1; j < arr2.length; j++) {
            for(var i = 1; i < arr.length; i++) {
              if(arr[i].key === arr2[j] && arr[i-1].key === arr2[j-1]) {
                var obj = {
                  id: '',
                  name: arr2[j],
                  key: arr2[j],
                  cid: arr2[j] + i
                }
                arr.splice(i, 0, obj)
              }
            }
          }
          var obj = {
                id: '',
                name: 'A',
                key: 'A',
                cid: 'A'
              }
          arr.splice(0, 0, obj)

          that.setData({
            list: arr
          })

          dealErr.hideToast()
        })
      }, function (res) {
        dealErr.fail()
      })
  },
  split: function() {
    var str = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'

    var arr = str.split(',')

    this.setData({
      arr: arr
    })
    
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    dealErr.loading()

    var that = this
    // var api = app.globalData.APIUrl

    // that.setData({
    //   url: api
    // })

    // that.split()

    // that.getCities()

    var BMap = new bmap.BMapWX({  //引入百度地图逆向解析方法获取地址参数
            ak: '0j58417lWrPMtB7jcdH4rDvr8qcnAL6R' 
        }); 
        var fail = function(data) { 
            dealErr.hideToast()
        }; 
        var success = function(data) { 
            dealErr.hideToast()
            originalData = data.originalData;
            that.setData({
                city:originalData.result.addressComponent
            });
            // console.log(originalData.result.addressComponent)
        }
        BMap.regeocoding({ 
            fail: fail, 
            success: success, 
            iconPath: '../../img/marker_red.png', 
            iconTapPath: '../../img/marker_red.png' 
        }); 
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