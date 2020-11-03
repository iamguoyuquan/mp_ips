var app = getApp();
let d = new Date();
function formatNum(num) {
  var res = Number(num);
  return res < 10 ? "0" + res : res;
}
Page({
  data: {
    hidden: true,
    today: d.getFullYear() + '-' + formatNum(d.getMonth() + 1) + '-' + formatNum(d.getDate()),
    markDays: [d.getFullYear() + '-' + formatNum(d.getMonth() + 1) + '-' + formatNum(d.getDate())],
    y: d.getFullYear(),
    m: d.getMonth() + 1,
    d: d.getDate()
  },
  onLoad: function (options) {
    if (!app.globalData.userInfo) {
      app.globalData.userInfo = wx.getStorageSync('userInfo')
    }
    let patient_id = (app.globalData.userInfo && app.globalData.userInfo.patient) ? app.globalData.userInfo.patient.id : 0;
    if (!patient_id) {
      wx.showModal({
        showCancel: false,
        content: '您还没有入组，无法咨询',
        success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
    this.setData({
      patient_id: patient_id
    })
  },

  onShow: function () {
    this.getClock();
    this.getClockByMonth(this.data.y, this.data.m);
  },

  onShareAppMessage: function () {
    return {
      path: '/pages/medicClock/index'
    }
  },

  onMyEvent: function (e) {
    this.setData({
      markDays: [e.detail.date]
    })
    // this.data.markDays = [e.detail.date];
    let tmp = e.detail.date.split('-')
    this.data.dateStr = e.detail.date
    this.data.y = tmp[0]
    this.data.m = tmp[1] * 1
    this.data.d = tmp[2]
    this.getClock();
  },
  onMyEvent2: function (e) {
    this.getClockByMonth(e.detail.y, e.detail.m);
  },

  getClockByMonth: function (y, m) {
    let that = this;
    let data = {
      patient_id: this.data.patient_id,
      y: y,
      m: m,
      d: 0
    }

    app.request('/user/getClock', data, function (data) {
      let list = data.list;
      let _data = {};
      if (!list) {
        _data = {};
      };
      list.forEach(x => {
        let dateStr = x.y + '-' + ('0' + x.m).substr(-2) + '-' + ('0' + x.d).substr(-2);
        if (!_data[dateStr]) _data[dateStr] = {}
        _data[dateStr][x.type + 'Done'] = true;
      })

      let markDaysSetHalf = [];
      let markDaysSet = [];
      Object.keys(_data).forEach(x => {
        if (Object.keys(_data[x]).length > 1) {
          markDaysSet.push(x)
        } else {
          markDaysSetHalf.push(x)
        }
      })

      that.setData({
        markDaysSet: markDaysSet,
        markDaysSetHalf: markDaysSetHalf
      })
    }, function (data, ret) {
    });
  },

  getClock: function () {
    let that = this;

    let data = {
      patient_id: this.data.patient_id,
      y: this.data.y,
      m: this.data.m,
      d: this.data.d
    }

    app.request('/user/getClock', data, function (data) {
      let list = data.list;
      if (!list) return;
      let _data = {
        'amDone': false,
        'pmDone': false
      }
      list.forEach(x => {
        _data[x.type + 'Done'] = true;
      })
      that.setData(_data)
    }, function (data, ret) {
    });
  },
  setClock: function (e) {
    let type = e.currentTarget.dataset.type;

    let date = this.data.dateStr;
    let selectD = new Date(date).getTime();
    let curTime = new Date().getTime();
    let isToday = true;

    if ((Math.ceil(selectD / 8640000)) != (Math.ceil(curTime / 8640000))) {
      isToday = false;
    }
    if (type == 'pm' && isToday && ((new Date).getHours() < 12)) {
      return wx.showModal({
        showCancel: false,
        content: '请遵照医嘱用药间隔时长进行用药'
      })
    }
    // if(type == 'am' && ((new Date).getHours() > 12)){
    //   return wx.showModal({
    //     showCancel:false,
    //     content:'已过打卡时间点'
    //   })
    // }

    let that = this;
    let data = {
      patient_id: this.data.patient_id,
      y: this.data.y,
      m: this.data.m,
      d: this.data.d,
      type: type
    }

    wx.showLoading();
    app.request('/user/setClock', data, function (data) {
      wx.hideLoading();

      that.setData({
        hidden: false,
        [`${type}Done`]: true
      })
      that.getClockByMonth(that.data.y, that.data.m);
    }, function (data, ret) {
      wx.hideLoading();
    });
  },


  unsetClock: function (e) {
    let type = e.currentTarget.dataset.type;

    let that = this;
    let data = {
      patient_id: this.data.patient_id,
      y: this.data.y,
      m: this.data.m,
      d: this.data.d,
      type: type
    }

    wx.showLoading();
    app.request('/user/unsetClock', data, function (data) {
      wx.hideLoading();
      that.setData({
        [`${type}Done`]: false
      })
      that.getClockByMonth(that.data.y, that.data.m);
    }, function (data, ret) {
      wx.hideLoading();
    });
  },

  onConfirm() {
    this.setData({
      hidden: true
    })
  }

})