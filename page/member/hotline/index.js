// page/member/hotline/index.js
Page({
  data:{},
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
  },
  callingOne:function(){
    wx.makePhoneCall({
      phoneNumber: '400-895-2000',
    })
  },
  callingTwo:function(){
    wx.makePhoneCall({
      phoneNumber: '400-045-9898',
    })
  }
})