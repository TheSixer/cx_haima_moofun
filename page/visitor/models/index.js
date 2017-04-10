var order = ['green', 'red', 'yellow', 'blue', 'green']
Page({
  data: {
    toView: 'green'
  },
  upper: function(e) {
    console.log(e)
  },
  lower: function(e) {
    console.log(e)
  },
  scroll: function(e) {
    console.log(e)
  },
  scrollToTop: function(e) {
    this.setAction({
      scrollTop: 0
    })
  },
  tap: function(e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1],
          scrollTop: (i + 1) * 200
        })
        break
      }
    }
  },
  testDriveM3:function(){
      wx.navigateTo({
        url: '/page/visitor/showModel/index?car=M3'
      })
  },
  testDriveS5:function(){
      wx.navigateTo({
        url: '/page/visitor/showModel/index?car=S5'
      })
  },
  testDriveM6:function(){
      wx.navigateTo({
        url: '/page/visitor/showModel/index?car=M6'
      })
  },
  tapMove: function(e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  }
})
