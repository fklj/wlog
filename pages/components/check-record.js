const log = require('../../utils/log.js')

Component({
  properties: {
    records: {
      type: Array,
      value: [],
      observer: "changed"
    },
    habit: {
      type: Object,
      value: null,
    }
  },
  data: {
    checked: false
  },
  methods: {
    toggle: function () {
      this.triggerEvent('toggle')
    },
    changed: function () {
      let checked = this.data.records.length === 0 ? false : this.data.records[0].value
      this.setData({ checked })
    }
  }
})