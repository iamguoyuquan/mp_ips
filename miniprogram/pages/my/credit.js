const app = getApp();

Page({
  data: {
    credit: app.globalData.credit,

  },
  onLoad(options) {
    let that = this;
    if(!app.globalData.userInfo){
      app.globalData.userInfo = wx.getStorageSync('userInfo')
    }

    if(app.globalData.userInfo && app.globalData.userInfo.patient){
      const patientId = app.globalData.userInfo.patient.id 
      app.request('/user/getPoint', {patient_id: patientId}, function (data, ret) {
        let history = data.list.map((item)=>{
          let d = new Date(item.createtime * 1000)
          return {
            type: item.type,
            timeStr: d.getFullYear()+"."+(d.getMonth()+1)+"."+d.getDate(),
            point: item.point
          }
        })
        that.setData({
          credit: data.sum,
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