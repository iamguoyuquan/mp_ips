Page({
  data: {
    source: 1,
    add_day: "",
    sub_vister: 0,
    sub_vister_time: "",
  },

  bindDateChange(e) {
    this.setData({
      add_day: e.detail.value
    })
  },

  onMZ() {
    this.setData({
      source: 1
    })
  },

  onZY() {
    this.setData({
      source: 2
    })
  },

  bindSubVisitTimeChange(e) {
    this.setData({
      sub_vister_time: e.detail.value,
    })
  },

  onYes() {
    this.setData({
      sub_vister: 1,
    })
  },

  onNo() {
    this.setData({
      sub_vister: 0,
    })
  },

  onNext() {
    if (this.data.add_day == "") {
      wx.showModal({
        showCancel: false,
        content: '请选择就诊日期'
      })
    } else if (this.data.sub_vister == 1 && this.data.sub_vister_time == "") {
      wx.showModal({
        showCancel: false,
        content: '请选择复诊时间'
      })
    } else {
      wx.setStorageSync('source', this.data.source)
      wx.setStorageSync('add_day', this.data.add_day)
      wx.setStorageSync('sub_vister', this.data.sub_vister)
      wx.setStorageSync('sub_vister_time', this.data.sub_vister_time)
      wx.navigateTo({
        url: '/pages/doctor/treatment1',
      });
    }
  },

  onLoad(options) {
    wx.removeStorageSync('source')
    wx.removeStorageSync('add_day')
    wx.removeStorageSync('sub_vister')
    wx.removeStorageSync('sub_vister_time')
    wx.removeStorageSync('check_list')
    wx.removeStorageSync('check_list_img')
    wx.removeStorageSync('prescription')
    wx.removeStorageSync('prescription_img')
    wx.removeStorageSync('case_imgs')
  },
  onReady() {

  },
  onShow() {

  },
  onHide() {

  },
  onUnload() {

  },
});