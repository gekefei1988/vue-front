<template>
  <div>
    <Row :style="bodyHiehgt">
      <Col span="6" style="width:280px;">
        <Card :style="bodyHiehgt" shadow>
          <MenuTree
            :isRefresh="details.isRefresh"
            @on-change="menuChange"
          ></MenuTree>
        </Card>
      </Col>
      <Col span="18" style="width:calc(100% - 285px); margin-left: 5px;">
        <Card :style="bodyHiehgt">
          <SearchGroup @search="handleSearch" @clear="handleClear">
            <SearchGroupItem label="关键字">
              <Input @on-keydown="handleKeyDown" :maxlength="100" placeholder="菜单名称或编号" v-model="searchParams.menuName"/>
            </SearchGroupItem>
            <SearchGroupItem label="菜单类型">
              <Select v-model="searchParams.menuType" clearable clearSingleSelect>
                <Option value="M">菜单</Option>
                <Option value="P">权限</Option>
              </Select>
            </SearchGroupItem>
            <SearchGroupItem label="状态" labelWidth="50">
              <Select v-model="searchParams.status" clearable clearSingleSelect>
                <Option value="0">启用</Option>
                <Option value="1">停用</Option>
              </Select>
            </SearchGroupItem>
          </SearchGroup>
          <Row class="buttons-group">
            <Col class="right-btns">
              <Button @click="editObject('new')" class="add-btn" style="margin-bottom: 5px;" type="primary">新增</Button>
            </Col>
          </Row>
          <Table border highlight-row stripe :loading="tableLoading" :columns="columns" :max-height="tableHeight" :data="pageContent.content" @on-sort-change="sortChange"></Table>
        </Card>
      </Col>
    </Row>
    <!--新增 修改 查看 ========start==========-->
    <MenuDetails
      :modalShow="details.modalShow"
      :isEdit="details.isEdit"
      :entity="details.entity"
      @on-callback="callback"></MenuDetails>
    <!--新增 修改 查看 ========end==========-->
  </div>
