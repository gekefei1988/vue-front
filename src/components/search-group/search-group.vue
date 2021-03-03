<template>
  <Row class="search-group">
    <slot></slot>
    <Col v-if="showButton" :style="returnStyle" class="search-group-opers">
      <Button @click="handleSearch" :size="size" type="primary">查询</Button>
      <Button @click="handleClear" :size="size" type="default">重置</Button>
      <a @click="handleToggle" v-if="showHidBtn">
        <template v-if="!hidden">
          更多<Icon type="md-arrow-dropdown"/>
        </template>
        <template v-else>
          收起<Icon type="md-arrow-up"/>
        </template>
      </a>
    </Col>
  </Row>
</template>

<script>
import SearchGroupItem from './search-group-item.vue'
export default {
  name: 'SearchGroupCompts',
  components: {
    SearchGroupItem
  },
  props: {
    size: {
      type: String,
      default: () => 'default'
    },
    showButton: {
      type: Boolean,
      default: () => true
    },
    buttonFloat: {
      type: String,
      default: () => 'right'
    },
    itemWidth: {
      type: String,
      default: ''
    }
  },
  computed: {
    returnStyle () {
      if (this.size === 'small') {
        return 'font-size: 12px'
      }
      return ''
    }
  },
  data () {
    return {
      hidden: false,
      showHidBtn: false
    }
  },
  methods: {
    handleSearch () {
      this.$emit('search', null, true)
    },
    handleClear () {
      this.$emit('clear')
    },
    // 当前按钮是否展开
    handleToggle () {
      // 隐藏内容赋值
      this.hidden = !this.hidden
      if (this.$children[0] && this.$children[0].$children) {
        this.$children[0].$children.forEach(item => {
          // 如果控件存在, 则进行赋值
          if (item.hiddenComp !== undefined) {
            // 反向赋值
            item.hiddenComp = !this.hidden
          }
        })
      }
    },
    handleCallback (existHidden) {
      if (existHidden && !this.showHidBtn) {
        this.showHidBtn = true
      }
    }
  },
  mounted () {}
}
</script>
<style lang="less" scoped="scoped">
  .search-group {
    padding: 10px 0;
    clear: both;
    .search-group-opers {
      float: right;
      button {
        margin-right: 3px;
      }
      a {
        margin-right: 5px;
      }
    }
  }
</style>
