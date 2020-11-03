const utils = require('../../utils/util.js')
const app = getApp();

Page({
  data: {
    mMRC: 0,
    hidden: true,
    disable: true,
    cats: [
      {
        id: 1, content1: '从不咳嗽', content2: '我一直在咳嗽', value: -1, options: [
          { point: 1 }, { point: 2 }, { point: 3 }, { point: 4 }, { point: 5 }]
      },
      {
        id: 2, content1: '我一点痰也没有', content2: '我有很多痰', value: -1, options: [
          { point: 1 }, { point: 2 }, { point: 3 }, { point: 4 }, { point: 5 }]
      },
      {
        id: 3, content1: '我一点也没有胸闷的感觉', content2: '我有很重的胸闷的感觉', value: -1, options: [
          { point: 1 }, { point: 2 }, { point: 3 }, { point: 4 }, { point: 5 }]
      },
      {
        id: 4, content1: '当我在爬坡或爬一层楼梯时，我并不感到喘不过气来', content2: '当我在爬坡或爬一层楼梯时，我感到非常喘不过气来', value: 3, options: [
          { point: 1 }, { point: 2 }, { point: 3 }, { point: 4 }, { point: 5 }]
      },
      {
        id: 5, content1: '在家里的任何劳动都不受慢阻肺的影响', content2: '在家里的任何劳动都很受慢阻肺的影响', value: -1, options: [
          { point: 1 }, { point: 2 }, { point: 3 }, { point: 4 }, { point: 5 }]
      },
      {
        id: 6, content1: '每当我想外出时就能外出', content2: '因为我有慢阻肺，所以从来没有外出过', value: -1, options: [
          { point: 1 }, { point: 2 }, { point: 3 }, { point: 4 }, { point: 5 }]
      },
      {
        id: 7, content1: '我睡眠非常好', content2: '因为我有慢阻肺，我睡眠非常不好', value: -1, options: [
          { point: 1 }, { point: 2 }, { point: 3 }, { point: 4 }, { point: 5 }]
      },
      {
        id: 8, content1: '我精力旺盛', content2: '我一点精力也没有', value: -1, options: [
          { point: 1 }, { point: 2 }, { point: 3 }, { point: 4 }, { point: 5 }]
      },
    ]
  },

  sliderChange(e) {
    const index = e.target.id
    const cats = this.data.cats
    cats[index].value = parseInt(e.detail.value) 

    let disable = false

    cats.forEach(element => {
      if (element.value == -1)
        disable = true
    });
    
    this.setData({
      disable: disable,
      cats: cats
    })
  },

  showPopup(e) {
    wx.showToast({
      title: '成功获得+2积分',
      success: ()=>{
        var total = 0
        for (let i = 0, len = this.data.cats.length; i < len; ++i) {
          total += this.data.cats[i].value
        }
        const [type, content, color] = utils.getCOPDText(this.data.mMRC, total)
        const mrc = utils.getMRCLevel(this.data.mMRC)
        const copd = utils.getCOPDLevel(total)
        setTimeout(()=>{
          this.setData({
            cat: total,
            content: content,
            mMRCText: mrc,
            copdText: copd,
            color: color,
            type: type,
            hidden: false 
          })
        }, 2000) 
      }
    })
  },

  submit(){
    this.setData({
      hidden: true
    })
    let patient_id = (app.globalData.userInfo && app.globalData.userInfo.patient)?app.globalData.userInfo.patient.id:0;

    let request = {
      type: 2,
      patient_id: patient_id,
      report: JSON.stringify({
        mMRC: this.data.mMRC,
        cat: this.data.cat
      })
    }
  
    app.request('/user/setReport', request, function (data) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }, function (data, ret) {
    });
  },

  onLoad(options) {
    if(!app.globalData.userInfo){
      app.globalData.userInfo = wx.getStorageSync('userInfo')
    }
    if (options.doctorId) {
      if(app.globalData.userInfo && app.globalData.userInfo.doctorList){
        let r = app.globalData.userInfo.doctorList.some( x => {
          return x.id == options.doctorId
        })
         
        if(!r){
          wx.reLaunch({
            url: '/pages/my/join?doctorId=' + options.doctorId + '&prepage=2'
          })
        } else {
          this.setData({
            doctorId: options.doctorId,
            mMRC : options.mMRC
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
        doctorId: doctorId,
        mMRC : options.mMRC
      })     
    }
    
  },
  onReady() {
    this.popup = this.selectComponent("#popup");
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
    }
   },
});