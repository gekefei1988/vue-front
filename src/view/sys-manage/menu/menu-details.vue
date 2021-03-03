<template>
  <div>
     <Modal :title="title" :value="modalShow" width="950" @on-cancel="detailsCancel" :mask-closable="false">
      <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="120" class="form-max">
        <Row>
          <VueFormItem label="上级菜单">
            <MenuSelect ref="menuSelect" :isEdit="isEdit" v-model="formItem.parentId"></MenuSelect>
          </VueFormItem>
          <VueFormItem label="菜单类型" prop="menuType">
            <RadioGroup v-if="isEdit" v-model="formItem.menuType">
              <Radio label="M">菜单</Radio>
              <Radio label="P">权限</Radio>
            </RadioGroup>
            <span v-else class="font-weight">{{formItem.menuTypeDesc}}</span>
          </VueFormItem>
          <VueFormItem label="菜单名称" prop='menuName'>
            <Input v-if="isEdit" v-model="formItem.menuName" :maxlength="64" placeholder="请输入菜单名称"></Input>
            <span v-else class="font-weight">{{formItem.menuName}}</span>
          </VueFormItem>
          <VueFormItem label="菜单内部名" prop='menuCode'>
            <Input v-if="isEdit" v-model="formItem.menuCode" :maxlength="64" placeholder="请输入菜单内部名"></Input>
            <span v-else class="font-weight">{{formItem.menuCode}}</span>
          </VueFormItem>
          <VueFormItem label="状态" prop="status">
            <i-switch v-if="isEdit" v-model="formItem.status" size="large" true-value="0" false-value="1">
              <span slot="open">启用</span>
              <span slot="close">停用</span>
            </i-switch>
            <div v-else class="font-weight">
              <Tag v-if="formItem.status === '0'" color="success">启用</Tag>
              <Tag v-else color="error">停用</Tag>
            </div>
          </VueFormItem>
          <VueFormItem label="权限标识" prop="perms">
            <Input v-if="isEdit" v-model="formItem.perms" :maxlength="100" placeholder="请输入权限标识"></Input>
            <span v-else class="font-weight">{{formItem.perms}}</span>
          </VueFormItem>
          <VueFormItem label="菜单显示图标">
            <Input v-if="isEdit" v-model="formItem.icon" :maxlength="100" readonly="readonly">
            <Icon :type="formItem.icon" style="cursor: pointer; font-size:20px;" slot="prefix"></Icon>
            <Icon type="md-image" style="cursor: pointer; font-size:20px;" slot="suffix" @click="iconsClick"></Icon>
            </Input>
            <span v-if="!isEdit">
              <Icon :type="formItem.icon" style="font-size:20px;"></Icon>
            </span>
          </VueFormItem>
          <VueFormItem label="菜单地址">
           <Input v-if="isEdit" v-model="formItem.url" :maxlength="200" placeholder="请输入菜单地址"></Input>
           <span v-else class="font-weight">{{formItem.url}}</span>
          </VueFormItem>
          <VueFormItem label="是否显示菜单">
            <i-switch v-if="isEdit" v-model="formItem.visible" true-value="T" false-value="F">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
            <div v-else class="font-weight">
              <Tag v-if="formItem.visible === 'T'" color="success">是</Tag>
              <Tag v-else>否</Tag>
            </div>
          </VueFormItem>
          <VueFormItem label="显示顺序">
            <Input v-if="isEdit" v-model="formItem.displayOrder" :maxlength="10" placeholder="请输入显示顺序"></Input>
            <span v-else class="font-weight">{{formItem.displayOrder}}</span>
          </VueFormItem>

          <VueFormItem label="备注" span="21">
            <Input v-if="isEdit" v-model="formItem.remarks" type="textarea" :autosize="{minRows: 3,maxRows: 6}"
             :maxlength="200" placeholder="请输入备注" :readonly="!isEdit"></Input>
            <span v-else class="font-weight">{{formItem.remarks}}</span>
          </VueFormItem>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="detailsCancel" type="default">取消</Button>
        <Button @click="detailsOk" :loading="buttonLoading" v-if="isEdit" type="primary">确定</Button>
      </div>
    </Modal>
    <IconsModal :modalShow="iconsShow" :selectIcon="selectIcon" @on-select-change="iconsSelected">></IconsModal>
  </div>
</template>

<script>
import MenuSelect from '_c/sys/menu/menu-select'
import IconsModal from '_c/icons/icons-modal'
import { validateOnlyOne, save } from './menu-api'
export default {
  name: 'sys_menu_index',
  components: {
    MenuSelect,
    IconsModal
  },
  props: {
    modalShow: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => '菜单信息'
    },
    isEdit: {
      type: Boolean,
      default: () => false
    },
    entity: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      // 菜单树
      treeData: [],
      buttonLoading: false,
      collPanel: '1',
      formItem: {},
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
    // 图标选择事件
    iconsClick () {
      this.selectIcon = this.formItem.icon
      this.iconsShow = true
    },
    // 图标回调事件
    iconsSelected (icon) {
      if (icon) {
        this.formItem.icon = icon
      }
      if (this.formItem.icon === '') {
        this.formItem.icon = 'md-square'
      }
      this.iconsShow = false
      this.selectIcon = ''
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
              setTimeout(() => {
                this.$refs.menuSelect.searchTrees()
              }, 200)
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
    }
  },
  mounted () {
    debugger
    this.formItem = this.entity
  },
  watch: {
    entity (newVal, oldVal) {
      debugger
      this.formItem = newVal
      this.collPanel = '1'
      this.$refs['formItem'].resetFields()
    }
  }
}
</script>

<style lang="less">
.form-ele {
  width: 100%
}
</style>
