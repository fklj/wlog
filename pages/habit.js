//daily.js
const log = require('../utils/log.js')

const template = {
  id: undefined,
  name: '新的活动',
  min: 0,
  max: 10,
  step: 1,
  unit: '',
  values: [],
  type: 'number',
  order: 100000,
  once: false
}

const types = ['check', 'number', 'custom']
const displayTypes = ['打卡', '数值', '自定义']

Page({
  data: {
    habit: {},
    hvalues: '',
    displayTypes,
    typeIndex: 0
  },
  getTypeIndex(type) {
    return types.findIndex(t => t === type)
  },
  onLoad: function (options) {
    log.info('options', options)
    let hid = options.id || -1
    let habits = getApp().data.habits
    let habit = habits[hid] || JSON.parse(JSON.stringify(template))
    let hvalues = habit.values.join(' ')
    let typeIndex = this.getTypeIndex(habit.type)
    this.setData({habit, hvalues, typeIndex})
  },
  changeType: function (event) {
    log.info('change type', event.detail.value)
    let index = event.detail.value
    this.data.habit.type = types[index]
    if (this.data.habit.type === 'check') {
      this.data.habit.once = true;
    }
    this.setData({habit: this.data.habit, typeIndex: index})
  },
  changeName: function (event) {
    log.info('e', event)
    this.data.habit.name = event.detail.value
    this.setData({habit: this.data.habit})
  },
  changeUnit: function (event) {
    log.info('e', event)
    this.data.habit.unit = event.detail.value
    this.setData({habit: this.data.habit})
  },
  changeMin: function (event) {
    this.data.habit.min = event.detail.value
    this.setData({habit: this.data.habit})
  },
  changeMax: function (event) {
    this.data.habit.max = event.detail.value
    this.setData({habit: this.data.habit})
  },
  changeOnce: function (event) {
    this.data.habit.once = event.detail.value
    this.setData({habit: this.data.habit})
  },
  changeValues: function (event) {
    log.info('change hvalues', event.detail.value)
    this.setData({hvalues: event.detail.value})
  },
  normalizeHabit: function(h, habits, hvalues) {
    let valuesStr = hvalues.replace(/^\s+|\s+$/g, '')
    if (h.type === 'custom') {
      h.values = valuesStr.split(/\s+/)
      h.min = 0
      h.max = h.values.length - 1
      h.step = 1
      h.unit = ''
    } else if (h.type === 'check') {
      h.values = []
      h.min = 0
      h.max = 1
      h.step = 1
      h.unit = ''
      h.once = true
    } else {
      h.values = []
    }
    h.id = h.id || Date.now()
    h.order = Math.min(h.order, Object.keys(habits).length - 1)
    return h
  },
  save: function () {
    // FIXME: 保证已经处理change事件
    // setTimeout(() => {
      let habits = getApp().data.habits
      let h = this.data.habit
      h = this.normalizeHabit(h, habits, this.data.hvalues)
      log.info('save habit', h)
      habits[h.id] = h
      getApp().save()
      wx.navigateBack()
    // }, 200)
  },
  remove: function () {
    let hid = this.data.habit.id
    if (this.data.habit.id > 0) {
      wx.showModal({
        title: '确认删除',
        content: '删除后不可恢复，但活动记录会保留',
        success: function(res) {
          if (res.confirm) {
            let habits = getApp().data.habits
            habits[hid].deleted = true
            getApp().save()
            wx.navigateBack()
          }
        }
      })
    }
  }
})
