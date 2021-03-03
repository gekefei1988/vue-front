<template>
  <div>
    <Col :span="span" :offset="offset">
      <FormItem :label="label" :prop="prop">
        <slot></slot>
      </FormItem>
    </Col>
  </div>
</template>

<script>
export default {
  name: 'vueFormItem',
  components: {},
  props: {
    label: {
      type: String,
      default: () => ''
    },
    prop: {
      type: String,
      default: () => ''
    },
    span: {
      type: String,
      default: () => '10'
    },
    offset: {
      type: String,
      default: () => '1'
    }
  },
  computed: {},
  data () {
    return {}
  },
  mounted () {},
  methods: {}
}
</script>
