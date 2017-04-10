var http = require('../../../../service/request.js'),
    dealErr = require('../../../../util/err_deal.js')
Page({
  data:{
    index: 0,
    status: false,   //提醒状态
    amount: '0.00',   // 还款金额
    repaymentDate: 0,  //还款日期
    repaymentDateArr: [],
    remindDays: 14,   //提醒日期
    remindDayArr: [],   //提醒日期数组
  },
  switchChange:function(e){   //是否提醒
      this.setData({
          status: e.detail.value
      })   
  },
  changeAmount:function (e) {   //还款金额
    if(e.detail.value) {
      var num = parseFloat(e.detail.value)
      this.setData({
        amount: num.toFixed(2)
      })
    } else {
      this.setData({
        amount: '0.00'
      })
    }
  },
  changeRepaymentDate:function (e) {   //还款日期
    this.setData({
      repaymentDate: e.detail.value
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
          if(res.data.data.loanLicense) {
            var data = res.data.data.loanLicense
            
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
            //还款金额
            if(data.amount) {
              that.setData({
                amount: data.amount
              })
            }
            //还款日期
            if(data.repaymentDate) {
              that.setData({
                repaymentDate: parseInt(data.repaymentDate) - 1
              })
            }
            //提醒日期
            if(data.remindDays) {
              that.setData({
                remindDays: parseInt(data.remindDays) - 1
              })
              console.log(that.data.remindDays)
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
    // if() {

    // }
    //loading动画
    dealErr.loading()

    var token = '?clientId=haima_mini_apps&deviceId=miniApps&comeFrom=miniApps&accessToken=' + that.data.accessToken
    var url = that.data.APIUrl + '/moofun/remind/loan/miniApps' + token,
        data = {
          uid: that.data.uid,
          carId: that.data.carId,
          amount: that.data.amount,
          repaymentDate: parseInt(that.data.repaymentDate) + 1,
          remindDays: parseInt(that.data.remindDays) + 1,
          status: that.data.status?'0':'1'
        }
        
    if(that.data.requestTypePost) { //判断提醒是否存在，不存在则新增（post），存在则修改（put）
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
      url = that.data.APIUrl + '/moofun/remind/loan/miniApps/' + that.data.id + token  //修改需要id

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
    for(var i = 1; i <= 100; i++) {
      var str = '提前' + i + '天'
      
      that.data.remindDayArr.push(str)
      that.setData({
        remindDayArr: that.data.remindDayArr
      })
    }
    //创建还款日期数组
    for(var i = 1; i <= 30; i++) {
      var str = '每月' + i + '日'
      
      that.data.repaymentDateArr.push(str)
      that.setData({
        repaymentDateArr: that.data.repaymentDateArr
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