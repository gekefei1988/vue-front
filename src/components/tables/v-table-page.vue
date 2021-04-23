<template>
  <Card :class="computedCard" :bordered="bordered" :dis-hover="disHover" :shadow="shadow">
    <p v-if="title" slot="title">{{title}}</p>
    <Row class="v-table-page-buttons">
      <Col span="12" class="v-table-page-buttons-left">
        <slot></slot>
        <slot name="buttons"></slot>
        <template v-if="usedOpers">&nbsp;</template>
      </Col>
      <Col v-if="usedOpers" span="12" class="v-table-page-buttons-right">
        <Button type="default" @click="handleClickRefresh"><Icon type="md-refresh"/></Button>
        <Dropdown transfer @on-click="handleClicSize">
          <Button type="default"><Icon type="md-list"/></Button>
          <DropdownMenu slot="list">
            <DropdownItem name="default" :selected="tableSize === 'default'">默认</DropdownItem>
            <DropdownItem name="large" :selected="tableSize === 'large'">宽松</DropdownItem>
            <DropdownItem name="small" :selected="tableSize === 'small'">紧凑</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown transfer placement="bottom-end">
          <Button type="default"><Icon type="md-options" /></Button>
          <Card slot="list" class="v-table-col-card" :bordered="false" dis-hover :shadow="false">
            <p slot="title">展示列</p>
            <a slot="extra" @click.prevent="handleResetColumns">重置</a>
            <CheckboxGroup v-model="cbxSelecteds" @on-change="handleChangeCbx">
              <div class="cbx-column" v-for="col in cbxColumns" :key="`col_` + col.key">
                <Checkbox :label="col.key">
                  <span>{{col.title}}</span>
                </Checkbox>
              </div>
            </CheckboxGroup>
          </Card>
        </Dropdown>
      </Col>
    </Row>
    <Table border highlight-row stripe
    :loading="loading"
    :columns="dyColumns"
    :data="computedDatas"
    :size="tableSize"
    :height="height"
    @on-sort-change="handleSortChange"
    @on-row-click="handleRowClick"
    @on-select="handleSelect"
    @on-select-cancel="handleSelectCancel"
    @on-select-all="handleSelectAll"
    @on-select-all-cancel="handleSelectAllCancel"
    @on-selection-change="handleSelectionChange">
    </Table>
    <div class="v-table-page-info" v-if="showPage">
      <Page
        :total="pageContent.total"
        :current="pageContent.pageNumber"
        :pageSize="pageContent.pageSize"
        :show-sizer="showSizer"
        :show-elevator="showElevator"
        show-total
        :size="computedPageSize"
        :page-size-opts="pageSizeOpts"
        @on-change="handlePageChange"
        @on-page-size-change="handlePageSizeChange"
        />
    </div>
  </Card>
</template>

