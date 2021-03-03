<template>
  <div v-if="!computedHidden">
    <Col class="search-group-item" :span="span" :style="computedWidth">
      <div :class="computedTitleClass" :style="computedLabel">{{label}}</div>
      <div class="search-group-content" :style="computedContent">
        <slot></slot>
      </div>
    </Col>
  </div>
</template>

<script>
export default {
  name: 'SearchGroupItemCompts',
  components: {},
  props: {
    label: {
      type: String,
      default: () => ''
    },
    span: {
      type: String,
      default: '6'
    },
    labelWidth: {
      type: String,
      default: () => ''
    },
    contentWidth: {
      type: String,
      default: () => ''
    },
    buttonFloat: {
      type: String,
      default: () => 'right'
    },
    hidden: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    // 计算内容宽度
    computedContent () {
      if (this.contentWidth) {
        return 'width: ' + this.contentWidth + (this.contentWidth.indexOf('px') >= 0 ? '' : 'px')
      } else if (this.labelWidth) {
        let widthPx = this.labelWidth + (this.labelWidth.indexOf('px') >= 0 ? '' : 'px')
        return 'width: calc(100% - ' + widthPx + ')'
      }
      return 'width: calc(100% - 70px)'
    },
    // 计算标题宽度
    computedLabel () {
      if (this.labelWidth) {
        return 'width: ' + this.labelWidth + (this.labelWidth.indexOf('px') >= 0 ? '' : 'px')
      }
      return ''
    },
    // 计算title样式
    computedTitleClass () {
      let size = 'default'
      if (this.$parent && this.$parent.$parent) {
        size = this.$parent.$parent.size
      }
      return size === 'small' ? 'search-group-small-title' : 'search-group-title'
    },
    computedHidden () {
      return this.hidden && this.hiddenComp
    },
    computedWidth () {
      if (this.itemWidth) {
        return 'width: ' + this.itemWidth + (this.itemWidth.indexOf('px') >= 0 ? '' : 'px')
      }
      return ''
    }
  },
  data () {
    return {
      hiddenComp: true,
      itemWidth: ''
    }
  },
  mounted () {
    let parent = this.$parent.$parent
    if (parent) {
      this.itemWidth = parent.itemWidth
      parent.handleCallback(this.hidden)
    }
  }
}
</script>
<style lang="less" scoped="scoped">
  .search-group-item {
    float: left;
    padding: 0 10px 5px;
    min-width: 200px;
    .search-group-title {
      width: 70px;
      max-width: 150px;
      padding-left: 5px;
      float: left;
      line-height: 30px;
      text-align: right;
    }
    .search-group-content {
      float: left;
      padding: 0 5px;
    }
    .search-group-small-title {
      width: 70px;
      max-width: 150px;
      padding-left: 5px;
      float: left;
      line-height: 25px;
      text-align: right;
      font-size: 12px;
    }
    .search-group-sep-line {
      float: left;
      line-height: 30px;
      padding: 0 2px;
    }
  }
  .search-group-items-btn {
    .items-btn {
      float: right;
      width: 170px;
      bottom: 0px;
      button {
        margin-right: 3px;
      }
    }
  }
</style>
