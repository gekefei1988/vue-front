<template>
  <div>
    <Card>
      <SearchGroup @search="handleSearch" @clear="handleClear">
        <SearchGroupItem label="关键字">
          <Input @on-keydown="handleKeyDown" :maxlength="100" placeholder="区域名称或编号" class="search-input" v-model="searchParams.areaName"/>
        </SearchGroupItem>
        <SearchGroupItem label="状态">
          <Select v-model="searchParams.status" clearable clearSingleSelect>
            <Option value="0">启用</Option>
            <Option value="1">停用</Option>
          </Select>
        </SearchGroupItem>
      </SearchGroup>
    </Card>
    <VTablePage :loading="loading" :columns="columns" :pageContent="pageContent" :usedOpers="true" style="margin-top: 5px;" @on-search="handleSearch">
      <ButtonGroup>
        <Button @click="editObject('new')" v-if="buttonAccess['sys:area:save']"
          class="add-btn" type="primary">新增</Button><Button v-if="buttonAccess['sys:dicttype:export']" type="success" icon="ios-arrow-dropup">导出Excel</Button>
      </ButtonGroup>
<!--      <ButtonGroup>
        <Button v-if="buttonAccess['sys:area:import']" type="success" icon="ios-arrow-dropdown">导入Excel</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button v-if="buttonAccess['sys:area:export']" type="success" icon="ios-arrow-dropup">导出Excel</Button>
      </ButtonGroup> -->
    </VTablePage>
    <!--新增 修改 查看 ========start==========-->
    <Modal
      :title="details.title"
      v-model="details.modalShow"
      width="900"
      @on-cancel="closeModal(false)"
      :mask-closable="false">
      <AreaForm ref="areaForm" :formEntity="formItem" :isEdit="details.isEdit" :parentCode="searchParams.parentCode" @on-callback="callback"></AreaForm>
      <div slot="footer">
        <Button @click="closeModal(false)" type="default">取消</Button>
        <Button @click="handleSave" v-if="details.isEdit" :loading="areaLoading" type="primary">确定</Button>
      </div>
    </Modal>
    <!--新增 修改 查看 ========end==========-->
  </div>
