var app = getApp();

Page({
  data: {
    isWxapp: true,
    point: 0,
    sign: 0,
    assess: 0,
    leave_message: 0,
    read_count: 0
  },

  getUserInfo: function (e) {
    let that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              that.setData({
                avatar: res.userInfo.avatarUrl
              })
            }
          })
        }
      }
    })
  },

  onLoad: function () {
    const doctorId = wx.getStorageSync('doctorId');
    let that = this

    if (!app.globalData.userInfo) {
      app.globalData.userInfo = wx.getStorageSync('userInfo');
    }

    if (app.globalData.userInfo && app.globalData.userInfo.doctorList) {
      const doctorInfo = app.globalData.userInfo.doctorList.find((x, index) => {
        if (x.id == doctorId) {
          return true;
        }
      })

      this.setData({
        userInfo: app.globalData.userInfo,
        doctorInfo: doctorInfo,
        isWxapp: this.isWxapp(),
        createStr: this.formatTime(app.globalData.userInfo.patient.createtime)
      })
    }
  },

  formatTime(time) {
    let d = new Date(time * 1000)
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
  },

  onShow: function () {
    let that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              that.setData({
                avatar: res.userInfo.avatarUrl
              })
            }
          })
        }
      }
    })

    if (app.globalData.userInfo && app.globalData.userInfo) {
      const patientId = app.globalData.userInfo.patient.id
      app.request("/user/getUserStatistics", { patient_id: patientId }, function (data, ret) {
        that.setData({ ...ret.data })
      }, function (data, ret) {
        app.error(ret.msg);
      });
    }
  },
  login: function () {
    var that = this;
    app.login(function () {
      that.setData({ userInfo: app.globalData.userInfo, isWxapp: that.isWxapp() });
    });
  },
  isWxapp: function () {
    return app.globalData.userInfo;
    return app.globalData.userInfo ? app.globalData.userInfo.username.match(/^u\d+$/) : true;
  },
  showTips: function (event) {
    var tips = {
      balance: '余额通过插件的出售获得',
      score: '积分可以通过回答问题获得',
      level: '等级通过官网活跃进行升级',
    };
    var type = event.currentTarget.dataset.type;
    var content = tips[type];
    wx.showModal({
      title: '温馨提示',
      content: content,
      showCancel: false
    });
  },
  //点击头像上传
  uploadAvatar: function () {
    if (!app.globalData.userInfo) {
      app.error("请登录后再操作");
      return false;
    }
    var that = this;
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var formData = app.globalData.config.upload.multipart;
        formData.token = app.globalData.userInfo.token;
        wx.uploadFile({
          url: app.globalData.config.upload.uploadurl,
          filePath: tempFilePaths[0],
          name: 'file',
          formData: formData,
          success: function (res) {
            var data = JSON.parse(res.data);
            if (data.code == 200) {
              app.request("/user/avatar", { avatar: data.url }, function (data, ret) {
                app.success('头像上传成功!');
                app.globalData.userInfo = data.userInfo;
                that.setData({ userInfo: data.userInfo, isWxapp: that.isWxapp() });
              }, function (data, ret) {
                app.error(ret.msg);
              });
            }
          }, error: function (res) {
            app.error("上传头像失败!");
          }
        });
      }, error: function (res) {
        app.error("上传头像失败!");
      }
    });
  },

  showForm: function (userinfo) {
    let that = this;
    if (userinfo && (userinfo['isAdmin'] || !this.data.doctorId)) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  },

  gotoMedical() {
    if (this.data.userInfo) {
      wx.switchTab({
        url: '/pages/medicClock/index'
      })
    } else {
      wx.reLaunch({
        url: '/pages/index/login',
      })
    }
  },

  gotoFav: function () {
    if (this.data.userInfo) {
      wx.switchTab({
        url: '/pages/post/index'
      })
    } else {
      wx.reLaunch({
        url: '/pages/index/login',
      })
    }
  },

  gotoHistory: function () {
    if (this.data.userInfo) {
      wx.navigateTo({
        url: '/pages/papers/history'
      })
    } else {
      wx.reLaunch({
        url: '/pages/index/login',
      })
    }
  },

  gotoMsg: function () {
    if (this.data.userInfo) {
      wx.navigateTo({
        url: '/pages/doctor/question'
      })
    } else {
      wx.reLaunch({
        url: '/pages/index/login',
      })
    }
  },

  gotoTreat: function () {
    if (this.data.userInfo) {
      wx.navigateTo({
        url: '/pages/doctor/treatList'
      })
    } else {
      wx.reLaunch({
        url: '/pages/index/login',
      })
    }
  }
})
