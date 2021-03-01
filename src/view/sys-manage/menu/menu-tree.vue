<template>
  <div>
    <h4 class="company-tree-title">菜单管理</h4>
    <Tree ref="menuTree" :data="treeData" :render="renderContent" empty-text=""></Tree>
  </div>
</template>

<script>
import { getMenuTrees } from './menu-api'
export default {
  name: 'sys_menu_tree',
  components: {},
  props: {
    menuId: {
      type: String,
      default: () => ''
    },
    isRefresh: {
      type: Boolean,
      default: () => false
    },
    showTreeTag: {
      type: Object,
      default: () => {
        return {
          title: '菜单结构树',
          isShow: true
        }
      }
    }
  },
  model: {
    prop: 'menuId',
    event: 'returnBack'
  },
  data () {
    return {
      treeData: [],
      selectedId: ''
    }
  },
  computed: {},
  methods: {
    // 查询企业树
    searchTreeData () {
      getMenuTrees({ menuType: 'M', selectedId: this.selectedId }).then(res => {
        if (res.data !== null) {
          this.expandTreeData(res.data)
        }
      })
    },
    // 展开树结构
    expandTreeData (data) {
      let datas = []
      // 判断是否显示头
      if (this.showTreeTag.isShow) {
        datas.push({
          nodeId: '',
          nodeType: 'O',
          title: this.showTreeTag.title,
          fullTitle: this.showTreeTag.title,
          children: data,
          expand: true
        })
      } else {
        datas = data
      }
      this.treeData = datas
    },
    // 树结构render
    renderContent (h, { root, node, data }) {
      return h('span', {
        class: {
          'ivu-tree-title': true,
          'ivu-tree-title-selected': data.selected
        },
        on: {
          click: () => {
            if (!data.selected) {
              this.$refs.menuTree.handleSelect(node.nodeKey)
              this.$emit('on-change', data)
              this.selectedId = data.nodeId
            }
          }
        }
      }, [
        h('Icon', {
          props: {
            type: data.icon
          },
          style: {
            marginRight: '4px',
            color: data.disabled ? '#ed4014' : '#2d8cf0'
          }
        }),
        h('span', data.title)
      ])
    }
  },
  mounted () {
    this.searchTreeData()
  },
  watch: {
    isRefresh (newVal, oldVal) {
      this.searchTreeData()
    }
  }
}
</script>

<style lang="less">
.company-tree-title {
  cursor: pointer
}
</style>
