const app = getApp();

Page({
  data: {
    prescription: 0,
    prescription_imgs: [],
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
              let prescription_imgs = that.data.prescription_imgs;
              imgs.push(tempFilePath);
              prescription_imgs.push(app.globalData.config.upload.cdnurl + data.data.url)
              that.setData({
                prescription_imgs: prescription_imgs,
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
    let prescription_imgs = this.data.prescription_imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    prescription_imgs.splice(index, 1);
    this.setData({
      prescription_imgs: prescription_imgs,
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

  onYes() {
    this.setData({
      prescription: 1
    })
  },

  onNo() {
    this.setData({
      prescription: 0
    })
  },

  onNext() {
    wx.setStorageSync('prescription', this.data.prescription)
    wx.setStorageSync('prescription_imgs', this.data.prescription_imgs)
    wx.navigateTo({
      url: '/pages/doctor/treatment3',
    });
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