</template>
<script>
import TableTag from '@/components/table-tag'
import AreaForm from './area-form.vue'
import { list, del } from '@/api/core/sys/area/area-api'
import { formatDate } from '@/libs/util'
import { getAccess } from '@/api/open-api/sys/api'
export default {
  name: 'sys_area',
  components: {
    TableTag,
    AreaForm
  },
  computed: {},
  data () {
    return {
      areaLoading: false,
      buttonAccess: {
        'sys:area:save': false,
        'sys:area:delete': false,
        'sys:area:import': false,
        'sys:area:export': false
      },
      // 模版
      loading: false,
      pageContent: {
        total: 0,
        pageNumber: 1,
        pageSize: 10,
        sortKey: '',
        sortOrder: '',
        defaultSortKey: '',
        defaultSortOrder: ''
      },
      columns: [
        {
          title: '区域名称',
          key: 'areaName',
          sortable: 'custom',
          width: 200,
          tooltip: true,
          fixed: 'left',
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.editObject('view', params.row)
                }
              }
            }, params.row.areaName)
          }
        },
        {
          title: '区域编号',
          key: 'areaCode',
          sortable: 'custom',
          active: false,
          align: 'center',
          width: 120
        },
        {
          title: '区域类型',
          key: 'areaType',
          sortable: 'custom',
          align: 'center',
          width: 140,
          tooltip: true,
          render: (h, params) => {
            return h('span', {}, params.row.areaTypeDesc)
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
          title: '显示顺序',
          key: 'displayOrder',
          sortable: 'custom',
          width: 120,
          align: 'right'
        },
        {
          title: '修改时间',
          key: 'updateDate',
          sortable: 'custom',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('span', formatDate(new Date(params.row.updateDate), 'yyyy-MM-dd hh:mm'))
          }
        },
        {
          title: '操作',
          key: 'id',
          minWidth: 230,
          active: false,
          render: (h, params) => {
            let buttons = []
            if (this.buttonAccess['sys:area:save']) {
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
            }
            // 查看按钮
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
            // 下级按钮
            buttons.push(
              h('Button', {
                props: {
                  type: 'default',
                  size: 'small'
                },
                style: 'margin-left:5px',
                on: {
                  click: () => {
                    this.createTagDictData(params.row)
                  }
                }
              }, '下级')
            )
            // 增加删除按钮
            if (this.buttonAccess['sys:area:delete']) {
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
            }
            return h('div', buttons)
          }
        }
      ],
      tableLoading: false,
      screenShow: false,
      searchParams: {
        status: '',
        areaName: '',
        parentCode: '0'
      },
      areaModel: {},
      details: {
        title: '新增区域',
        isEdit: false,
        modalShow: false
      },
      formItem: null,
      // 字典标题数据
      titleList: []
    }
  },
  methods: {
    // 查询,
    list,
    // 重置按钮
    handleClear () {
      this.searchParams.status = ''
      this.searchParams.areaName = ''
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
      this.loading = true
      list({
        searchParams: this.searchParams,
        pageContent: vPageContent
      }).then(res => {
        this.pageContent = res.data
        this.loading = false
      })
    },
    // 删除操作按钮
    handleDelete (id) {
      this.$Modal.confirm({
        title: '行政区划删除',
        content: '<p>您确定要删除该笔数据吗?</p>',
        onOk: () => {
          del({ id: id }).then(res => {
            if (res.data.success) {
              this.$Message.success('删除成功')
              this.handleSearch(null, false)
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    // 点击页签查询
    selectFun (selectIndex) {
      if (this.titleList.length > 0) {
        let list = this.titleList.filter((item, index) => {
          return index <= selectIndex
        })
        this.titleList = list
        // 获取最后一条数据
        if (this.titleList.length > 1) {
          let item = this.titleList[this.titleList.length - 1]
          this.searchParams.parentCode = item.id
        } else {
          this.searchParams.parentCode = '0'
        }

        this.handleClear()
      }
    },
    handleKeyDown (event) {
      if (event.keyCode === 13) {
        this.handleSearch(null, false)
      }
    },
    // 打开字典数据标签
    createTagDictData (row) {
      this.titleList.push({
        id: row.areaCode,
        title: row.areaName
      })
      this.searchParams.parentCode = row.areaCode
      this.handleClear()
    },
    editObject (oper, row) {
      if (oper === 'edit') {
        this.details.title = '行政区划信息'
        this.details.isEdit = true
        this.formItem = Object.assign({}, row)
      } else if (oper === 'view') {
        this.details.title = '行政区划信息'
        this.details.isEdit = false
        this.formItem = Object.assign({}, row)
      } else {
        this.details.title = '行政区划信息'
        this.details.isEdit = true
      }
      this.details.modalShow = true
    },
    handleSave () {
      this.areaLoading = true
      this.$refs['areaForm'].handleSave()
    },
    callback (isSuccess) {
      this.areaLoading = false
      if (isSuccess) {
        this.closeModal(true)
      }
    },
    closeModal (isSearch) {
      this.details.modalShow = false
      if (isSearch) {
        // 刷新表格
        this.handleSearch(null, false)
      }
      setTimeout(() => {
        this.formItem = Object.assign({}, null)
      }, 200)
    },
    // 获取权控按钮
    loadButtonsAccess () {
      getAccess(this.buttonAccess).then(res => {
        this.buttonAccess = res.data
      })
    }
  },
  mounted () {
    this.titleList.push({
      id: '',
      title: '行政区划'
    })
    this.loadButtonsAccess()
    this.handleSearch(null, false)
  }
}
</script>

<style lang="less" scoped>
</style>
