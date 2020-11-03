const app = getApp();

Page({
  data: {
    case_imgs: [],
    imgs: [],
  },
  chooseImg: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePath = res.tempFilePaths[0];
        var formData = app.globalData.config.upload.multipart;
        formData.token = app.globalData.userInfo.token;
        wx.uploadFile({
          url: app.globalData.config.upload.uploadurl,
          filePath: tempFilePath,
          name: 'file',
          formData: formData,
          success: function (res) {
            var data = JSON.parse(res.data);
            if (data.code == 1) {
              let imgs = that.data.imgs;
              let case_imgs = that.data.case_imgs;
              imgs.push(tempFilePath);
              case_imgs.push(app.globalData.config.upload.cdnurl + data.data.url)
              that.setData({
                case_imgs: case_imgs,
                imgs: imgs
              });
            }
          },
          fail: function (e) {
            console.log(e);
          }
        });
      },
      fail: function (e) {
        console.log(e);
      }
    });
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    let case_imgs = this.data.case_imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      case_imgs: case_imgs,
      imgs: imgs
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },

  onNext() {
    let case_imgs = this.data.case_imgs
    if (case_imgs.length == 0) {
      wx.showModal({
        showCancel: false,
        content: '请上传病例'
      })
    } else {
      let patient_id = (app.globalData.userInfo && app.globalData.userInfo.patient)?app.globalData.userInfo.patient.id:0;
      let source = wx.getStorageSync('source')
      let add_day = wx.getStorageSync('add_day')
      let sub_vister = wx.getStorageSync('sub_vister')
      let sub_vister_time = wx.getStorageSync('sub_vister_time')
      let check_list = wx.getStorageSync('check_list')
      let check_list_imgs = wx.getStorageSync('check_list_imgs')
      let prescription = wx.getStorageSync('prescription')
      let prescription_imgs = wx.getStorageSync('prescription_imgs')
     
      app.request('/my/updateCase', {
        patient_id: patient_id,
        source: source,
        add_day: add_day,
        sub_vister: sub_vister,
        sub_vister_time: sub_vister_time,
        check_list: check_list,
        check_list_imgs: check_list_imgs,
        prescription: prescription,
        prescription_imgs: prescription_imgs,
        case_imgs: case_imgs
      }, function (data, ret) {
      }, function (data, ret) {
        app.error(ret.msg);
      });
  
      wx.reLaunch({
        url: '/pages/doctor/question',
      });
    }
  },
  
  onLoad(options) {

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