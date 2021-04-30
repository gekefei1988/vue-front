<template>
  <div class="eip-tenant-cert-company">
    <VueForm ref="formItem" :model="formItem" :rules="rules" :label-width="140" :label-colon="true">
      <Divider orientation="left" :style="{marginTop: '0px'}">企业信息</Divider>
      <VueFormItem label="企业名称" prop="companyName">
        <Input v-if="isEdit" v-model="formItem.companyName" :maxlength="50" placeholder="请输入企业名称"/>
        <template v-else>{{formItem.companyName}}</template>
      </VueFormItem>
      <VueFormItem label="统一社会信用代码" prop="creditCode">
        <Input v-if="isEdit" v-model="formItem.creditCode" :maxlength="18" placeholder="请输入统一社会信用代码"/>
        <template v-else>{{formItem.creditCode}}</template>
      </VueFormItem>
      <VueFormItem label="行业分类" prop="industry">
        <DictSelect v-show="isEdit" v-model="formItem.industry" :multiple="true" clearable clearSingleSelect type="sys-industry-type"></DictSelect>
        <template v-if="!isEdit">{{formItem.industryDesc}}</template>
      </VueFormItem>
      <VueFormItem label="经营范围" prop="business">
        <DictSelect v-show="isEdit" v-model="formItem.business" :multiple="true" clearable clearSingleSelect type="sys_supplier_busi_scope"></DictSelect>
        <template v-if="!isEdit">{{formItem.businessRemark}}</template>
      </VueFormItem>
      <VueFormItem label="地址" prop="areaCodes">
        <AreaCascade v-if="isEdit" v-model="formItem.areaCodes" areaCode="" filterable></AreaCascade>
        <template v-else>{{formItem.areaNames}}</template>
      </VueFormItem>
      <VueFormItem label="详细地址" span="21">
        <Input v-if="isEdit" v-model="formItem.address" type="textarea" :maxlength="100" :autosize="{minRows: 3, maxRows: 3}" show-word-limit placeholder="请输入详细地址"/>
        <template v-else>{{formItem.address}}</template>
      </VueFormItem>
      <VueFormItem label="营业执照" span="21" prop="businessLicenseFile">
        <UploadImagesModal ref="uploadBusinessImages" v-model="formItem.businessLicenseFile" @on-change="handleChangeLogo">
          <div class="uploadListClass">
            <div class="idcard-content businessLicense-content-b" :style="businessLicenseFile"
              @click="handleIdBusiness()"></div>
          </div>
          <span style="clear: both;"></span>
        </UploadImagesModal>
      </VueFormItem>
      <Divider orientation="left">法人信息</Divider>
      <VueFormItem label="企业法人" prop="name">
        <Input v-if="isEdit" v-model="formItem.name" :maxlength="50" @on-change="handleChangeName" placeholder="请输入企业法人"/>
        <template v-else>{{formItem.name}}</template>
      </VueFormItem>
      <VueFormItem label="身份证号" prop="idCard">
        <Input v-if="isEdit" v-model="formItem.idCard" :maxlength="18" placeholder="请输入身份证号"/>
        <template v-else>{{formItem.idCard}}</template>
      </VueFormItem>
      <VueFormItem label="学历">
        <Input v-if="isEdit" v-model="formItem.education" :maxlength="18" placeholder="请输入学历"/>
        <template v-else>{{formItem.education}}</template>
      </VueFormItem>
      <VueFormItem label="邮箱" prop="email">
        <Input v-if="isEdit" v-model="formItem.email" :maxlength="18" placeholder="请输入邮箱"/>
        <template v-else>{{formItem.email}}</template>
      </VueFormItem>
      <VueFormItem label="邮政编码">
        <Input v-if="isEdit" v-model="formItem.postCode" :maxlength="18" placeholder="请输入邮政编码"/>
        <template v-else>{{formItem.postCode}}</template>
      </VueFormItem>
      <VueFormItem v-if="isEdit && !tenantId" label="联系方式" prop="telephone">
        <Input v-if="isEdit" v-model="formItem.telephone" :maxlength="11" @on-change="handleChangeTelephone" placeholder="联系方式"/>
        <template v-else>{{formItem.telephone}}</template>
      </VueFormItem>
      <VueFormItem label="身份证" prop="idCardFile" span="21">
        <UploadImagesModal ref="uploadImages" v-model="formItem.idCardFile" @on-change="handleChangeIDCard">
          <div class="uploadListClass">
            <div class="idcard-content idcard-content-p" :style="idCardFileP"
              @click="handleIdCard(true)"></div>
            <div class="idcard-content idcard-content-n" :style="idCardFileN"
              @click="handleIdCard(false)"></div>
          </div>
          <span style="clear: both;"></span>
        </UploadImagesModal>
      </VueFormItem>
      <template v-if="isEdit && !tenantId">
        <Divider orientation="left" :style="{marginTop: '0px'}">
          设置-管理员账号
        </Divider>
        <VueFormItem label="" span="21">
          <i-switch v-model="usedTelephone" :disabled="!isEdit">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
          <span class="warning-message"><Icon type="md-alert" color="#ff9900" size="20"/>
            是否使用<span style="font-weight: bold;">[法人代表]</span>联系方式作为管理员登录账号
          </span>
        </VueFormItem>
        <VueFormItem label="登录账号" prop="account">
          <Input v-if="isEdit" v-model="formItem.account" :maxlength="32" :disabled="usedTelephone" placeholder="联系方式可作为登录账号"/>
          <template v-else>{{formItem.account}}</template>
        </VueFormItem>
        <VueFormItem label="登录密码" prop="password">
          <Input v-model="formItem.password" type="password" password :maxlength="32" placeholder="请输入登录密码"/>
        </VueFormItem>
        <VueFormItem label="姓名" prop="fullName">
          <Input v-model="formItem.fullName" :maxlength="50" :disabled="usedTelephone" placeholder="请输入姓名"/>
        </VueFormItem>
      </template>
    </VueForm>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import DictSelect from '_c/sys/dict'