<script>
export default {
  name: 'vTablePage',
  props: {
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'default'
    },
    bordered: {
      type: Boolean,
      default: false
    },
    disHover: {
      type: Boolean,
      deafult: true
    },
    shadow: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: ''
    },
    // 展示列
    columns: {
      type: Array,
      default: () => []
    },
    // 使用操作列
    usedOpers: {
      type: Boolean,
      default: true
    },
    // 数据列
    datas: {
      type: Array,
      default: () => []
    },
    showPage: {
      type: Boolean,
      default: true
    },
    // 分页使用 === start
    pageSizeOpts: {
      type: Array,
      default: () => [10, 20, 30, 50]
    },
    // 显示分页条数选择
    showSizer: {
      type: Boolean,
      default: false
    },
    // 显示输入跳转页
    showElevator: {
      type: Boolean,
      default: true
    },
    // 显示总页数
    showTotal: {
      type: Boolean,
      default: true
    },
    // 分页参数
    pageContent: {
      type: Object,
      default: () => {
        return {
          total: 0,
          pageNumber: 1,
          pageSize: 10,
          content: [],
          sortKey: '',
          sortOrder: '',
          defaultSortKey: '',
          defaultSortOrder: ''
        }
      }
    }
    // 分页使用 === end
  },
  computed: {
    computedPageSize () {
      return this.tableSize === 'small' ? 'small' : null
    },
    computedCard () {
      // return 'v-table-page' + (this.title ? '' : ' v-table-page-card')
      return 'v-table-page ' + (this.bordered ? 'v-table-page-card' : '')
    },
    computedDatas () {
      if (this.showPage) {
        return this.pageContent.content
      } else {
        return this.datas
      }
    },
    computedTalbeSize () {
      return this.tableSize
    }
  },
  data () {
    return {
      // 动态列
      dyColumns: [],
      // checkbox列
      cbxColumns: [],
      // checkbox选中的列
      cbxSelecteds: [],
      tableSize: 'default'
    }
  },
  methods: {
    newPageContent (params) {
      const vPageContent = {
        total: 0,
        pageNumber: 1,
        pageSize: 10,
        sortKey: '',
        sortOrder: '',
        defaultSortKey: '',
        defaultSortOrder: ''
      }
      // 赋值属性
      for (let key in vPageContent) {
        vPageContent[key] = this.pageContent[key]
      }

      if (params) {
        for (let key in params) {
          vPageContent[key] = params[key]
        }
      }

      return vPageContent
    },
    // 排序
    handleSortChange (sortParams) {
      if (sortParams) {
        let vPageContent = this.newPageContent({
          sortKey: sortParams.key,
          sortOrder: sortParams.order,
          pageNumber: 1
        })
        this.$emit('on-search', vPageContent)
      }
    },
    // 分页
    handlePageChange (pageNumber) {
      let vPageContent = this.newPageContent({
        pageNumber: pageNumber
      })
      this.$emit('on-search', vPageContent)
    },
    // 更改pageSize
    handlePageSizeChange (pageSize) {
      let vPageContent = this.newPageContent({
        pageSize: pageSize,
        pageNumber: 1
      })
      this.$emit('on-search', vPageContent)
    },
    // 单机一行
    handleSelect (selection, item) {
      this.$emit('on-select', selection, item)
    },
    handleSelectCancel (selection, item) {
      this.$emit('on-select-cancel', selection, item)
    },
    handleSelectAll (selection) {
      this.$emit('on-select-all', selection)
    },
    handleSelectAllCancel (selection) {
      this.$emit('on-select-all-cancel', selection)
    },
    handleSelectionChange (selection) {
      this.$emit('on-selection-change', selection)
    },
    handleRowClick (item) {
      this.$emit('on-row-click', item)
    },
    // 重置列
    handleResetColumns () {
      // 获取动态列, 不获取隐藏的列
      this.dyColumns = this.columns.filter(item => {
        return item.hidden !== true
      })
      // 是否开启了操作按钮
      this.cbxColumns = []
      // checkbox 选中列
      this.cbxSelecteds = []
      this.columns.forEach(item => {
        if (item.active !== false) {
          this.cbxColumns.push(item)

          // 判断是否需要选中
          if (item.hidden !== true) {
            this.cbxSelecteds.push(item.key)
          }
        }
      })
    },
    handleChangeCbx (items) {
      let dyColumns = this.columns.filter(({ key, active }) => {
        return items.indexOf(key) >= 0 || active === false
      })
      this.dyColumns = dyColumns
    },
    handleClicSize (size) {
      this.tableSize = size
    },
    handleClickRefresh () {
      this.$emit('on-search', this.newPageContent())
    }
  },
  mounted () {
    this.tableSize = this.size
    // 是否开启了操作按钮
    if (this.usedOpers) {
      this.handleResetColumns()
    } else {
      this.dyColumns = this.columns
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  .v-table-page {
    .v-table-page-buttons {
      margin-bottom: 5px;
      .v-table-page-buttons-left {
        text-align: left;
      }
      .v-table-page-buttons-right {
        padding-right: 5px;
        text-align: right;
      }

    }
    .v-table-page-info {
      padding-top: 5px;
      padding-right: 5px;
      text-align: right;
    }
  }
  .v-table-col-card {
    width: 170px;
    /deep/ .ivu-card-body {
      padding: 5px 10px;
    }
    /deep/ .ivu-card-head {
      padding: 10px;
    }
    /deep/ .ivu-card-extra {
      top: 10px;
    }
    .cbx-column {
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      span {
        margin-left: 5px;
      }
    }
  }
  .v-table-page-card {
    margin-top: 5px;
    /deep/ .ivu-card-body {
      padding: 10px;
    }
  }

  /deep/.ivu-table-row-highlight td{
      background-color:rgba(45,140,240,0.2) !important;
  }

</style>
