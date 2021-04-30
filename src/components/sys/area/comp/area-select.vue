<template>
  <div>
    <Cascader
      v-if="isEdit"
      ref="cascader"
      v-model="myAreas"
      :data="areaDatas"
      @on-change="handleChange"
      trigger="click"
      transfer
      v-bind="$attrs"></Cascader>
      <span v-else class="font-weight">{{areaNames}}</span>
  </div>
</template>

<script>
import { getAreaCascader } from '@/api/open-api/sys/api'
export default {
  name: 'sys-area-select',
  props: {
    areas: {
      type: String,
      default: () => ''
    },
    areaNames: {
      type: String,
      default: () => ''
    },
    areaCode: {
      type: String,
      default: () => ''
    },
    isEdit: {
      type: Boolean,
      default: () => true
    }
  },
  model: {
    prop: 'areas',
    event: 'returnBack'
  },
  data () {
    return {
      myAreas: [],
      areaDatas: []
    }
  },
  computed: {},
  methods: {
    handleChange (items) {
      this.$emit('returnBack', items.toString())
      this.$emit('on-change', items.toString())
    },
    getAreaName (areaCode, datas) {

    }
  },
  mounted () {
    getAreaCascader({ areaCode: this.areaCode }).then(res => {
      this.areaDatas = res.data
    })
  },
  watch: {
    areas (newVal, oldVal) {
      if (newVal) {
        let areasSplit = newVal.split(',')
        this.myAreas = areasSplit
      } else {
        this.myAreas = []
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
