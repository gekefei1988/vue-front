<template>
  <Select
    ref="select"
    class="tree-select"
    v-bind="$attrs"
    :transfer="true"
    @on-change="handleChange"
  >
    <single-tree-select-tree-item
      :selectedArray="value"
      :data="data"
      @on-clear="handleClear"
      :load-data="loadData"
      @on-check="handleTreeCheck"
    ></single-tree-select-tree-item>
  </Select>
</template>

<script>
import Emitter from 'iview/src/mixins/emitter'
import SingleTreeSelectTreeItem from './single-tree-select-tree.vue'
export default {
  name: 'TreeSelect',
  mixins: [Emitter],
  components: {
    SingleTreeSelectTreeItem
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    loadData: Function
  },
  data () {
    return {
      isChangedByTree: true,
      isInit: true
    }
  },
  provide () {
    return {
      parent: this
    }
  },
  methods: {
    handleChange (selected) {
      this.isChangedByTree = false
    },
    handleTreeCheck (selectedArray) {
      this.isChangedByTree = true
      this.$emit('input', selectedArray.map(item => item.id))
    },
    handleClear () {
      this.$refs.select.reset()
    }
  }
}
</script>

<style lang="less">
.tree-select {
  .ivu-select-dropdown {
    padding: 0 6px;
  }
}
</style>
