const app = getApp();
Page({

  data: {
    hasNew: true,
  },

  onLoad() {
    let that = this;
    if (!app.globalData.userInfo) {
      app.globalData.userInfo = wx.getStorageSync('userInfo')
    }

    if (app.globalData.userInfo && app.globalData.userInfo) {
      const patientId = app.globalData.userInfo.patient.id
      app.request('/my/getLatelyCaseDay', { patient_id: patientId }, function (data, ret) {
        if (data.day > 0) {
          let d = new Date(data.day * 1000)
          that.setData({ prev: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() })
        }
      }, function (data, ret) {
        app.error(ret.msg);
      });
    }
  },

  onYes() {
    this.setData({
      hasNew: true,
    })

  },

  onNo() {
    this.setData({
      hasNew: false,
    })
  },

  onNext() {
    if (this.data.hasNew) {
      wx.navigateTo({
        url: '/pages/doctor/treatment',
      });
    } else {
      wx.navigateTo({
        url: '/pages/doctor/question',
      });
    }
  },

  onShareAppMessage: function () {

  }
})