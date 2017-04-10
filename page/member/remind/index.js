//remind/index.js
var http = require('../../../service/request.js'),
    dealErr = require('../../../util/err_deal.js')
var da = new Date();
var year = da.getFullYear(),
    month = da.getMonth()>9?da.getMonth()+1:'0'+(da.getMonth()+1),
    date = da.getDate();
var time = [year,month,date].join('-');var da = new Date();
var year = da.getFullYear(),
    month = da.getMonth()>9?da.getMonth()+1:'0'+(da.getMonth()+1),
    date = da.getDate()<10?'0'+da.getDate():da.getDate();
var time = [year,month,date].join('-');
Page({
  data:{
    isFirst: true,
    carList: [],
    location: {},
    list: [],
    index: 0, //默认第一辆车
    justOne: true,
    isLoading: false,    //是否请求中
    _carLicence: false,   //驾驶证提醒
    _drivingLicence: false,   //行驶证提醒
    _insurance: false,    //车险提醒
    _maintain: false,   //保养提醒
    _loan: false    // 车贷提醒
  },
  bindPickerChange: function(e) {   //选择车辆
    var val = e.detail.value

    if(val != this.data.index) {
      this.setData({
        index: e.detail.value
      })
      //获取其他车信息
      this.getData(this.data.index)
    }
  },
  getData: function(num) {//请求数据
    //进入页面显示加载动画
    dealErr.loading()
    
    var that = this;

    that.setData({    //正在请求。。。
      isloading: true
    })

    var url = this.data.APIUrl + '/moofun/remind/' + that.data.userInfo.uid,
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps' ,
          comeFrom: 'miniApps',
          carId: that.data.car[num].carId,
          accessToken: that.data.userInfo.accessToken
        }
    http._get( url, data,
      function( res ) {
        that.setData({    //请求完成
          isloading: false
        })
        //统一处理
        dealErr.hideToast()
        dealErr.dealErr(res, function() {
          var data = res.data.data
          
          if(!!data.carLicense) {
              
            if(data.carLicense.status === '0') {
              var stringTime = data.carLicense.effectiveDate
              
              var time1 = new Date(stringTime)
              var time2 = new Date(time)

              var str1 = time1.getTime()/1000
              var str2 = time2.getTime()/1000

              if(str1 <= str2) {
                that.setData({
                  _carLicence: '#D20D25',    //已设置驾驶证提醒
                  carLicenceId: data.carLicense.id,
                  carLicence: data.carLicense.effectiveDate + '到期'
                })
              } else {
                that.setData({
                  _carLicence: '#FF9801',    //已设置驾驶证提醒
                  carLicenceId: data.carLicense.id,
                  carLicence: data.carLicense.effectiveDate + '到期'
                })
              }
            } else {
              that.setData({
                _carLicence: '',    //已设置驾驶证提醒
                carLicenceId: data.carLicense.id,
                carLicence: '未开启'
              })
            }
          } else {
            that.setData({
              _carLicence: '',    //已设置驾驶证提醒
              carLicence: '未设置'
            })
          }
          if(!!data.driverLicense) {
              
            if(data.driverLicense.status === '0') {
              var stringTime = data.driverLicense.effectiveDate

              var time1 = new Date(stringTime)
              var time2 = new Date(time)

              var str1 = time1.getTime()/1000
              var str2 = time2.getTime()/1000

              if(str1 <= str2) {
                that.setData({ 
                  _drivingLicence: '#D20D25',    //已设置行驶证提醒
                  drivingLicence: data.driverLicense.effectiveDate + '到期'
                })
              } else {
                that.setData({ 
                  _drivingLicence: '#FF9801',    //已设置行驶证提醒
                  drivingLicence: data.driverLicense.effectiveDate + '到期'
                })
              }
            } else {
              that.setData({
                _drivingLicence: '',    //已设置行驶证提醒
                drivingLicence: '未开启'
              })
            }
          } else {
            that.setData({
              _drivingLicence: '',    //已设置行驶证提醒
              drivingLicence: '未设置'
            })
          }
          
          if(!!data.insuranceLicense) {
            if(data.insuranceLicense.status === '0') {
              var stringTime = data.insuranceLicense.insuranceDate

              var time1 = new Date(stringTime)
              var time2 = new Date(time)

              var str1 = time1.getTime()/1000
              var str2 = time2.getTime()/1000

              if(str1 <= str2) {
                that.setData({ 
                  _insurance: '#D20D25',    //已设置车险提醒
                  insurance: data.insuranceLicense.insuranceDate + '到期'
                })
              } else {
                that.setData({ 
                  _insurance: '#FF9801',    //已设置车险提醒
                  insurance: data.insuranceLicense.insuranceDate + '到期'
                })
              }
            } else {
              that.setData({
                _insurance: '',    //已设置车险提醒
                insurance: '未开启'
              })
            }
          } else {
            that.setData({
              _insurance: '',    //已设置车险提醒
              insurance: '未设置'
            })
          }

          if(!!data.maintainLicense) {
            if(data.maintainLicense.status === '0') {
              that.setData({
                _maintain: true,    //已设置保养提醒
                maintain: '已开启'
              })
            } else {
              that.setData({
                _maintain: true,    //已设置保养提醒
                maintain: '未开启'
              })
            }
          } else {
            that.setData({
              _maintain: true,    //已设置保养提醒
              maintain: '未设置'
            })
          }

          if(!!data.loanLicense) {
            if(data.loanLicense.status === '0') {
              that.setData({
                _loan: true,    //已设置车贷提醒
                loan: '已开启'
              })
            } else {
              that.setData({
                _loan: true,    //已设置车贷提醒
                loan: '未开启'
              })
            }
          } else {
            that.setData({
              _loan: true,    //已设置车贷提醒
              loan: '未设置'
            })
          } 
        })
      }, function(res) {
        //请求失败
        dealErr.fail()
      })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    //获取全局data
    var that = this;
    var app = getApp()
    var APIUrl = app.globalData.APIUrl

    this.setData({
      APIUrl: APIUrl
    })

    wx.getStorage({   //获取用户车信息
      key: 'userInfo',
      success: function(res) {
        if(res.data.car && res.data.car.length !== 0) {
          var car = res.data.car,
              carList = []

          for(var x = 0; x < car.length; x++) {
            var str = '海马' + car[x].vehicleType + ' ' + car[x].plateNo

            carList.push(str)
          }
          
          that.setData({
            car: car,
            carList: carList,
            userInfo: res.data.user
          })
          
          if(res.data.car.length !== 1) {
            that.setData({
              justOne: false
            })
          }
          //获取第一辆车提醒
          that.getData(that.data.index)
        } else {
          var title = '提示',
              tips = '您还没有绑定车辆，请下载Moofun APP绑定您的车辆！'

          dealErr.showTips(title, tips, function() {
            wx.navigateBack({
              delta: 1
            })
          })
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
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    //判断是否，下页返回
    if(!this.data.isFirst) {
      this.onLoad()
    }
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
    //方便返回时判断是否刷新页面
    this.setData({
      isFirst: false
    })
  },
  onUnload:function(){
    // 页面关闭
  }
})