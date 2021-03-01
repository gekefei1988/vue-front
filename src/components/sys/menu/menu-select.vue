<template>
  <single-tree-select
    v-model="values"
    :disabled="!isEdit"
    check-strictly
    :expand-all="true"
    @on-select-change="handleTreeSelectClick"
    :data="treeDatas"></single-tree-select>
</template>

<script>
import SingleTreeSelect from '_c/single-tree-select'
import { getMenuTrees } from '@/api/core/sys/menu/menu-api'
export default {
  name: 'sys_menu_select',
  components: {
    SingleTreeSelect
  },
  props: {
    isEdit: {
      type: Boolean,
      default: () => false
    },
    selectedValues: {
      default: () => ''
    }
  },
  model: {
    prop: 'selectedValues',
    event: 'returnBack'
  },
  data () {
    return {
      values: [],
      treeDatas: []
    }
  },
  methods: {
    searchTrees () {
      let datas = []
      getMenuTrees({ menuType: 'M' }).then(res => {
        if (res.data !== null) {
          // 判断是否显示头
          datas.push({
            nodeId: '0',
            id: '0',
            nodeType: 'O',
            title: '菜单结构树',
            fullTitle: '菜单结构树',
            children: res.data,
            expand: true
          })
        }

        this.treeDatas = datas
      })
    },
    handleTreeSelectClick (item) {
      let selected = {
        nodeId: '0'
      }
      if (item && item.length > 0) {
        selected.nodeId = item[0].nodeId
      }
      this.$emit('returnBack', selected.nodeId)
      this.$emit('on-change', selected)
    }
  },
  mounted () {
    this.searchTrees()
  },
  watch: {
    selectedValues (newVal, oldVal) {
      if (newVal) {
        this.values = [newVal]
      } else {
        this.values = []
      }
    }
  }
}
</script>

<style>
</style>
