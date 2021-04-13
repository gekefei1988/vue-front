<template>
  <div class="dict-data-form">
    <VueForm ref="formItem" :model="formItem" :rules="rules" :label-width="120">
      <VueFormItem label="字典键名" prop='dictLabel'>
        <Input v-model="formItem.dictLabel" :maxlength="50" placeholder="请输入字典键名"></Input>
      </VueFormItem>
      <VueFormItem label="字典键值" prop='dictValue'>
        <Input v-model="formItem.dictValue" :maxlength="50" placeholder="请输入字典键值"></Input>
      </VueFormItem>
      <VueFormItem label="状态" prop="status">
        <i-switch v-model="formItem.status"
          size="large" true-value="0" false-value="1" false-color="#ff4949">
          <span slot="open">启用</span>
          <span slot="close">停用</span>
        </i-switch>
      </VueFormItem>
      <VueFormItem label="是否默认值">
        <i-switch v-model="formItem.defaultValue" false-color="#f90">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </VueFormItem>
      <VueFormItem label="显示顺序">
        <Input v-model="formItem.displayOrder" type="number" :maxlength="32" placeholder="请输入显示顺序"></Input>
      </VueFormItem>
    </VueForm>
  </div>
</template>

<script>
import { dataGet, dataSave } from '@/api/core/sys/dict/dict.js'
export default {
  name: 'DictDataForm',
  computed: {
    rules () {
      return {
        dictLabel: [
          { required: true, message: '请输入字典键名', trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: '请输入字典键值', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      formItem: {},
      formModel: {
        id: '',
        dictType: '',
        dictLabel: '',
        dictValue: '',
        cssClass: '',
        displayOrder: 0,
        status: '0',
        parentId: '',
        defaultValue: false,
        ext1: '',
        ext2: '',
        ext3: '',
        ext4: '',
        ext5: '',
        ext6: ''
      }
    }
  },
  methods: {
    // 加载数据
    handleLoadDataForm (id) {
      if (id) {
        dataGet(id).then(res => {
          if (res.data.success) {
            this.formItem = Object.assign({}, res.data.body)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      }
    },
    handleSetParent (parentId, dictType) {
      this.formItem.parentId = parentId
      this.formItem.dictType = dictType
    },
    // 提交
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.$refs.formItem.validate(valid => {
          // 验证通过提交表单
          if (valid) {
            const params = Object.assign({}, this.formItem)
            dataSave(params).then(res => {
              resolve(res)
            })
          } else {
            resolve()
          }
        })
      })
    },
    // 取消
    handleCancel () {
      setTimeout(() => {
        this.formItem = Object.assign({}, this.formModel)
        this.$refs.formItem.resetFields()
      }, 200)
    }
  },
  mounted () {
    this.formItem = Object.assign({}, this.formModel)
  }
}
</script>

<style>
</style>
