<template>
  <div class="dict-title">
    <template v-for="(item, index) in titleList">
      <span :key="`title-${item.id}`">
        <a @click="selectFun(index)">
          <template v-if="item.icon">
            <icon class="title-cube" :type="item.icon" />
          </template>
          <template v-if="!item.icon">
            <icon v-if="index === 0" class="title-cube" type="md-home" />
            <icon v-if="index > 0" class="title-cube" type="md-cube" />
          </template>
          {{item.title}}
        </a>
        <span class="title-margin" v-if="(index + 1) < titleList.length">/</span>
      </span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'DictTitle',
  props: {
    titleList: {
      type: Array,
      default () {
        return []
      }
    },
    selectFun: {
      type: Function
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="less">
.dict-title {
  padding: 10px 5px;
  .title-cube {
    margin-right: 5px;
  }
  .title-text {
    margin-right: 5px;
    color: #999;
  }
  .title-item {
    margin-left: 10px;
  }
  .title-margin {
    margin-left: 10px;
    margin-right: 10px;
  }
  a {
    color: #515a6e;
  }
  a:hover {
    color: #57a3f3
  }
}
</style>
