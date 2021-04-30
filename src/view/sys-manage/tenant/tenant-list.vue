<template>
  <div>
    <Card>
      <SearchGroup @search="handleSearch" @clear="handleClear">
        <SearchGroupItem label="关键字">
          <Input @on-keydown="handleKeyDown" :maxlength="64" placeholder="机构名称或英文名" v-model="searchParams.tenantName"/>
        </SearchGroupItem>
        <SearchGroupItem label="行业分类">
          <DictSelect v-model="searchParams.industry" clearable clearSingleSelect type="sys-industry-type"></DictSelect>
        </SearchGroupItem>
        <SearchGroupItem label="状态">
          <Select v-model="searchParams.tenantStatus" clearable clearSingleSelect>
            <Option value="0">已启动</Option>
            <Option value="1">已冻结</Option>
          </Select>
        </SearchGroupItem>
      </SearchGroup>
    </Card>
    <VTablePage :loading="tableLoading" :columns="columns"
      :pageContent="pageContent" :usedOpers="true" style="margin-top: 5px;" @on-search="handleSearch">
      <Button @click="regForm.handleCreateTenant()" class="add-btn" type="primary">注册机构</Button>
    </VTablePage>
    <!--注册机构-->
    <TenantRegForm v-model="regForm.show" :isEdit="regForm.isEdit" :tenantId="regForm.tenantId" @callback="regForm.handleCallback"></TenantRegForm>
  </div>
</template>
<script>
import TenantRegForm from './components/tenant/tenant-reg-form.vue'
import { DictSelect } from '_c/sys/dict'
import { getTenantList, modifyTenantStauts } from '@/api/core/sys/tenant/tenant-api.js'
export default {
  name: 'sys-tenant',
  components: {
    DictSelect,
    TenantRegForm
  },
  data () {
    return {
      // 权控
      buttonAccess: {
        'sys:tenant:save': false,
        'sys:tenant:delete': false
      },
      columns: [
        {
          title: '机构名称',
          key: 'tenantName',
          sortable: 'custom',
          width: 300,
          tooltip: true
        },
        {
          title: '行业分类',
          key: 'industryDesc',
          width: 200,
          align: 'left',
          tooltip: true
        }, {
          title: '经营范围',
          key: 'businessRemark',
          width: 200,
          align: 'left',
          tooltip: true
        },
        {
          title: '机构状态',
          key: 'tenantStatus',
          sortable: 'custom',
          width: 120,
          align: 'center',
          render: (h, params) => {
            let buttons = []
            // 编辑
            buttons.push(
              h('Button', {
                props: {
                  type: params.row.tenantStatusColor,
                  size: 'small'
                },
                style: 'margin-left:5px',
                on: {
                  click: () => {
                    this.handleModifyStatus(params.row)
                  }
                }
              }, params.row.tenantStatusDesc)
            )
            return h('div', buttons)
          }
        },
        {
          title: '认证类型',
          key: 'certType',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('Tag', {
              props: {
                color: 'default'
              }
            }, params.row.certTypeDesc)
          }
        },
        {
          title: '实名认证',
          key: 'certStatus',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('Tag', {
              props: {
                color: params.row.certStatusColor
              }
            }, params.row.certStatusDesc)
          }
        },
        {
          title: '操作',
          key: 'id',
          minWidth: 280,
          active: false,
          render: (h, params) => {
            let buttons = []
            buttons.push(
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: 'margin-left:5px',
                on: {
                  click: () => {
                    this.regForm.handleCreateTenant(params.row.id)
                  }
                }
              }, '编辑')
            )
            buttons.push(
              h('Button', {
                props: {
                  type: 'default',
                  size: 'small'
                },
                style: 'margin-left:5px',
                on: {
                  click: () => {
                    this.regForm.handleViewTenant(params.row.id)
                  }
                }
              }, '查看')
            )
            return h('div', buttons)
          }
        }
      ],
      // table 加载蒙版
      tableLoading: false,
      pageContent: {
        total: 0,
        pageNumber: 1,
        pageSize: 10,
        sortKey: '',
        sortOrder: '',
        defaultSortKey: '',
        defaultSortOrder: ''
      },
      // 查询条件
      searchParams: {
        tenantName: '',
        tenantStatus: '',
        industry: ''
      },
      // 注册表单
      regForm: {
        show: false,
        tenantId: '',
        isEdit: false,
        // 新建
        handleCreateTenant: (tenantId) => {
          this.regForm.tenantId = tenantId || ''
          this.regForm.isEdit = true
          this.regForm.show = true
        },
        handleViewTenant: (tenantId) => {
          if (tenantId) {
            this.regForm.tenantId = tenantId
            this.regForm.isEdit = false
            this.regForm.show = true
          }
        },
        handleCallback: (isSearch) => {
          if (isSearch) {
            this.handleSearch(null, true)
          }
          this.regForm.tenantId = ''
        }
      },
      // 企业认证
      certReview: {
        show: false,
        tenantId: '',
        width: '700',
        handleReview: (row) => {
          this.certReview.tenantId = row.id
          if (row.companyCert !== '3') {
            this.certReview.width = '1000'
          } else {
            this.certReview.width = '700'
          }
          this.certReview.show = true
        },
        handleCallback: (isSearch) => {
          setTimeout(() => {
            this.certReview.tenantId = ''
          }, 200)
          if (isSearch) {
            this.handleSearch(null, true)
          }
        }
      }
    }
  },
  methods: {
    // 重置按钮
    handleClear () {
      this.searchParams.tenantName = ''
      this.searchParams.tenantStatus = ''
      this.searchParams.industry = ''
      this.handleSearch(null, false)
    },
    // 查询方法, 不重置页数
    handleSearch (pageContent, resetPage) {
      // 分页信息
      let vPageContent = null
      if (pageContent) {
        vPageContent = pageContent
      } else {
        vPageContent = this.pageContent
      }
      // 是否显示第一页
      if (resetPage) {
        vPageContent.pageNumber = 1
      }
      this.tableLoading = true
      getTenantList({
        searchParams: this.searchParams,
        pageContent: vPageContent
      }).then(res => {
        this.pageContent = res.data
        this.tableLoading = false
      })
    },
    handleKeyDown (event) {
      if (event.keyCode === 13) {
        this.handleSearch(null, false)
      }
    },
    // 修改状态
    handleModifyStatus (row) {
      this.$Modal.confirm({
        title: '机构状态修改',
        content: '<p>您确定要变更机构状态吗?</p>',
        onOk: () => {
          let tenantStatus = row.tenantStatus === '0' ? '1' : '0'
          modifyTenantStauts(row.id, tenantStatus).then(res => {
            if (res.data.success) {
              this.$Message.success('变更成功')
              this.handleSearch(null, false)
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    }
  },
  mounted () {
    // 初始查询
    this.handleSearch(null, false)
  }
}
</script>
