<template>
  <div class="dict-type-form">
    <VueForm ref="formItem" :model="formItem" :rules="rules" :label-width="100" label-colon>
      <VueFormItem label="字典名称" prop='dictName'>
        <Input v-model="formItem.dictName" :maxlength="50" placeholder="请输入字典名称"></Input>
      </VueFormItem>
      <VueFormItem label="类型名称" prop='dictType'>
        <Input v-model="formItem.dictType" :maxlength="50" placeholder="请输入类型名称"></Input>
      </VueFormItem>
      <VueFormItem label="状态" prop="status">
        <i-switch v-model="formItem.status" size="large" true-value="0" false-value="1" false-color="#ff4949">
          <span slot="open">启用</span>
          <span slot="close">停用</span>
        </i-switch>
      </VueFormItem>
      <VueFormItem label="备注" prop="remarks" span='21'>
        <Input v-model="formItem.remarks" type="textarea" :autosize="{minRows: 3,maxRows: 5}"
          :maxlength="500" placeholder="备注" show-word-limit></Input>
      </VueFormItem>
    </VueForm>
  </div>
</template>

<script>
import { typeGet, typeSave, typeOnlyOne } from '@/api/core/sys/dict/dict.js'
export default {
  name: 'DictTypeForm',
  computed: {
    rules () {
      return {
        dictName: [
          { required: true, message: '请输入字典名称', trigger: 'blur' },
          { validator: this.validator, trigger: 'blur' }
        ],
        dictType: [
          { required: true, message: '请输入类型名称', trigger: 'blur' },
          { validator: this.validatorEN, trigger: 'blur' },
          { validator: this.validator, trigger: 'blur' }
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
        dictName: '',
        dictType: '',
        status: '0',
        remarks: ''
      }
    }
  },
  methods: {
    // 验证英数字
    validatorEN (rule, value, callback) {
      const errors = []
      if (!/^[a-zA-Z_-\d]+$/.test(value)) {
        errors.push('请输入英文字母、数字、下划线或横线')
      }
      callback(errors)
    },
    // 验证
    validator (rule, value, callback, source, options) {
      const errors = []
      let params = {
        propName: rule.field,
        propValue: value,
        id: this.formItem.id
      }
      typeOnlyOne(params).then(res => {
        if (!res.data.success) {
          errors.push(res.data.msg)
        }
        callback(errors)
      })
    },
    handleLoadTypeForm (id) {
      if (id) {
        typeGet(id).then(res => {
          if (res.data.success) {
            this.formItem = Object.assign({}, res.data.body)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      }
    },
    // 提交
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.$refs.formItem.validate(valid => {
          // 验证通过提交表单
          if (valid) {
            const params = Object.assign({}, this.formItem)
            typeSave(params).then(res => {
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
