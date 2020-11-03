var app = getApp();
Page({
  data: {

  },

  getPhoneNumber(e) {
    wx.cloud.callFunction({
      name: 'getMobile',
      data: {
        weRunData: wx.cloud.CloudID(e.detail.cloudID),
      }
    }).then(res => {
      app.globalData.mobile = res.result;
      wx.setStorageSync('mobile', res.result);
      // wx.setStorageSync('mobile', "18019246261");
      app.loginByMobile(res.result, function (data) {
      // app.loginByMobile( "18019246261", function (data) {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      })
    }).catch(err => {
      console.error(err);
      // app.loginByMobile("18019246261", function (data) {
      //   console.log(data)
      //   wx.reLaunch({
      //     url: '/pages/index/index',
      //   })
      // })
    });
  },
  
  
  onLoad(options) {

  },
  onReady() {

  },
  onShow() {

  },
  onHide() {

  },
  onUnload() {

  },
  onShareAppMessage() {
    return {
      title: '',
    };
  },
});