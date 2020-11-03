const utils = require('../../utils/util.js')
const app = getApp();

Page({
  data: {
    hidden: true,
    color: 'black',
    type: 1,
    disable: true,
    acts: [
      {id: 1, choose: -1, content: '在过去4周，在工作，学习、或家中生活中，有多少时候哮喘妨碍你进行日常活动?',  options: [
        {name: 'A', point: 1, value: 'A: 所有时间'},
        {name: 'B', point: 2, value: 'B: 大多数时间'},
        {name: 'C', point: 3, value: 'C: 有些时候'},
        {name: 'D', point: 4, value: 'D: 很少时候'},
        {name: 'E', point: 5, value: 'E: 没有'}
      ]},
      {id: 2, choose: -1, content: '在过去4周内，你有多少次呼吸困难？',  options: [
        {name: 'A', point: 1, value: 'A: 每天不止一次'},
        {name: 'B', point: 2, value: 'B: 一天1次'},
        {name: 'C', point: 3, value: 'C: 每周3~6次'},
        {name: 'D', point: 4, value: 'D: 每周1~2次'},
        {name: 'E', point: 5, value: 'E: 完全没有'}
      ]},
      {id: 3, choose: -1, content: '在过去4周内，因为哮喘症状（喘息、咳嗽、呼吸困难，胸闷疼痛），您有多少次在夜间醒来或早上比平时早醒？',  options: [
        {name: 'A', point: 1, value: 'A: 每周4晚或更多'},
        {name: 'B', point: 2, value: 'B: 每周2至3晚'},
        {name: 'C', point: 3, value: 'C: 每周1次'},
        {name: 'D', point: 4, value: 'D: 每周1~2次'},
        {name: 'E', point: 5, value: 'E: 没有'}
      ]},
      {id: 4, choose: -1, content: '在过去4周内，您有多少次使用急救药物治疗（如沙丁胺醇）?',  options: [
        {name: 'A', point: 1, value: 'A: 每天3次以上'},
        {name: 'B', point: 2, value: 'B: 每天1至2次'},
        {name: 'C', point: 3, value: 'C: 每周2至3次'},
        {name: 'D', point: 4, value: 'D: 每周1次或更少'},
        {name: 'E', point: 5, value: 'E: 没有'}
      ]},
      {id: 5, choose: -1, content: '5.您如何评估过去4周内您的哮喘控制情况？',  options: [
        {name: 'A', point: 1, value: 'A: 没有控制'},
        {name: 'B', point: 2, value: 'B: 控制很差'},
        {name: 'C', point: 3, value: 'C: 有所控制'},
        {name: 'D', point: 4, value: 'D: 控制的很好'},
        {name: 'E', point: 5, value: 'E: 完全控制'}
      ]}
    ]

  },
  radioChange(e) {
    const index = e.target.id
    const acts = this.data.acts
    let disable = false
    acts[index].choose = e.detail.value
 
    acts.forEach(element => {
      if (element.choose == -1)
        disable = true
    });
    
    this.setData({
      disable: disable,
      acts: acts
    })
  },

  showPopup(e) {
    wx.showToast({
      title: '成功获得+2积分',
      success: ()=>{
        let total = 0
        for (let i = 0, len = this.data.acts.length; i < len; ++i) {
          total += Number(this.data.acts[i].choose) + 1
        }
        const [type, title, content, color] = utils.getACTText(total)
        setTimeout(()=>{
          this.setData({
            score: total,
            content: content,
            title: title,
            color: color,
            type: type,
            hidden: false 
          })
        }, 2000) 
      }
    })
  },

  submit() {
    this.setData({
      hidden: true
    })
    let patient_id = (app.globalData.userInfo && app.globalData.userInfo.patient)?app.globalData.userInfo.patient.id:0;

    let request = {
      type: 1,
      patient_id: patient_id,
      report: JSON.stringify({
        act: this.data.score
      })
    }

    app.request('/user/setReport', request, function (data) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }, function (data, ret) {
      app.error(ret.msg)
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
            url: '/pages/my/join?doctorId=' + options.doctorId + '&prepage=1'
          })
        } else {
          this.setData({
            doctorId: options.doctorId
          })
        }
      } else {
        wx.reLaunch({
          url: '/pages/my/join?doctorId=' + options.doctorId + '&prepage=1'
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
      title: '哮喘评估',
      path: '/pages/papers/act?doctorId=' + this.data.doctorId
    };
  },
});