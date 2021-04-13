<template>
  <div class="dict-type">
    <Card title="字典类型" dis-hover>
      <Button type="primary" slot="extra" @click="typeForm.handleNew" style="margin-top: -4px;">新增</Button>
      <Row>
        <Col span="20" style="width: calc(100% - 40px);">
          <Input v-model="searchParams.dictName" search enter-button :maxlength="50"
            placeholder="字典类型名称或编号" @on-search="handleSearch" @on-enter="handleSearch"/>
        </Col>
        <Col span="4" style="padding-left:5px; width: 40px;">
          <Button type="default" icon="md-refresh" @click="handleClear"></Button>
        </Col>
      </Row>
      <Table ref="dictTypeTable" row-key="id" :loading="loading" highlight-row stripe
        context-menu show-context-menu @on-contextmenu="handleContextMenu"
        :columns="columns" :data="pageContent.content" border @on-sort-change="handleSortChange"
        @on-row-click="handleSelect" @on-cell-click="handleCellSelect" style="margin-top: 10px;">
        <template slot-scope="{ row }" slot="dictName">
          <font v-if="row.status === '0'">{{row.dictName}}</font>
          <font v-else color="red">{{row.dictName}}</font>
        </template>
        <template slot="contextMenu">
          <DropdownItem @click.native="typeForm.handleEdit">编辑</DropdownItem>
          <DropdownItem @click.native="handleDelete" style="color: #ed4014">删除</DropdownItem>
        </template>
      </Table>
      <div style="margin-top: 5px; text-align: right;">
        <Page :total="pageContent.total" show-total @on-change="handlePageChange"/>
      </div>
    </Card>
    <Modal :title="typeForm.title" v-model="typeForm.modalShow" width="800" @on-cancel="typeForm.handleCancel" :mask-closable="false">
      <DictTypeForm ref="typeForm"></DictTypeForm>
      <div slot="footer">
        <Button @click="typeForm.handleCancel" type="default">取消</Button>
        <Button @click="typeForm.handleSubmit" :loading="typeForm.loadding" type="primary">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { typeList, typeDeleteById } from '@/api/core/sys/dict/dict.js'
import DictTypeForm from './DictTypeForm.vue'
export default {
  name: 'DictTtype',
  components: {
    DictTypeForm
  },
  data () {
    return {
      searchParams: {
        dictName: ''
      },
      // 蒙版
      loading: false,
      // 分页信息
      pageContent: {
        total: 0,
        pageNumber: 1,
        pageSize: 10,
        sortKey: 'update_date',
        sortOrder: 'desc',
        defaultSortKey: '',
        defaultSortOrder: ''
      },
      // 展示栏位
      columns: [
        {
          title: '字典名称',
          key: 'dictName',
          sortable: 'custom',
          minWidth: 180,
          slot: 'dictName'
        },
        { title: '字典类型', key: 'dictType', sortable: 'custom', width: 200, tooltip: true }
      ],
      // 选中行
      contextRow: null,
      typeForm: {
        title: '新增字典类型',
        modalShow: false,
        loadding: false,
        id: '',
        handleNew: () => {
          this.typeForm.title = '新增字典类型'
          this.typeForm.modalShow = true
        },
        handleEdit: () => {
          this.typeForm.title = '编辑字典类型'
          this.typeForm.modalShow = true
          this.$refs['typeForm'].handleLoadTypeForm(this.contextRow.id)
        },
        // 提交表单
        handleSubmit: () => {
          this.$refs['typeForm'].handleSubmit().then(res => {
            if (res && res.data.success) {
              this.typeForm.handleCancel()
              this.handleSearch()
            } else if (res && !res.data.success) {
              this.$Message.error(res.data.msg)
            }
          })
        },
        // 取消
        handleCancel: () => {
          this.typeForm.modalShow = false
          this.$refs['typeForm'].handleCancel()
        }
      }
    }
  },
  methods: {
    // 查询
    handleSearch () {
      this.loading = true
      typeList({ searchParams: this.searchParams, pageContent: this.pageContent }).then(res => {
        this.pageContent = res.data
        this.contextRow = null
        this.loading = false
      })
    },
    // 清空
    handleClear () {
      this.searchParams.dictName = ''
      this.handleSearch()
      this.pageContent.pageNumber = 1
    },
    handleContextMenu (row) {
      this.contextRow = row
    },
    // 删除
    handleDelete () {
      this.$Modal.confirm({
        title: '删除确认',
        content: '您确定要删除字典类型<font color="red">[' + this.contextRow.dictName + ']</font>吗?',
        onOk: () => {
          typeDeleteById(this.contextRow.id).then(res => {
            if (!res.data.success) {
              this.$Message.error(res.data.msg)
            } else {
              this.handleSearch()
            }
          })
        }
      })
    },
    // 选中
    handleSelect (item) {
      this.$emit('on-select', item)
    },
    // 选中单元格
    handleCellSelect (row, column, data) {
      this.$emit('on-cell-click', row, column, data)
    },
    // 排序
    handleSortChange (sortParams) {
      if (sortParams) {
        this.pageContent.sortKey = sortParams.key
        this.pageContent.sortOrder = sortParams.order
        this.pageContent.pageNumber = 1
      }
      this.handleSearch()
    },
    // 分页
    handlePageChange (pageNumber) {
      this.pageContent.pageNumber = pageNumber
      this.handleSearch()
    }
  },
  mounted () {
    this.handleSearch()
  }
}
</script>
