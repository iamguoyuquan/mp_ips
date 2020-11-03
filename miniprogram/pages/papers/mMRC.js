const app = getApp();

Page({
  data: {
    radioCheck: -1,
    mMRC: [
      { name: '0级', value: '我仅在费力运动时出现呼吸困难' },
      { name: '1级', value: '我平底快步行走或步行爬小坡时出现气短' },
      { name: '2级', value: '我由于气短，平地行走时比同龄人慢，或者需要停下了休息' },
      { name: '3级', value: '我在平地行走100米左右或者需要停下来喘气' },
      { name: '4级', value: '我因严重呼吸困难以至于不能离家，或在穿、脱衣服时出现呼吸困难' }
    ],
  },

  radioChange(e) {
    var check = 0
    for (let i = 0, len = this.data.mMRC.length; i < len; ++i) {
      if (i.toString() === e.detail.value) {
        check = i
        break
      }
    }
    this.setData({
      radioCheck: check
    })
    wx.navigateTo({
      url: '/pages/papers/cat?mMRC=' + check
    });

  },

  onLoad(options) {
    if (!app.globalData.userInfo) {
      app.globalData.userInfo = wx.getStorageSync('userInfo')
    }
    if (options.doctorId) {
      if (app.globalData.userInfo && app.globalData.userInfo.doctorList) {
        let r = app.globalData.userInfo.doctorList.some(x => {
          return x.id == options.doctorId
        })
  
        if (!r) {
          wx.reLaunch({
            url: '/pages/my/join?doctorId=' + options.doctorId + '&prepage=2'
          })
        } else {
          this.setData({
            doctorId: options.doctorId,
          })
        }
      } else {
        wx.reLaunch({
          url: '/pages/my/join?doctorId=' + options.doctorId + '&prepage=2'
        })
      }
    } else {
      let doctorId = wx.getStorageSync('doctorId');
      this.setData({
        doctorId: doctorId
      })     
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
      title: '慢肺阻评估',
      path: '/pages/papers/mMRC?doctorId=' + this.data.doctorId
    };
  },
});