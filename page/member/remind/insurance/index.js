var http = require('../../../../service/request.js'),
    dealErr = require('../../../../util/err_deal.js')
Page({
  data:{
    index: 0,
    status: false,   //驾驶证提醒
    insurance: 0,
    insuranceList: [],    //保险公司列表
    insuranceDate: '1990-01-01',   //发证日期
    remindDays: 14,   //提醒日期
    remindDayArr: [],   //提醒日期数组
  },
  switchChange:function(e){   //是否提醒
      this.setData({
          status: e.detail.value
      })   
  },
  changeInsurance:function (e) {   //发动机号码
    this.setData({
      insurance: e.detail.value
    })
  },
  insuranceDateChange: function (e) {   //车辆识别码
    this.setData({
      insuranceDate: e.detail.value
    })
  },
  changeRemindDays:function (e) {   //提醒日期
    this.setData({
      remindDays: e.detail.value
    })
  },
  getInsuranceList: function() {    //获取保险公司列表
    var that = this
    var url = that.data.APIUrl + '/moofun/remind/insurance',
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps',
          comeFrom: 'miniApps',
          accessToken: that.data.accessToken
        }

    http._get(url, data, 
      function(res) {
        //隐藏动画loading
        // dealErr.hideToast()
        dealErr.dealErr(res, function() {
          //请求提醒信息
          that.getData()
          var list = ['未设置'], 
              arr = res.data.data
          for(var x in arr) {
            list.push(arr[x].sName)
          }
          that.setData({
            insuranceList: list
          })
        })
      }, function(res) {
        dealErr.fail()
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
          if(res.data.data.insuranceLicense) {
            var data = res.data.data.insuranceLicense
            
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
            //保险公司
            if(data.insuranceName) {
              var arr = that.data.insuranceList
              for(var x in arr) {   //将公司名和数组比对，取到序号
                if(data.insuranceName == arr[x]) {
                  that.setData({
                    insurance: x
                  })
                }
              }
            }
            //保险日期
            if(data.insuranceDate) {
              that.setData({
                insuranceDate: data.insuranceDate
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
  showTips: function() {
    var title = '提示',
        tips = '保险日期不能为今日之前的日期！'
    dealErr.showTips(title, tips, function(){})
  },
  submitRemind: function () {
    var that = this
    if(that.data.insurance == 0) {
      var title = '提示',
          tips = '请选择保险公司！'
      dealErr.showTips(title, tips, function(){})
      return false
    } 
    var stringTime1 = that.data.insuranceDate + ' 00:00:00'
    var stringTime2 = that.data.today + ' 00:00:00'

    var str1 = Date.parse(new Date(stringTime1))/1000
    var str2 = Date.parse(new Date(stringTime2))/1000
    console.log(str1,str2)
    //loading
    dealErr.loading()

    
    var token = '?clientId=haima_mini_apps&deviceId=miniApps&comeFrom=miniApps&accessToken=' + that.data.accessToken
    var url = that.data.APIUrl + '/moofun/remind/insurance/miniApps' + token,
        data = {
          uid: that.data.uid,
          carId: that.data.carId,
          insuranceName: that.data.insuranceList[that.data.insurance],
          insuranceDate: that.data.insuranceDate,
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
      url = url = that.data.APIUrl + '/moofun/remind/insurance/miniApps/' + that.data.id + token //修改需要id

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


    var da = new Date();
    var year = da.getFullYear(),
        month = da.getMonth()>9?da.getMonth()+1:'0'+(da.getMonth()+1),
        date = da.getDate();
    var time = [year,month,date].join('-');var da = new Date();
    var year = da.getFullYear(),
        month = da.getMonth()>9?da.getMonth()+1:'0'+(da.getMonth()+1),
        date = da.getDate()<10?'0'+da.getDate():da.getDate();
    var time = [year,month,date].join('-');
    
    that.setData({
      uid: parseInt(options.uid),
      carId: options.carId,
      accessToken: options.accessToken,
      createTime: time,
      today: time
    })
    
    //创建提醒日期数组
    for(var i = 1; i <= 100; i++) {
      var str = '提前' + i + '天'
      
      that.data.remindDayArr.push(str)
      that.setData({
        remindDayArr: that.data.remindDayArr
      })
    }
    //获取保险公司列表
    that.getInsuranceList()
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