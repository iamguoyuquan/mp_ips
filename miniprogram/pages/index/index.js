const { Tab } = require('../../assets/libs/zanui/index');
const utils = require('../../utils/util.js')

var app = getApp();
Page(Object.assign({}, Tab, {
  data: {
    doctorIndex:0,
    bannerList: [],
    archivesList: [],
    loading: false,
    nodata: false,
    nomore: false,
    days: 30,
    diseaseType: 0,
    showCard: false,
    days: 7,
    cardColor: "#2AC2C3;",
    tab: {
      list: [],
      selectedId: '0',
      scroll: true,
      height: 44
    },
  },
  channel: 0,
  page: 1,
  onLoad: function (options) {
    var that = this;
    this.channel = 0;
    this.page = 1;
    
    if(!app.globalData.userInfo){
      app.globalData.userInfo = wx.getStorageSync('userInfo')
    }

    if(app.globalData.userInfo && app.globalData.userInfo.doctorList){
      that.setData({
        doctorList: app.globalData.userInfo.doctorList
      });
      wx.setStorageSync('userInfo', app.globalData.userInfo)
    }else {
      that.setData({
        doctorList: []
      });
    } 

    if (app.globalData.userInfo && app.globalData.userInfo.patient) {
      const patientId = app.globalData.userInfo.patient.id 
      if (app.globalData.userInfo.patient.disease === '哮喘') {
        this.setData({
          diseaseType: 1,
        });
        
        app.request('/user/getReport', {patient_id: patientId, type: 1}, function (data, ret) {
          if (data.total > 0) {
            let current = data.list[0]
            let timestamp = Date.parse(new Date());
            let days =  parseInt ((timestamp / 1000 - current.updatetime) / 86400)
            let report = JSON.parse(current.report)
            const [type, title, content, color] = utils.getACTText(report.act)
            that.setData({
              showCard: true,
              days: days,
              act: report.act,
              actText: title,
              cardColor: color
            });
          }
        }, function (data, ret) {
          app.error(ret.msg);
        });
      } else if(app.globalData.userInfo.patient.disease === '慢阻肺') {
        this.setData({
          diseaseType: 2,
        });
        
        app.request('/user/getReport', {patient_id: patientId, type: 2}, function (data, ret) {
          if (data.total > 0) {
            let current = data.list[0]
            let timestamp = Date.parse(new Date());
            let days =  parseInt ((timestamp / 1000 - current.updatetime) / 86400)
            let report = JSON.parse(current.report)
            const [type, content, color] = utils.getCOPDText(report.mMRC, report.cat)
            const mrc = utils.getMRCLevel(report.mMRC)
            const copd = utils.getCOPDLevel(report.cat)
           
            that.setData({
              showCard: true,
              days: days,
              mMRC: report.mMRC,
              cat: report.cat,
              mMRCText: mrc,
              catText: copd,
              cardColor: color
            });
          }
        }, function (data, ret) {
          app.error(ret.msg);
        });
      }
    } 

    let doctorId = wx.getStorageSync('doctorId');
    let found = false;
    let doctorIndex = 0;

    found = that.data.doctorList.find((x,index) => {
      if(x.id == doctorId){
        doctorIndex = index;
        return true;
      }
    })

    that.setData({
      doctorIndex:doctorIndex
    })

    if(!found && that.data.doctorList.length){
      doctorId = that.data.doctorList[0].id
      wx.setStorageSync('doctorId', doctorId);
    }

    if(doctorId){
      that.getDoctor(doctorId);
    }
    

    // app.request('/index/index', {}, function (data, ret) {
    //   that.setData({
    //     bannerList: data.bannerList,
    //     archivesList: data.archivesList,
    //     ["tab.list"]: data.tabList
    //   });
    // }, function (data, ret) {
    //   app.error(ret.msg);
    // });

    let admin_ids = []
    if(app.globalData.userInfo && app.globalData.userInfo.doctorList){
  // if(false){
      app.globalData.userInfo.doctorList.forEach(x=>{
        admin_ids.push(x.admin_id);
      })
      app.request('/archives/recommend', {admin_ids:admin_ids}, function (data, ret) {
        that.setData({
          archivesList: data.archivesList
        });
      }, function (data, ret) {
        app.error(ret.msg);
      });
    }else{
      app.request('/archives/index', {channel:4}, function (data, ret) {
        that.setData({
          // bannerList: data.bannerList,
          archivesList: data.archivesList,
          // ["tab.list"]: data.tabList
        });
      }, function (data, ret) {
        app.error(ret.msg);
      });
    }


  },
  onReady() {
  },

  getDoctor: function (doctorId) {
    var that = this;

    app.request('/user/doctor', {id:doctorId}, function (data) {
      if(!data.doctorInfo){
        app.error('没有找到医生');
      }
      that.setData({ 
        doctorInfo: data.doctorInfo,
        showForm:true
       });
      //  that.createShareImg(data.doctorInfo)
    }, function (data, ret) {
      app.error(ret.msg);
    });
  },

  createShareImg: function(doctorInfo){
    setTimeout(()=>{
      const canvas1 = this.selectComponent('.canvas-com');
    
      canvas1.onCreate(doctorInfo.avatar, doctorInfo.name, doctorInfo.department + ' ' + doctorInfo.position ).then(imgTempPath=>{
        this.setData({
          shareimgsrc: imgTempPath,
        })
      });
    }, 3000);
  
  },

  bindDoctorChange:function(e){
    let that = this;
    let v = e.detail.value

    that.setData({
      [`doctorIndex`]:v
    })

    let doctorId = this.data.doctorList[v].id;
    if(doctorId){
      wx.setStorageSync('doctorId', doctorId);
      that.getDoctor(doctorId);
    }
  },

  // onPullDownRefresh: function () {
  //   this.setData({ nodata: false, nomore: false });
  //   this.page = 1;
  //   this.loadArchives(function () {
  //     wx.stopPullDownRefresh();
  //   });
  // },
  // onReachBottom: function () {
  //   var that = this;
  //   this.loadArchives(function (data) {
  //     if (data.archivesList.length == 0) {
  //       app.info("暂无更多数据");
  //     }
  //   });
  // },
  loadArchives: function (cb) {
    var that = this;
    if (that.data.nomore == true || that.data.loading == true) {
      return;
    }
    this.setData({ loading: true });
    app.request('/archives/index', { channel: this.channel, page: this.page }, function (data, ret) {
      that.setData({
        loading: false,
        nodata: that.page == 1 && data.archivesList.length == 0 ? true : false,
        nomore: that.page > 1 && data.archivesList.length == 0 ? true : false,
        archivesList: that.page > 1 ? that.data.archivesList.concat(data.archivesList) : data.archivesList,
      });
      that.page++;
      typeof cb == 'function' && cb(data);
    }, function (data, ret) {
      app.error(ret.msg);
    });
  },

  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    this.channel = selectedId;
    this.page = 1;
    this.setData({
      nodata: false,
      nomore: false,
      [`${componentId}.selectedId`]: selectedId
    });
    wx.pageScrollTo({ scrollTop: 0 });
    this.loadArchives();
  },
  onShareAppMessage: function () {
    return {
      title: '点击卡片↓，加入医生联系名单',
      desc: 'IPS',
      path: '/pages/my/join?doctorId=' + this.data.doctorInfo.id
    }
  },
 
  goMRCTest() {
    wx.navigateTo({
      url:'/pages/papers/mMRC'
    });
  },

  goACTTest() {
    wx.navigateTo({
      url:'/pages/papers/act'
    });
  },
  
  goDetail(event){
    wx.navigateTo({
      url:'/pages/post/detail?id='+event.detail.id
    });
  }
}))