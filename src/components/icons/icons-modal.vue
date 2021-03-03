<template>
  <Modal
    title="图标选择器"
    :value="modalShow"
    width="840"
    @on-cancel="detailsCancel"
    :mask-closable="false">
    <div style="height: 500px; overflow-y: auto;">
      <div v-for="(item, index) in icons" :key="`icons-${index}`" class="div-icons" :class="returnClass(item)" @click="divIconsClick(item)">
        <Icon :type="item" />
        <p>{{item}}</p>
      </div>
    </div>
    <div slot="footer">
      <span v-if="iconsSelectIcon !== ''" class="footer-span">选中图标: <Icon :type="iconsSelectIcon" class="footer-icons"/>
        <span>{{iconsSelectIcon}}</span>
      </span>
      <Button @click="detailsCancel" type="default">取消</Button>
      <Button @click="detailsOk" type="primary">确定</Button>
    </div>
  </Modal>
</template>

<script>
import getIconsData from './data/icons-data.js'
export default {
  name: 'icons_modal_selected',
  props: {
    modalShow: {
      type: Boolean,
      default: () => false
    },
    selectIcon: {
      default: () => ''
    }
  },
  data () {
    return {
      icons: [],
      iconsSelectIcon: this.selectIcon
    }
  },
  methods: {
    divIconsClick (value) {
      if (this.iconsSelectIcon === value) {
        this.iconsSelectIcon = ''
      } else {
        this.iconsSelectIcon = value
      }
    },
    returnClass (val) {
      if (val === this.iconsSelectIcon) {
        return 'div-icons-selected'
      }
      return ''
    },
    detailsOk () {
      this.$emit('on-select-change', this.iconsSelectIcon)
    },
    detailsCancel () {
      this.$emit('on-select-change')
    }
  },
  mounted () {
    this.icons = getIconsData
  },
  watch: {
    selectIcon (newVal, oldVal) {
      this.iconsSelectIcon = newVal
    }
  }
}
</script>

<style lang="less" scoped>
  .div-icons {
    float: left;
    padding: 5px;
    margin: 5px;
    width: 100px;
    height: 100px;
    color: #5c6b77;
    text-align: center;
    transition: all .2s ease;
    position: relative;
    cursor: pointer;
    .ivu-icon {
      margin: 10px;
      font-size: 30px;
      p {
        font-size: 16px;
        text-align: center;
      }
    }
  }
  .div-icons:hover {
    color: #2b85e4;
  }
  .div-icons-selected {
    color: #2b85e4;
    background-color: aliceblue;
  }
  .footer-span {
    float: left;
    color: #2B85E4;
    i {
      font-size: 25px;
      position: relative;
      top: 2px;
      margin-left: 3px;
      margin-right: 3px;
    }
  }
</style>
