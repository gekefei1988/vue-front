<template>
  <span>
    <Select
      ref="selComp"
      v-show="isEdit"
      v-model="myDataKey"
      @on-change="handleChange"
      transfer
      v-bind="$attrs">
      <template v-for="item in dataList" >
        <Option v-if="item.status === '0'" :value="item.value" :key="item.id" :label="item.label"></Option>
      </template>
    </Select>
    <span v-if="!isEdit">{{dataMaps[dataKey]}}</span>
  </span>
</template>

<script>
import { getDictList } from '@/api/open-api/sys/api'
export default {
  name: 'sys_dict_types',
  props: {
    type: {
      type: String,
      default: () => ''
    },
    isEdit: {
      type: Boolean,
      default: () => true
    },
    dataKey: {
      type: String,
      default: () => ''
    },
    displayAll: {
      type: Boolean,
      default: () => false
    },
    value: {
      type: String,
      default: () => null
    },
    level: {
      type: String,
      default: () => ''
    },
    'useDefault': {
      type: Boolean,
      default: () => false
    }
  },
  model: {
    prop: 'dataKey',
    event: 'returnBack'
  },
  data () {
    return {
      myDataKey: '',
      myDataLabel: '',
      dataMaps: {},
      dataList: []
    }
  },
  methods: {
    loadDictDataList () {
      getDictList({ dictType: this.type, value: this.value }).then(res => {
        if (this.displayAll) {
          let list = [
            {
              value: 'all',
              label: '全部'
            }
          ]
          list.push(...res.data)
          this.dataList = list
        } else {
          this.dataList = res.data
        }

        // 转map
        this.dataList.forEach(item => {
          this.dataMaps[item.value] = item.label
        })

        // 加载
        this.initLoadSelectValue()
      })
    },
    handleChange (selected) {
      if (this.$attrs.multiple) {
        this.$emit('returnBack', this.myDataKey.join())
      } else {
        this.$emit('returnBack', this.myDataKey)
      }
      this.$emit('on-change', selected)
    },
    initLoadSelectValue () {
      if (this.useDefault && this.dataList.length > 0 && !this.dataKey) {
        this.dataList.forEach(item => {
          if (item.defaultValue) {
            this.myDataKey = item.value
            this.$emit('returnBack', this.myDataKey)
          }
        })
      }
    }
  },
  mounted () {
    this.myDataKey = this.dataKey
    this.loadDictDataList()
  },
  watch: {
    dataKey (newVal, oldVal) {
      if (this.$attrs.multiple) {
        if (newVal) {
          this.myDataKey = newVal.split(',')
        } else {
          this.myDataKey = []
        }
      } else {
        this.myDataKey = newVal
      }
      this.initLoadSelectValue()
    }
  }
}
</script>

<style lang="less" scoped>
.details-btn{
  margin-right: 10px;
  float: right;
}
.form-ele {
  width: 360px;
}
</style>
