var http = require('../../../../service/request.js'),
    dealErr = require('../../../../util/err_deal.js'),
    md5 = require('../../../../util/md5.js')
Page({
  data: {
    phone: '',
    getCodeBtnDisabled: true,   //获取验证码不可点击
    codeText: '获取验证码',
    retryTime: 60,
    registerBtn: true,
    flag: true,
    src:'/image/page/eyeclose.png'
  },
  bindKeyInput: function(e) {
    var that = this,
        phone = e.detail.value

    if(phone.length === 11) {
      that.setData({
        getCodeBtnDisabled: false
      })
    } else {
      that.setData({
        getCodeBtnDisabled: true
      })
    }

    that.setData({
      phone: e.detail.value
    })
  },
  getCode: function () {
    var that = this,
        app = getApp(),
        APIUrl = app.globalData.APIUrl,
        reg = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;  //手机号码

    this.setData({
      APIUrl: APIUrl
    })

    // if(!reg.test(that.data.phone)) {  //验证手机号
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
          type: 1,
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
  register: function() {
    var that = this,
        app = getApp(),
        APIUrl = app.globalData.APIUrl,
        reg = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/,  //手机号码
        // regPsd = /^(?![0-9A-Z]+$)(?![0-9a-z]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;  //请输入8～18位密码，密码需包含大小写字母和数字
        regPsd = /^[0-9a-zA-Z]{8,20}$/

    if(!reg.test(that.data.phone)) {
      var title = '警告',
          tips = '手机号码格式不正确！'

      dealErr.showTips(title, tips, function() {})
      return false

    } else if(that.data.code === '') {
      var title = '警告',
          tips = '请输入验证码！'

      dealErr.showTips(title, tips, function() {})
      return false

    } else if(that.data.code.length !== 4){
      var title = '警告',
          tips = '请输入正确的验证码！'

      dealErr.showTips(title, tips, function() {})
      return false;

    } else if(!that.data.password || !that.data.password_re) {
      var title = '警告',
          tips = '密码不能为空！'

      dealErr.showTips(title, tips, function() {})
      return false;

    } else if(!regPsd.test(that.data.password)) {
      var title = '警告',
          tips = '请输入8～18位密码，密码包含字母和数字,不区分大小写！'

      dealErr.showTips(title, tips, function() {})
      return false;

    } else if(that.data.password !== that.data.password_re){
      var title = '警告',
          tips = '两次输入的密码不一致，请重新输入！'

      dealErr.showTips(title, tips, function() {})
      return false;
    }

    that.setData({
      APIUrl: APIUrl
    })
    
    that.setData({
      password: that.data.password.toLowerCase()
    })

    var url = that.data.APIUrl + '/moofun/account/miniApps?clientId=haima_mini_apps&deviceId=miniApps&comeFrom=miniApps',
        data = {
          clientId: 'haima_mini_apps',
          deviceId: 'miniApps' ,
          comeFrom: 'miniApps',
          code: that.data.code,
          password: md5.hexMD5(that.data.password + 'mosaic'),
          phone: that.data.phone
        }

    //注册
    http._post(url, data, 
      function(res) {
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
  setCode: function(e) {
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
  setPasswordRe: function(e) {
    var that = this

      that.setData({
        password_re: e.detail.value
      })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
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