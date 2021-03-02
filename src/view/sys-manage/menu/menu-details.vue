<template>
  <div>
    <Modal
      :title="details.title"
      :value="modalShow"
      width="900"
      @on-cancel="detailsCancel"
      :mask-closable="false">
      <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="120" class="form-max">
        <Row>
          <Col span="11">
            <FormItem label="上级菜单">
              <MenuSelect
                :isEdit="isEdit"
                v-model="formItem.parentId"></MenuSelect>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="菜单类型" prop="menuType">
              <RadioGroup v-model="formItem.menuType">
                <Radio label="M" :disabled="!isEdit">菜单</Radio>
                <Radio label="P" :disabled="!isEdit">权限</Radio>
                <Radio label="B" :disabled="!isEdit">按钮或链接</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="菜单名称" prop='menuName'>
              <Input v-model="formItem.menuName" class="form-ele" :maxlength="64" placeholder="请输入菜单名称..." :readonly="!isEdit"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="菜单内部名" prop='menuCode'>
              <Input v-model="formItem.menuCode" class="form-ele" :maxlength="64" placeholder="请输入菜单内部名..." :readonly="!isEdit"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="状态">
              <RadioGroup v-model="formItem.status">
                <Radio label="0" :disabled="!isEdit">启用</Radio>
                <Radio label="2" :disabled="!isEdit">停用</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="权限标识" prop="perms">
              <Input v-model="formItem.perms" class="form-ele" :maxlength="100" placeholder="请输入权限标识..." :readonly="!isEdit"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="菜单地址">
              <Input v-model="formItem.url" class="form-ele" :maxlength="200" placeholder="请输入菜单地址..." :readonly="!isEdit"></Input>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="是否显示菜单">
              <RadioGroup v-model="formItem.visible">
                <Radio label="T" :disabled="!isEdit">是</Radio>
                <Radio label="F" :disabled="!isEdit">否</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="11">
            <FormItem label="显示顺序">
              <Input v-model="formItem.displayOrder" class="form-ele" :maxlength="10" placeholder="请输入显示顺序..." :readonly="!isEdit"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="备注">
              <Input v-model="formItem.remarks" type="textarea" class="form-ele" :autosize="{minRows: 4,maxRows: 8}" :maxlength="200" placeholder="请输入备注..." :readonly="!isEdit" ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="detailsCancel" type="default">取消</Button>
        <Button @click="detailsOk" :loading="buttonLoading" v-if="isEdit" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import MenuSelect from '_c/sys/menu/menu-select'
import { validateOnlyOne, save, get } from './menu-api'
export default {
  name: 'sys_menu_index',
  components: {
    MenuSelect
  },
  props: {
    modalShow: {
      type: Boolean,
      default: () => false
    },
    isEdit: {
      type: Boolean,
      default: () => false
    },
    objectId: {
      default: () => ''
    },
    parentId: {
      default: () => ''
    }
  },
  data () {
    return {
      // 菜单树
      treeData: [],
      buttonLoading: false,
      details: {
        title: '菜单信息维护',
        collPanel: '1'
      },
      // 表单信息
      formItem: this.getDefaultObject(),
      ruleValidate: {
        menuName: [
          { required: true, message: '请输入菜单名称...', trigger: 'blur' }
        ],
        menuCode: [
          { required: true, message: '请输入菜单编号...', trigger: 'blur' },
          { validator: this.validatorEN, trigger: 'blur' }
          // { validator: this.validator, trigger: 'blur' }
        ],
        menuType: [
          { required: true, message: '请选择菜单类型...', trigger: 'blur' }
        ],
        perms: [
          { validator: this.validatorPerms, trigger: 'blur' }
        ]
      },
      // 字典标题数据
      iconsShow: false,
      selectIcon: ''
    }
  },
  computed: {
    bodyHiehgt () {
      return 'height:' + (window.innerHeight - 140) + 'px'
    }
  },
  methods: {
    // 验证英数字
    validatorEN (rule, value, callback) {
      const errors = []
      if (value && !/^[a-zA-Z_-\d]+$/.test(value)) {
        errors.push('请输入英文字母、数字、横线或下划线...')
      }
      callback(errors)
    },
    // 验证权限
    validatorPerms (rule, value, callback) {
      const errors = []
      if (value && !/^[a-zA-Z/:\d]+$/.test(value)) {
        errors.push('请输入英文字母、数字或冒号...')
      }
      callback(errors)
    },
    // 验证
    validator (rule, value, callback, source, options) {
      const errors = []
      let params = {
        propName: rule.field,
        propValue: value,
        menuId: this.formItem.menuId
      }
      validateOnlyOne(params).then(res => {
        if (!res.data.success) {
          errors.push(res.data.msg)
        }
        callback(errors)
      })
    },
    // 编辑表格相关操作
    getDefaultObject () {
      let obj = {
        id: '',
        menuCode: '',
        menuName: '',
        menuType: 'M',
        parentId: '0',
        visible: 'T',
        url: '',
        perms: '',
        displayOrder: '0',
        status: '0',
        remarks: ''
      }

      obj.parentId = this.parentId
      return obj
    },
    detailsOk () {
      this.$refs['formItem'].validate((valid) => {
        // 验证通过, 保存
        if (valid) {
          this.tableLoading = true
          let params = this.formItem
          save(params).then(res => {
            if (res.data.success) {
              this.$Message.success(res.data.msg)
              // 关闭模态框
              this.$emit('on-callback', 'ok')
              this.closeModal()
            } else {
              this.$Message.error(res.data.msg)
            }

            this.tableLoading = false
          })
        }
      })
    },
    detailsCancel () {
      this.$emit('on-callback')
      this.closeModal()
    },
    closeModal () {
      setTimeout(() => {
        this.details.collPanel = '1'
        this.$refs['formItem'].resetFields()
        this.formItem = this.getDefaultObject()
      }, 200)
    },
    // 查询对象
    getObject () {
      if (this.objectId && this.objectId.length > 0) {
        get({ menuId: this.objectId }).then(res => {
          if (res.data) {
            let object = this.getDefaultObject()
            for (var key in object) {
              object[key] = res.data[key]
            }
            this.formItem = object
          }
        })
      } else {
        this.formItem = this.getDefaultObject()
      }
    }
  },
  mounted () {},
  watch: {
    modalShow (newVal, oldVal) {
      if (newVal) {
        this.getObject()
      }
    }
  }
}
</script>

<style lang="less">
.form-ele {
  width: 100%
}
</style>
