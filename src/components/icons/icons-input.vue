<template>
  <div>
    <Input :value="selectedIcon" :maxlength="100" readonly="readonly">
      <Icon :type="selectedIcon" class="icon-prefix" slot="prefix"></Icon>
      <Icon type="md-image" class="icon-suffix" slot="suffix" @click="handleIconSelect"></Icon>
    </Input>
    <IconsModal :modalShow="iconsShow" :selectIcon="selectedIcon" @on-select-change="handleCallbackIconSelect">></IconsModal>
  </div>
</template>

<script>
import IconsModal from '_c/icons/icons-modal'
export default {
  name: 'IconsInput',
  components: {
    IconsModal
  },
  props: {
    icon: {
      type: String,
      default: () => ''
    }
  },
  model: {
    prop: 'icon',
    event: 'returnIcon'
  },
  computed: {
    selectedIcon () {
      console.log(this.icon)
      return this.icon
    }
  },
  data () {
    return {
      iconsShow: false
    }
  },
  methods: {
    handleIconSelect () {
      this.iconsShow = true
    },
    handleCallbackIconSelect (item) {
      this.iconsShow = false
      if (item) {
        this.$emit('returnIcon', item)
      }
    }
  },
  mounted () {
    console.log('icon:' + this.selectedIcon)
  }
}
</script>

<style lang="less" scoped="scoped">
  .icon-prefix {
    cursor: pointer;
    font-size:20px;
  }
  .icon-suffix {
    cursor: pointer;
    font-size:20px;
  }
</style>
