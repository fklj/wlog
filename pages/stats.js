//stats.js
const log = require('../utils/log.js')
const wxCharts = require('../utils/wxcharts.js');
const moment = require('../utils/moment.js')

Page({
  data: {
  },
  dates: function () {
    const s = moment().startOf('month')
    const e = s.clone().endOf('month')
    let result = []
    for (let d = s; d.unix() < e.unix(); d = d.clone().add(1, 'days')) {
      result.push(d.clone())
    }
    return result
  },
  onLoad: function (options) {
    let hid = options.id
    let all = wx.getStorageSync('records') || {}
    let habits = wx.getStorageSync('habits') || {}
    let records = all[hid]
    let habit = habits[hid]
    let values = {}

    for (let k in records) {
      let t = parseInt(k)
      let dayKey = moment(t).startOf('day').unix()
      values[dayKey] = habit.type === 'number' ? records[t] : parseInt(records[t]) + 1
    }

    const res = wx.getSystemInfoSync();
    const windowWidth = res.windowWidth;

    const maxValue = Object.values(values).reduce((x,y) => Math.max(x,y))

    new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      categories: Object.keys(values),
      series: [{
        name: habit.name,
        data: Object.values(values),
      }],
      yAxis: {
        format: function (val) {
          return val + ' ' + habit.unit;
        },
        min: 0,
        max: Math.floor(maxValue / 5 - 0.1) * 5 + 5
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: windowWidth - 50,
      height: 200,
    });
  }
})
