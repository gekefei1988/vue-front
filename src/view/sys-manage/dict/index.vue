<template>
  <div class="dict-table">
    <Row>
      <Col :xxl="8" :xl="10" :lg="12">
        <DictType @on-select="handleSelectType"></DictType>
      </Col>
      <Col :xxl="16" :xl="14" :lg="12" style="padding-left: 10px;">
        <DictData :type="dictType"></DictData>
      </Col>
    </Row>
  </div>
</template>

<script>
import DictType from './type/DictType.vue'
import DictData from './data/DictData.vue'
export default {
  name: 'dict',
  components: {
    DictType,
    DictData
  },
  data () {
    return {
      dictType: null
    }
  },
  methods: {
    handleSelectType (row) {
      if (this.dictType) {
        if (this.dictType.id !== row.id) {
          this.dictType = row
        }
      } else {
        this.dictType = row
      }
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  .dict-table {

  }
</style>
