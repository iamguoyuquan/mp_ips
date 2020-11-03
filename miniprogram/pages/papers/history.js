import * as echarts from '../../components/ec-canvas/echarts';
const utils = require('../../utils/util.js')

var app = getApp();

Page({
  data: {
    ec: {
      lazyLoad: true
    },
    cardColor: 'black',
    chartData: [],
    diseaseType: 0
  },
  onLoad(options) {
    this.echartsComponnet = this.selectComponent('#echart');
    if (!app.globalData.userInfo) {
      app.globalData.userInfo = wx.getStorageSync('userInfo')
    }
    let doctorId = wx.getStorageSync('doctorId');
    if (doctorId) {
      this.setData({
        doctorId: doctorId
      })
    }
    this.getData(); //获取数据
  },

  getData: function () {
    let that = this;

    if (app.globalData.userInfo && app.globalData.userInfo.patient) {
      const patientId = app.globalData.userInfo.patient.id
      if (app.globalData.userInfo.patient.disease === '哮喘') {
        this.setData({
          diseaseType: 1,
        });

        app.request('/user/getReport', { patient_id: patientId, type: 1 }, function (data, ret) {
          if (data.total > 0) {
            let current = data.list[0]
            let report = JSON.parse(current.report)
            const [type, title, content, color] = utils.getACTText(report.act)
            let chartData = data.list.slice(0, 4).map((item) => {
              let report = JSON.parse(item.report)
              let d = new Date(item.updatetime * 1000)
              let [atype, atitle, acontent, acolor] = utils.getACTText(report.act)
              return {
                date: item.updatetime,
                dateYear: d.getFullYear(),
                dateMDay: (d.getMonth()+1) +'-'+ d.getDate(),
                act: report.act,
                actText: acontent,
              }
            })

            that.setData({
              chartData: chartData,
              act: report.act,
              actText: title,
              cardColor: color
            }, () => {
              that.initCharts()
            })
          }
        }, function (data, ret) {
          app.error(ret.msg);
        });
      } else if (app.globalData.userInfo.patient.disease === '慢阻肺') {
        this.setData({
          diseaseType: 2,
        });
        app.request('/user/getReport', { patient_id: patientId, type: 2 }, function (data, ret) {
          if (data.total > 0) {
            let current = data.list[0]
            let report = JSON.parse(current.report)
            const [type, content, color] = utils.getCOPDText(report.mMRC, report.cat)
            const mrc = utils.getMRCLevel(report.mMRC)
            const copd = utils.getCOPDLevel(report.cat)

            let chartData = data.list.slice(0, 4).map((item) => {
              let report = JSON.parse(item.report)
              let d = new Date(item.updatetime * 1000)
              return {
                date: item.updatetime,
                dateYear: d.getFullYear(),
                dateMDay: (d.getMonth()+1) +'-'+ d.getDate(),
                mMRC: report.mMRC,
                cat: report.cat,
                mMRCText: utils.getMRCLevel(report.mMRC),
                copd: utils.getCOPDLevel(report.cat),
              }
            })

            that.setData({
              chartData: chartData,
              mMRC: report.mMRC,
              cat: report.cat,
              mMRCText: mrc,
              catText: copd,
              cardColor: color
            }, () => {
              that.initCharts()
            })
          }
        }, function (data, ret) {
          app.error(ret.msg);
        });
      }
    }
  },

  initCharts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      if (this.data.diseaseType == 1) {
        Chart.setOption(this.getActOption());
      } else if (this.data.diseaseType == 2) {
        Chart.setOption(this.getMRCOption());
      }
      return Chart;
    });
  },

  getActOption: function () {
    var option = {
      title: {
        text: '最近4次',
      },
      color: ["#5B8FF9"],
      dataset: {
        dimensions: ['date', 'act'],
        source: this.data.chartData
      },
      legend: {
        data: ['ACT'],
        tooltip: {
          triggerOn: "axis",
          alwaysShowContent: true
        },
      },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        inverse: true,
        axisLabel: {
          rotate: 60,
          formatter: this.formatTime
        },
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value',
        name: 'ACT',
        max: 25,
        splitNumber: 5,
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      series: {
        name: 'act',
        type: 'line',
      }
    };
    return option;
  },

  getMRCOption: function () {
    var option = {
      title: {
        text: '最近4次',
      },
      color: ["#5B8FF9", "#5AD8A6"],
      dataset: {
        dimensions: ['date', 'mMRC', 'cat'],
        source: this.data.chartData
      },
      legend: {
        data: ['mMRC', 'cat'],
        tooltip: {
          triggerOn: "axis",
          alwaysShowContent: true
        },
      },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        inverse: true,
        axisLabel: {
          rotate: 60,
          formatter: this.formatTime
        },
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'mMRC',
          min: 0,
          max: 4,
          splitNumber: 4,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        {
          type: 'value',
          name: 'cat',
          min: 0,
          max: 40,
          splitNumber: 4,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        }
      ],
      series: [{
        name: 'mMRC',
        type: 'line',
        width: 4,
        symbolSize: 6,
      }, {
        name: 'CAT',
        yAxisIndex: 1,
        type: 'line',
        width: 4,
        symbol: 'circle',
        symbolSize: 6,
      }]
    };
    return option;
  },

  formatTime(time) {
    let d = new Date(time * 1000)
    return d.getFullYear() + ' ' + (d.getMonth()+1) + '-' + d.getDate()
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
      title: '点击卡片↓，加入医生联系名单',
      desc: 'IPS',
      imageUrl: this.data.shareimgsrc,
      path: '/pages/my/join?doctorId=' + this.data.doctorId
    }
  },
});