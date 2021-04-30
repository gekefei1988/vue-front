<template>
  <div class="tenant-select">
    <Select v-model="tenantSelected" clearable clearSingleSelect transfer filterable :labelInValue="labelInValue" @on-change="handleChange">
      <Option v-for="item in tenantList" :value="item.id" :key="item.id" :label="item.tenantName"></Option>
    </Select>
  </div>
</template>

<script>
import { getTenants } from '@/api/core/sys/tenant/tenant-api.js'
export default {
  name: 'tenant-select',
  props: {
    tenantValue: {
      type: String,
      default: () => ''
    },
    labelInValue: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tenantList: [],
      tenantSelected: ''
    }
  },
  model: {
    prop: 'tenantValue',
    event: 'returnTenantValue'
  },
  computed: {},
  methods: {
    handleChange (item) {
      if (this.labelInValue && item) {
        this.$emit('returnTenantValue', item[1])
      } else {
        this.$emit('returnTenantValue', item)
      }

      this.$emit('on-change', item)
    }
  },
  mounted () {
    this.tenantSelected = this.tenantValue
    getTenants().then(res => {
      this.tenantList = res.data
    })
  },
  watch: {
    tenantValue (newVal) {
      this.tenantSelected = newVal
    }
  }
}
</script>

<style lang="less" scoped="scoped">
</style>
