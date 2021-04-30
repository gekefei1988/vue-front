<template>
  <div>
    <Modal :title="title" :value="modalShow" width="1100" @on-cancel="handleCancel" :mask-closable="false">
      <div class="eip-tenant-reg-form">
        <CompanyCert ref="compnayCert" :tenantId="tenantId" :remark="remark" :isEdit="isEdit"></CompanyCert>
      </div>
      <div slot="footer">
        <Button @click="handleCancel" type="default">取消</Button>
        <Button @click="handleSubmit" v-if="isEdit" :loading="buttonLoading" type="primary">提交认证</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import CompanyCert from '@/view/sys-manage/tenant/components/cerb/company.vue'
export default {
  name: 'EipTenantRegForm',
  components: {
    CompanyCert
  },
  props: {
    title: {
      type: String,
      default: '机构注册明细'
    },
    tenantId: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    modalShow: {
      type: Boolean,
      default: false
    },
    remark: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'modalShow',
    event: 'returnShow'
  },
  data () {
    return {
      buttonLoading: false
    }
  },
  methods: {
    // 关闭模弹
    closeModal (isSearch) {
      this.$emit('returnShow', false)
      // 返回值是否查询
      this.$emit('callback', isSearch)
      // 重新赋值
      window.setTimeout(() => {
        this.$refs['compnayCert'].handleClear()
      }, 200)
    },
    // 关闭
    handleCancel () {
      this.closeModal(false)
    },
    // 提交
    handleSubmit () {
      this.$refs['compnayCert'].handleSubmitCert(() => {
        this.closeModal(true)
      })
    }
  },
  mounted () {}
}
</script>

<style lang="less" scoped="scoped">
</style>
