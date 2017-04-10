var http = require('../../../service/request.js'),
    md5 = require('../../../util/md5.js'),
    dealErr = require('../../../util/err_deal.js')

Page({
  data: {
    flag1:false,
    flag2:true,
    getCodeBtnDisabled: true,   //获取验证码不可点击
    codeText: '获取验证码',
    retryTime: 60,
    canLogin1: true,
    canLogin2: true,
    phone: null,
    phone2: null,
    code: null,
    password: null
  },
  setPhone: function(e) {
    var that = this

    that.setData({
      phone: e.detail.value,
      getCodeBtnDisabled: false
    })
  },
  setPhone2: function(e) {
    var that = this
    
    that.setData({
      phone2: e.detail.value
    })
  },
  coding: function(e) {  //输入验证码
    var that = this

    that.setData({
      code: e.detail.value
    })
  },
  setPassword: function(e) {
    var that = this

    that.setData({
      password: e.detail.value
    })
  },
  getCode: function () {
    
    var that = this,
        reg = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;  //手机号码

    // if(!reg.test(that.data.phone)) {
    //   var title = '提示',
    //       tips = '手机号码格式不正确！'
    //   dealErr.showTips(title, tips, function() {})
    //   return false
    // }

    var url = that.data.APIUrl + '/moofun/sms/authCode',
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps' ,
          comeFrom: 'miniApps',
          type: 2,
          phone: that.data.phone
        }

    //获取验证码
    http._get(url, data,
      function(res) {
        //统一处理
        dealErr.dealErr(res, function() {
          //重新获取倒计时
          that.setTime()
          
          dealErr.succeed('发送成功！')
        })
      }, function(res) {
        //请求失败
        dealErr.fail()
      })

  },
  setTime: function() {
    var that = this,
        time = that.data.retryTime

    if(time == 0) {
      that.setData({
        getCodeBtnDisabled: false,
        codeText: '获取验证码',
        retryTime: 60
      })
      return false;
    } else {
      time--;
      var text = '重新发送(' + time + 's)'

      that.setData({
        getCodeBtnDisabled: true,
        codeText: text,
        retryTime: time
      })
    }

    setTimeout(function() {
      that.setTime()
    }, 1000)
  },
  login: function () {    //登录
    var that = this,
        app = getApp(),
        reg = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;  //手机号码

    if(that.data.phone === '' || that.data.phone === null) {
      var title = '提示',
          tips = ' 手机号码不能为空！'
      dealErr.showTips(title, tips, function() {})
      return false
    } else if(that.data.code === null || that.data.code === '') {
      var title = '警告',
          tips = '请输入验证码！'

      dealErr.showTips(title, tips, function() {})
      return false

    } else if(that.data.code.length !== 4){
      var title = '警告',
          tips = '请输入正确的验证码！'

      dealErr.showTips(title, tips, function() {})
      return false;

    }

    //标题loading
    dealErr.loadingTitle()
    dealErr.loading()
    var url = that.data.APIUrl + '/moofun/account/miniApps/' + that.data.phone + '?clientId=haima_mini_apps&deviceId=miniApps&comeFrom=miniApps',
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps' ,
          comeFrom: 'miniApps',
          phone: that.data.phone,
          code: that.data.code,
          password: that.data.password
        }

    http._post(url, data, 
      function(res) {
        //隐藏标题loading
        dealErr.hideLt()
        dealErr.hideToast()
        //统一处理
        dealErr.dealErr(res, function() {
          app.globalData.hasLogin = true
          app.globalData.userInfo = res.data.data
          //保存用户信息
          wx.setStorage({
            key: "userInfo",
            data: res.data.data
          })
          //跳转到初始页面
          wx.switchTab({
            url: '/page/member/index'
          })
        })
      }, function(res) {
        //请求失败
        dealErr.fail()
      })
  },
  submit: function () {    //登录
    var that = this,
        app = getApp(),
        reg = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/,  //手机号码
        // regPsd = /^(?![0-9A-Z]+$)(?![0-9a-z]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;  //请输入8～18位密码，密码需包含大小写字母和数字
        regPsd = /^[0-9a-zA-Z]{8,20}$/

    if(that.data.phone2 === '' || that.data.phone2 === null) {
      var title = '提示',
          tips = ' 手机号码不能为空！'
      dealErr.showTips(title, tips, function() {})
      return false
    } else if(that.data.password === null) {
      var title = '警告',
          tips = '密码不能为空！'

      dealErr.showTips(title, tips, function() {})
      return false

    }

    that.setData({
      password: that.data.password.toLowerCase()
    })
    console.log(that.data.password)
    var password = that.data.password + 'mosaic'
    //标题loading
    dealErr.loadingTitle()
    dealErr.loading()
    var url = that.data.APIUrl + '/moofun/account/miniApps/' + that.data.phone2 + '?clientId=haima_mini_apps&deviceId=miniApps&comeFrom=miniApps',
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps' ,
          comeFrom: 'miniApps',
          phone: that.data.phone2,
          password: md5.hexMD5(password)
        }

    http._post(url, data, 
      function(res) {
        //隐藏标题loading
        dealErr.hideLt()
        dealErr.hideToast()
        //统一处理
        dealErr.dealErr(res, function() {
          app.globalData.hasLogin = true
          app.globalData.userInfo = res.data.data
          //保存用户信息
          wx.setStorage({
            key: "userInfo",
            data: res.data.data
          })
          //跳转到初始页面
          wx.switchTab({
            url: '/page/member/index'
          })
        })
      }, function(res) {
        //请求失败
        dealErr.fail()
      })
  },
  switch1: function () {
      this.setData({
        flag1:true,
        flag2:false
      })
  },
  switch2: function () {
        this.setData({
        flag1:false,
        flag2:true
      })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var app = getApp(),
        APIUrl = app.globalData.APIUrl

    this.setData({
      APIUrl: APIUrl
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
  }
})