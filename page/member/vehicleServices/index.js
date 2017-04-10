// page/member/vehicleServices/index.js
//index.js
var app = getApp()
//引入百度地图api
var bmap = require('../../../util/bmap-wx.js')
//用于保存BMap.search接口返回的数据
var wxMarkerData = [],
    BMap
Page({
    data: {
        height: 'auto',
        markers: [], 
        latitude: '', 
        longitude: '',
        title: '',
        address: '',
        park: true,
        wash: false,
        gas: false,
        loading: false,
        noMarker: true
    },
    // bindtap: function() {       //点击地图时触发
    //     //隐藏导航信息
    //     this.setData({
    //         hide: true,
    //         height: this.data.originHeight
    //     })
    // },
    // bindregionchange: function() {      //视野发生变化时触发
    //     //隐藏导航信息
    //     this.setData({
    //         hide: true,
    //         height: this.data.originHeight
    //     })
    // },
    markertap: function(e) {    //点击标记点
        var that = this
    
        that.setData({
            markerId: e.markerId,
            title: that.data.markers[e.markerId].title,
            address:that.data.markers[e.markerId].address,
            latitude: that.data.markers[e.markerId].latitude,
            longitude:that.data.markers[e.markerId].longitude
        })
    },
    onLoad: function () {
        //保证wx.getSystemInfo的回调函数中能够使用this
        var that = this

        //构造百度地图api实例
        BMap = new bmap.BMapWX({ 
            ak: 'C01r1xqRk8q1kCe2PbwTbG04VxXIRvC2' 
        })

        //调用wx.getSystemInfo接口，然后动态绑定组件高度
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    height: res.windowHeight - 130,
                    originHeight: res.windowHeight
                })
            }
        })
        //默认停车
        that.park()

    },
    showModal: function() {
        wx.showModal({
            title: '提示',
            content: '服务器正在玩儿命加载中，请勿重复点击！',
            success: function(res) {
                if (res.confirm) {

                }
            }
        })

    },
    init: function(str) {
        var that = this

        that.setData({
            address: '定位中...',
            title: '正在搜索附近' + that.data.current,
            markers: []
        })
    },
    park:function() {
        //防止频繁点击
        this.setData({
            current: '停车场'
        })
        this.init()
        if(this.data.loading) {
            this.showModal()
            return false
        }

        var str = '停车'
        this.search(str, 'park')
        this.setData({
            park: true,
            wash: false,
            gas: false
        })
    },
    wash:function() {
        //防止频繁点击
        this.setData({
            current: '洗车店'
        })
        this.init()
        if(this.data.loading) {
            this.showModal()
            return false
        }

        var str = '洗车'
        this.search(str, 'wash')
        this.setData({
            park: false,
            wash: true,
            gas: false
        })
    },
    gas:function() {
        //防止频繁点击
        this.setData({
            current: '加油站'
        })
        this.init()
        if(this.data.loading) {
            this.showModal()
            return false
        }

        var str = '加油'
        this.search(str, 'gas')
        this.setData({
            park: false,
            wash: false,
            gas: true
        })
    },
    navigation: function() {        //导航
        var that = this
        var index = that.data.markerId
        var title = that.data.title,
            address = that.data.address,
            latitude = that.data.latitude,
            longitude = that.data.longitude
        wx.openLocation({
            name: title,
            address: address,
            latitude: latitude,
            longitude: longitude,
            scale: 18
        })
    },
    //查询当前位置的poi信息
    //官方文档上说可以查询指定位置的周边信息
    //然而当前源码中却存在一个bug导致不能查询指定位置的周边信息
    search:function(e, t){
        var that = this

        that.setData({
            loading: true
        })
        //查询失败，直接打印log
        var fail = function(data) { 
            that.setData({ 
                loading: false,     
            })
            wx.redirectTo({
                url: '../refuse/index'
            })
        }

        //查询成功后将结果数据动态绑定到页面上
        var success = function(data) { 
            wxMarkerData = data.wxMarkerData
            // wxMarkerData = []
            if(wxMarkerData.length === 0) {
                that.setData({
                    noMarker: true,
                    title: '搜索完成',
                    address: '未搜索到附近' + that.data.current
                })
            } else {
                for(var x in wxMarkerData) {
                    if(t === 'gas')
                        wxMarkerData[x].iconPath = '/image/gas.png'
                    else if(t === 'park')
                        wxMarkerData[x].iconPath = '/image/park.png'
                    else 
                        wxMarkerData[x].iconPath = '/image/wash.png'
                    wxMarkerData[x].width = 34
                    wxMarkerData[x].height = 54
                }
                that.setData({ 
                    noMarker: false,
                    markers: wxMarkerData,
                    title: wxMarkerData[0].title,
                    address: wxMarkerData[0].address,
                    latitude: wxMarkerData[0].latitude,
                    longitude: wxMarkerData[0].longitude 
                })
            }
            setTimeout(function() {
                that.setData({
                    loading: false
                })
            }, 3000)
        }

        //使用百度api查询周边信息
        //其中使用到了dataset属性
        BMap.search({
            query: e, 
            success: success,
            fail: fail 
        })

    }

})