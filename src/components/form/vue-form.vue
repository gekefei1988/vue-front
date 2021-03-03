<template>
  <Form ref="vueFormFields" v-bind="$attrs" class="form-default" :style="computedStyle">
    <Row><slot></slot></Row>
  </Form>
</template>

<script>
export default {
  name: 'vueForm',
  props: {
    height: {
      type: String
    }
  },
  computed: {
    computedStyle () {
      let style = {
        overflowY: 'auto'
      }
      // 是否存在高度
      if (this.height) {
        style.height = this.height.indexOf('px') < 0 ? (this.height + 'px') : this.height
      } else {
        style.height = 'auto'
      }
      return style
    }
  },
  methods: {
    resetFields () {
      this.$refs['vueFormFields'].resetFields()
    },
    validate (callback) {
      return this.$refs['vueFormFields'].validate(callback)
    }
  }
}
</script>