import AreaCascade from '_c/sys/area'
// import UploadImages from '_c/uploads/upload-images.vue'
// import UploadImagesModal from '_c/uploads/upload-images-modal.vue'
import { checkIdCard } from '@/libs/util.js'
import { submitCertCompany, getTenantCert, accountOnlyOne, phoneOnlyOne } from '@/api/core/sys/tenant/tenant-api.js'

export default {
  name: 'EipTenantCertCompany',
  components: {
    DictSelect,
    // UploadImages,
    // UploadImagesModal,
    AreaCascade
  },
  props: {
    title: {
      type: String,
      default: '企业认证'
    },
    tenantId: {
      type: String,
      default: ''
    },
    remark: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    showButton: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    telephone () {
      return this.$store.state.user.telephone
    },
    idCardFileP () {
      if (this.formItem && this.formItem.idCardStaticFileP) {
        return {
          backgroundImage: 'url(' + this.formItem.idCardStaticFileP + ')'
        }
      }
      return ''
    },
    idCardFileN () {
      if (this.formItem && this.formItem.idCardStaticFileN) {
        return {
          backgroundImage: 'url(' + this.formItem.idCardStaticFileN + ')'
        }
      }
      return ''
    },
    businessLicenseFile () {
      if (this.formItem && this.formItem.businessLicenseFileStatic) {
        return {
          backgroundImage: 'url(' + this.formItem.businessLicenseFileStatic + ')'
        }
      }
      return ''
    },
    rules () {
      return {
        industry: { required: true, message: '请选择行业分类', trigger: 'change' },
        business: { required: true, message: '请选择经营范围', trigger: 'change' },
        name: { required: true, message: '请输入企业法人', trigger: 'blur' },
        idCard: { required: true, validator: this.validatorCard, trigger: 'blur' },
        idCardFile: { required: true, validator: this.validatorCardFile, trigger: 'blur' },
        areaCodes: { required: true, message: '请选择地址', trigger: 'change' },
        companyName: { required: true, message: '请输入企业名称', trigger: 'blur' },
        creditCode: { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
        businessLicenseFile: { required: true, message: '请上传营业执照', trigger: 'change' },
        telephone: { required: true, validator: this.validatorTelphone, trigger: 'blur' },
        account: {
          required: true,
          validator: this.validatorAccount,
          trigger: 'blur'
        },
        password: {
          required: true,
          validator: this.validatorPassword,
          trigger: 'blur'
        },
        fullName: { required: true, message: '请输入姓名', trigger: 'blur' },
        email: { validator: this.validatorEmail, trigger: 'blur' }
      }
    }
  },
  data () {
    return {
      // 是否使用联系方式作为登录账号
      usedTelephone: true,
      formItem: {},
      // 注册, 机构表单
      formModel: {
        // 账号信息
        account: '',
        password: '',
        // 机构信息
        industry: '',
        // 经营范围
        business: '',
        // 实名信息
        name: '',
        education: '', // 学历
        email: '', // 邮箱
        postCode: '', // 邮政编码
        telephone: '',
        idCard: '',
        idCardFile: null,
        idCardFileUrl: '',
        idCardFileP: null,
        idCardFileN: null,
        idCardStaticFileP: null,
        idCardStaticFileN: null,
        areaCodes: '',
        address: '',
        mapLng: '',
        mapLat: '',
        // 企业信息
        id: '',
        companyName: '',
        creditCode: '',
        corporate: '',
        validityDate: null,
        setUpDate: null,
        regDept: '',
        regAddress: '',
        businessLicenseFileStatic: null,
        businessLicenseFile: null,
        businessLicenseFileUrl: null,
        certStatus: '3',
        failReason: '',
        deleted: false,
        remark: ''
      },
      spinShow: false,
      idCardFlag: false
    }
  },
  methods: {
    // 验证电话号码
    validatorTelphone (rule, value, callback, source, options) {
      const errors = []
      if (value) {
        if (value.length < 11) {
          errors.push('手机号码必须11位')
        } else {
          let reg = new RegExp(/^([1]{1}[0-9]{10})+$/)
          if (!reg.test(value)) {
            errors.push('请输入正确的手机号码')
          }
        }
      } else {
        errors.push('请输入手机号码')
      }
      if (errors.length > 0) {
        callback(errors)
      }
      phoneOnlyOne({
        telephone: value
      }).then(res => {
        if (!res.data.success) {
          errors.push('该手机号码已注册, 不能重复注册')
        }
        callback(errors)
      })
    },
    // 验证账号
    validatorAccount (rule, value, callback, source, options) {
      let account = this.formItem.account
      const errors = []
      if (!account) {
        errors.push('请输入账号')
      }
      if (errors.length > 0) {
        callback(errors)
      }
      accountOnlyOne({
        account: account
      }).then(res => {
        if (!res.data.success) {
          errors.push('该账号已注册, 不能重复注册')
        }
        callback(errors)
      })
    },
    // 验证密码信息
    validatorPassword (rule, value, callback, source, options) {
      let errors = []
      if (value) {
        if (value.length < 6) {
          errors.push('密码长度必须大于6位')
        } else {
          let reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/)
          if (!reg.test(value)) {
            errors.push('密码必须包含字母和数字')
          }
        }
      } else {
        errors.push('请输入登录密码')
      }
      callback(errors)
    },
    // 验证邮箱信息
    validatorEmail (rule, value, callback, source, options) {
      let errors = []
      if (value) {
        let reg = new RegExp(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/)
        if (!reg.test(value)) {
          errors.push('请输入正确的邮箱')
        }
      }
      callback(errors)
    },
    validatorCard (rule, value, callback, source, options) {
      // checkIdCard
      const errors = []
      if (value) {
        if (!checkIdCard(value)) {
          errors.push('请输入身份证号码不合法')
        }
      } else {
        errors.push('请输入身份证号码')
      }

      callback(errors)
    },
    validatorCardFile (rule, value, callback, source, options) {
      // checkIdCard
      const errors = []
      if (value) {
        if (!this.formItem.idCardFileP) {
          errors.push('请上传身份证正面')
        } else if (!this.formItem.idCardFileN) {
          errors.push('请上传身份证反面')
        }
      } else {
        errors.push('请上传身份证正反面')
      }

      callback(errors)
    },
    handleSubmitCert (callback) {
      this.$refs['formItem'].validate(valid => {
        // 验证通过
        if (valid) {
          this.spinShow = true
          const formItem = Object.assign({}, this.formItem)
          // 赋值
          formItem.id = this.tenantId
          formItem.remark = this.remark
          formItem.idCardFileUrl = formItem.idCardFileP + ',' + formItem.idCardFileN
          formItem.corporate = formItem.name
          formItem.usedTelephone = this.usedTelephone
          if (!formItem.id) {
            formItem.password = this.$md5(formItem.password)
          }
          console.log('formItem:' + JSON.stringify(formItem))
          submitCertCompany(formItem).then(res => {
            if (res.data.success) {
              this.$Message.success('提交审核成功')
              if (callback) {
                callback()
              }
            } else {
              this.$Message.error('提交审核失败')
            }

            this.spinShow = false
          })
        }
      })
    },
    // 手机号码变更
    handleChangeTelephone () {
      if (this.usedTelephone) {
        this.formItem.account = this.formItem.telephone
      }
    },
    // 企业法人名称变更
    handleChangeName () {
      if (this.usedTelephone) {
        this.formItem.fullName = this.formItem.name
      }
    },
    // 清空数据
    handleClear () {
      this.formItem = Object.assign({}, this.formModel)
      this.$refs['formItem'].resetFields()
      this.usedTelephone = true
    },
    // 更改logo
    handleChangeLogo (item) {
      if (item) {
        this.formItem.businessLicenseFileUrl = item.fileUrl
        this.formItem.businessLicenseFileStatic = item.staticFileUrl
      } else {
        this.formItem.businessLicenseFileUrl = ''
        this.formItem.businessLicenseFileStatic = ''
      }
    },
    // 更改身份证
    handleChangeIDCard (item) {
      if (item) {
        // 判断是否正面
        if (this.idCardFlag) {
          this.formItem.idCardFileP = item.fileUrl
          this.formItem.idCardStaticFileP = item.staticFileUrl
        } else {
          this.formItem.idCardFileN = item.fileUrl
          this.formItem.idCardStaticFileN = item.staticFileUrl
        }
      }
    },
    handleIdCard (flag) {
      if (this.isEdit) {
        this.idCardFlag = flag
        this.$refs['uploadImages'].handleClick()
      }
    },
    handleIdBusiness () {
      if (this.isEdit) {
        this.$refs['uploadBusinessImages'].handleClick()
      }
    },
    // 获取机构信息
    loadTenantCompany () {
      // 如果tenantId 是空的, 赋值空值, 否则加载
      if (this.tenantId) {
        this.spinShow = true
        getTenantCert(this.tenantId).then(res => {
          if (res.data.success) {
            this.formItem = res.data.body
            console.log(this.formItem)
            this.formItem.idCardStaticFileP = this.$config.fileServer.fileUrl + this.formItem.idCardFileP
            this.formItem.idCardStaticFileN = this.$config.fileServer.fileUrl + this.formItem.idCardFileN
            this.formItem.businessLicenseFileStatic = this.$config.fileServer.fileUrl + this.formItem.businessLicenseFileUrl
            // 判断是否使用手机账号
            if (this.formItem.account === this.formItem.telephone) {
              this.usedTelephone = true
            } else {
              this.usedTelephone = false
            }
          } else {
            this.$Message.error('数据加载异常')
          }
          this.spinShow = false
        })
      }
    }
  },
  mounted () {
    this.loadTenantCompany()
  },
  watch: {
    tenantId (newVal) {
      // 获取数据
      this.loadTenantCompany()
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  .eip-tenant-cert-company {
    max-height: 550px;
    overflow-y: auto;
    margin: 0 auto;
    padding: 0 10px;
    .footer-buttons {
      margin-top: 10px;
      text-align: center;
    }
    // 警告信息
    .warning-message {
      padding-left: 10px;
      color: #808695;
    }
    .uploadListClass {
      height: 90px;
      .idcard-content {
        float: left;
        margin-right: 10px;
        height: 120px;
        width: 200px;
        border: 1px dashed #dcdee2;
        border-radius: 5px;
        background-repeat: no-repeat;
        background-size: 100%;
        background-position: center;
        cursor: pointer;
      }
      .idcard-content-p {
        background-image: url(/static/images/idcard/id-card-p.png);
      }
      .idcard-content-n {
        background-image: url(/static/images/idcard/id-card-n.png);
      }
      .businessLicense-content-b {
        background-image: url(/static/images/idcard/businessLicense-b.png);
      }
    }
  }
</style>
