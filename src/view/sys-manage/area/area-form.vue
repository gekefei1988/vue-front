<template>
  <div>
    <VueForm ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="120" class="form-default-height">
      <VueFormItem label="区域名称" prop='areaName'>
        <Input v-if="isEdit" v-model="formItem.areaName" :maxlength="32" placeholder="请输入区域名称"></Input>
        <span v-else class="font-weight">{{formItem.areaName}}</span>
      </VueFormItem>
      <VueFormItem label="区域编号" prop='areaCode'>
        <Input v-if="isEdit" v-model="formItem.areaCode" :maxlength="32" placeholder="请输入区域编号"></Input>
        <span v-else class="font-weight">{{formItem.areaCode}}</span>
      </VueFormItem>
      <VueFormItem label="区域类型" prop='areaType'>
        <Select v-if="isEdit" v-model="formItem.areaType">
          <Option value="1">省份直辖市</Option>
          <Option value="2">地市</Option>
          <Option value="3">区县</Option>
          <Option value="4">镇街</Option>
          <Option value="5">村级</Option>
        </Select>
        <div v-else class="font-weight"><Tag>{{formItem.areaTypeDesc}}</Tag></div>
      </VueFormItem>
      <VueFormItem label="状态" prop="status">
        <i-switch v-if="isEdit" v-model="formItem.status"
          size="large" true-value="0" false-value="1" false-color="#ff4949">
          <span slot="open">启用</span>
          <span slot="close">停用</span>
        </i-switch>
        <div v-else>
          <Tag v-if="formItem.status === '0'" color="success">启用</Tag>
          <Tag v-else color="error">停用</Tag>
        </div>
      </VueFormItem>
      <VueFormItem label="显示顺序">
        <Input v-if="isEdit" v-model="formItem.displayOrder" type="number" align="right" :maxlength="32" placeholder="请输入显示顺序"></Input>
        <span v-else class="font-weight">{{formItem.displayOrder}}</span>
      </VueFormItem>
      <VueFormItem label="备注" span="21">
        <Input v-if="isEdit" v-model="formItem.remarks" type="textarea" :autosize="{minRows: 4,maxRows: 8}" :maxlength="200" placeholder="请输入备注"></Input>
        <span v-else class="font-weight">{{formItem.remarks}}</span>
      </VueFormItem>
    </VueForm>
  </div>
</template>

<script>
import { save, validateOnlyOne, get } from '@/api/core/sys/area/area-api'
export default {
  name: 'SysAreaForm',
  computed: {
    ruleValidate () {
      return {
        areaName: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
        ],
        areaCode: [
          { required: true, message: '请输入区域编号', trigger: 'blur' },
          { validator: this.validatorEN, trigger: 'blur' },
          { validator: this.validator, trigger: 'blur' }
        ],
        areaType: [
          { required: true, message: '请选择区域类型', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: () => false
    },
    parentCode: {
      type: String,
      default: () => ''
    },
    formEntity: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      formItem: {},
      formModel: {}
    }
  },
  methods: {
    // 验证英数字
    validatorEN (rule, value, callback) {
      const errors = []
      if (!/^[a-zA-Z\d]+$/.test(value)) {
        errors.push('请输入英文字母或数字')
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
      validateOnlyOne(params).then(res => {
        if (!res.data.success) {
          errors.push(res.data.msg)
        }
        callback(errors)
      })
    },
    handleSave () {
      this.$refs['formItem'].validate((valid) => {
        // 验证通过, 保存
        if (valid) {
          let params = this.formItem
          params.parentCode = this.parentCode

          save(params).then(res => {
            if (res.data.success) {
              this.$Message.success(res.data.msg)
            } else {
              this.$Message.error(res.data.msg)
            }
            this.$emit('on-callback', res.data.success)
          })
        } else {
          this.$emit('on-callback', false)
        }
      })
    }
  },
  mounted () {
    get().then(res => {
      this.formModel = res.data
      this.formItem = Object.assign({}, this.formModel)
    })
  },
  watch: {
    formEntity (newVal) {
      if (newVal.id) {
        this.formItem = newVal
      } else {
        this.formItem = Object.assign({}, this.formModel)
      }
      this.$refs['formItem'].resetFields()
    }
  }
}
</script>

<style>
</style>
