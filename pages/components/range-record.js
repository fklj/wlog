const log = require('../../utils/log.js')

Component({
  properties: {
    record: {
      type: Number,
      value: 0,
      observer: 'recordChanged'
    },
    habit: {
      type: Object,
      value: null,
    }
  },
  data: {
    minusStatus: '',
    plusStatus: ''
  },
  methods: {
    plus: function () {
      if (this.data.record < this.data.habit.max) {
        this.triggerEvent('plus')
      }
    },
    minus: function () {
      if (this.data.record > this.data.habit.min) {
        this.triggerEvent('minus')
      }
    },
    recordChanged: function () {
      let plusStatus = this.data.record < this.data.habit.max ? 'active' : 'inactive';
      let minusStatus = this.data.record > this.data.habit.min ? 'active' : 'inactive';
      this.setData({
        plusStatus: plusStatus,
        minusStatus: minusStatus
      })
    }
  },
  ready: function () {
    this.recordChanged()
  }
})