</template>
<script>
import MenuTree from './menu-tree'
import MenuDetails from './menu-details'
import { list as getList, del, get } from './menu-api'
import { formatDate } from '@/libs/util'
export default {
  name: 'sys_menu',
  components: {
    MenuTree,
    MenuDetails
  },
  data () {
    return {
      columns: [
        {
          title: '菜单名称',
          key: 'menuName',
          sortable: 'custom',
          minWidth: 260,
          tooltip: true,
          fixed: 'left',
          render: (h, params) => {
            return h('span', [
              h('Icon', {
                props: {
                  type: params.row.icon
                },
                style: 'font-size: 16px; position: relative; top: -2px;'
              }),
              h('a', {
                on: {
                  click: () => {
                    this.editObject('view', params.row)
                  }
                },
                style: 'margin-left: 5px'
              }, params.row.menuName)
            ])
          }
        },
        {
          title: '菜单编号',
          key: 'menuCode',
          sortable: 'custom',
          width: 180,
          tooltip: true
        },
        {
          title: '菜单类型',
          key: 'menuType',
          sortable: 'custom',
          align: 'center',
          width: 180,
          tooltip: true,
          render: (h, params) => {
            return h('span', {}, params.row.menuTypeDesc)
          }
        },
        {
          title: '显示顺序',
          key: 'displayOrder',
          sortable: 'custom',
          width: 130,
          align: 'right'
        },
        {
          title: '修改时间',
          key: 'updateDate',
          sortable: 'custom',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('span', formatDate(new Date(params.row.updateDate), 'yyyy-MM-dd hh:mm'))
          }
        },
        {
          title: '状态',
          key: 'status',
          sortable: 'custom',
          width: 100,
          align: 'center',
          render: (h, params) => {
            let color = params.row.status === '0' ? 'success' : 'error'
            let text = params.row.status === '0' ? '启用' : '停用'
            return h('Tag', {
              props: {
                color: color
              }
            }, text)
          }
        },
        {
          title: '操作',
          key: 'id',
          minWidth: 160,
          render: (h, params) => {
            let buttons = []
            buttons.push(
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.editObject('edit', params.row)
                  }
                }
              }, '编辑')
            )
            // 增加下级按钮
            buttons.push(
              h('Button', {
                props: {
                  type: 'default',
                  size: 'small'
                },
                style: 'margin-left:5px',
                on: {
                  click: () => {
                    this.editObject('view', params.row)
                  }
                }
              }, '查看')
            )
            // 增加删除按钮
            buttons.push(
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: 'margin-left:5px',
                on: {
                  click: () => {
                    this.handleDelete(params.row.id)
                  }
                }
              }, '删除')
            )
            return h('div', buttons)
          }
        }
      ],
      // table 加载蒙版
      tableLoading: false,
      // 查询条件
      searchParams: {
        menuName: '',
        status: '',
        menuType: '',
        parentId: '0'
      },
      // 分页信息
      pageContent: {
        sortKey: 'display_order',
        content: [],
        sortOrder: 'asc'
      },
      details: {
        isEdit: false,
        modalShow: false,
        isRefresh: true,
        objectId: '',
        parentId: ''
      },
      ruleValidate: {
        menuName: [
          { required: true, message: '请输入菜单名称...', trigger: 'blur' }
        ],
        menuCode: [
          { required: true, message: '请输入菜单编号...', trigger: 'blur' },
          { validator: this.validatorEN, trigger: 'blur' },
          { validator: this.validator, trigger: 'blur' }
        ],
        menuType: [
          { required: true, message: '请选择菜单类型...', trigger: 'blur' }
        ],
        perms: [
          { validator: this.validatorPerms, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    bodyHiehgt () {
      return 'height:' + (window.innerHeight - 140) + 'px; overflow-y:auto;'
    },
    tableHeight () {
      return window.innerHeight - 230
    }
  },
  methods: {
    // 删除操作按钮
    handleDelete (id) {
      this.$Modal.confirm({
        title: '菜单信息删除',
        content: '<p>您确定要删除该笔数据吗?</p>',
        onOk: () => {
          del({ id: id }).then(res => {
            if (res.data.success) {
              this.$Message.info('删除成功')
              this.handleSearch()
              this.details.isRefresh = !this.details.isRefresh
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    // 重置按钮
    handleClear () {
      this.searchParams.menuName = ''
      this.searchParams.status = ''
      this.searchParams.menuType = ''
      this.search()
    },
    // 查询方法, 重新查询
    search () {
      let params = this.getSearchParams()
      params.pageNumber = 1
      this.tableLoading = true
      getList(params).then(res => {
        this.pageContent = res.data
        this.tableLoading = false
      })
    },
    // 查询方法, 不重置页数
    handleSearch () {
      this.tableLoading = true
      getList(this.getSearchParams()).then(res => {
        this.pageContent = res.data
        this.tableLoading = false
      })
    },
    handleKeyDown (event) {
      if (event.keyCode === 13) {
        this.search()
      }
    },
    // 获取查询条件
    getSearchParams () {
      return {
        searchParams: this.searchParams,
        pageContent: this.pageContent
      }
    },
    sortChange (sortParams) {
      if (sortParams) {
        this.pageContent.sortKey = sortParams.key
        this.pageContent.sortOrder = sortParams.order
      }

      this.handleSearch()
    },
    editObject (oper, row) {
      debugger
      if (oper === 'edit') {
        this.details.isEdit = true
        this.details.entity = Object.assign({}, row)
      } else if (oper === 'view') {
        this.details.isEdit = false
        this.details.entity = Object.assign({}, row)
      } else {
        let menuEntity = Object.assign({}, this.menuModel)
        menuEntity.parentId = this.searchParams.parentId
        this.details.entity = menuEntity
        this.details.isEdit = true
      }
      this.details.modalShow = true
    },
    // 点击切换事件
    menuChange (item) {
      if (item) {
        this.searchParams.parentId = item.nodeId
        this.handleClear()
      }
    },
    // 保存回调
    callback (oper) {
      if (oper && oper === 'ok') {
        this.details.isRefresh = !this.details.isRefresh
        this.search()
      }
      this.details.modalShow = false
      setTimeout(() => {
        this.details.entity = Object.assign({}, this.menuModel)
      }, 200)
    }
  },
  mounted () {
    this.search()
    get().then(res => {
      this.menuModel = res.data
    })
  }
}
</script>

<style lang="less" scoped>
.search-con{
  padding: 10px 0;
  .search{
    &-col{
      display: inline-block;
      width: 200px;
    }
    &-input{
      display: inline-block;
      width: 200px;
      margin-left: 2px;
    }
    &-btn{
      margin-left: 2px;
    }
  }
  .search-span{
    padding-right: 3px;
    padding-left: 5px;
  }
}
.search-page{
  text-align: right;
  margin-top: 10px;
}
.details-btn{
  margin-right: 10px;
  float: right;
}
</style>
