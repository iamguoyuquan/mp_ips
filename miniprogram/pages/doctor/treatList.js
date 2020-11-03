const app = getApp();
Page({
  data: {

  },

  onNew() {
    wx.navigateTo({
      url: '/pages/doctor/index',
    });
  },

  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var hid = e.currentTarget.dataset.hid;
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.history[hid].urls;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },

  onLoad(options) {
    let that = this;
    if (!app.globalData.userInfo) {
      app.globalData.userInfo = wx.getStorageSync('userInfo')
    }

    if (app.globalData.userInfo && app.globalData.userInfo) {
      const patientId = app.globalData.userInfo.patient.id
      app.request('/my/getMyCase', { patient_id: patientId }, function (data, ret) {
        let history = data.data.map((item) => {
          let d = new Date(item.add_day * 1000)
          return {
            timeStr: d.getFullYear() + " " + (d.getMonth() + 1) + "." + d.getDate(),
            urls: item.imgs
          }
        })
        that.setData({
          history: history,
        })
      }, function (data, ret) {
        app.error(ret.msg);
      });
    }
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