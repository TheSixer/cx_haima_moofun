var http = require('../../../../service/request.js'),
    dealErr = require('../../../../util/err_deal.js')
var da = new Date();
var year = da.getFullYear(),
    month = da.getMonth()>9?da.getMonth()+1:'0'+(da.getMonth()+1),
    date = da.getDate();
var time = [year,month,date].join('-');var da = new Date();
var year = da.getFullYear(),
    month = da.getMonth()>9?da.getMonth()+1:'0'+(da.getMonth()+1),
    date = da.getDate()<10?'0'+da.getDate():da.getDate()
var time = [year,month,date].join('-')
Page({
  data:{
    index: 0,
    status: false,   //驾驶证提醒
    carCard: '',    //驾照号码
    cardDate: '1990-10-01',   //发证日期
    effectiveDate: '',    //有效日期
    remindDays: 14,   //提醒日期
    remindDayArr: [],   //提醒日期数组
  },
  switchChange:function(e){   //是否提醒
      this.setData({
          status: e.detail.value
      })   
  },
  changeCard:function (e) {   //驾照号码
    this.setData({
      carCard: e.detail.value
    })
  },
  cardDateChange: function (e) {   //发证日期
    this.setData({
      cardDate: e.detail.value
    })
  },
  effectiveDateChange:function (e) {    //有效日期
    this.setData({
      effectiveDate: e.detail.value
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
          accessToken: that.data.accessToken
        }
    
    http._get(url, data, 
      function(res) {
        //隐藏动画loading
        dealErr.hideToast()
        dealErr.dealErr(res, function() {
          //判断提醒是否存在，不存在则新增（post），存在则修改（put）
          if(res.data.data.carLicense) {
            var data = res.data.data.carLicense
            
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
            //是否存在驾驶证号码
            if(data.carCard) {
              that.setData({
                carCard: data.carCard
              })
            }
            //是否存在发证日期
            if(data.cardDate) {
              that.setData({
                cardDate: data.cardDate
              })
            }
            //有效期
            if(data.effectiveDate) {
              that.setData({
                effectiveDate: data.effectiveDate
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
    var that = this

    if(that.data.effectiveDate == '') {
      var title = '提示',
          tips = '请选择发证日期！'
      dealErr.showTips(title, tips, function(){})
      return false
    }
    if(that.data.effectiveDate == '') {
      var title = '提示',
          tips = '请选择有效日期！'
      dealErr.showTips(title, tips, function(){})
      return false
    }
    var stringTime1 = that.data.effectiveDate + ' 00:00:00'
    var stringTime2 = that.data.cardDate + ' 00:00:00'

    var str1 = Date.parse(new Date(stringTime1))/1000
    var str2 = Date.parse(new Date(stringTime2))/1000
    
    if(str1 < str2) {
      var title = '提示',
          tips = '有效期不能在发证日期之前！'
      dealErr.showTips(title, tips, function(){})
      return false
    }
    //loading
    dealErr.loading()

    
    var token = '?clientId=haima_mini_apps&deviceId=miniApps&comeFrom=miniApps&accessToken=' + that.data.accessToken
    var url = that.data.APIUrl + '/moofun/remind/carLicence/miniApps' + token,
        data = {
          uid: that.data.uid,
          carId: that.data.carId,
          carCard: that.data.carCard,
          cardDate: that.data.cardDate,
          effectiveDate: that.data.effectiveDate,
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
      url = that.data.APIUrl + '/moofun/remind/carLicence/miniApps/' + that.data.id + token  //修改需要id

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
      today: time,
      uid: parseInt(options.uid),
      accessToken: options.accessToken
    })
    
    //创建提醒日期数组
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