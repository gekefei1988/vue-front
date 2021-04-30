<template>
  <div>
    <Card>
      <SearchGroup @search="handleSearch" @clear="handleClear">
        <SearchGroupItem label="手机号码">
          <Input @on-keydown="handleKeyDown" :maxlength="11" placeholder="手机号码" v-model="searchParams.telephone"/>
        </SearchGroupItem>
        <SearchGroupItem label="注册时间">
          <DatePicker v-model="regDate" type="datetimerange" format="yyyy-MM-dd HH:mm" placement="bottom-end" clearable placeholder="选择注册时间"
          @on-change="handleChangeRegDate" style="width: 100%;"></DatePicker>
        </SearchGroupItem>
      </SearchGroup>
    </Card>
    <VTablePage :loading="tableLoading" :columns="columns" :pageContent="pageContent" :usedOpers="true"
      style="margin-top: 5px;" @on-search="handleSearch">
    </VTablePage>
  </div>
</template>
<script>
import { getRegRecList } from '@/api/core/sys/tenant/tenant-api.js'
import { formatDate } from '@/libs/util.js'
export default {
  name: 'sys-tenant',
  data () {
    return {
      columns: [
        {
          title: '注册手机',
          key: 'telephone',
          sortable: 'custom',
          width: 300,
          align: 'left',
          active: false
        },
        {
          title: '注册时间',
          key: 'regDate',
          sortable: 'custom',
          width: 250,
          align: 'center',
          active: false,
          render: (h, params) => {
            return h('span', formatDate(new Date(params.row.regDate), 'yyyy-MM-dd hh:mm'))
          }
        },
        {
          title: '注册地址',
          key: 'remoteAddr',
          sortable: 'custom',
          width: 250,
          align: 'center'
        },
        {
          title: '操作',
          key: 'id',
          sortable: 'custom',
          minWidth: 200,
          align: 'center',
          render: (h, params) => {
            return h('span', '')
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
      searchParams: {
        telephone: '',
        startDate: '',
        endDate: '',
        regDate: ''
      },
      regDate: null
    }
  },
  methods: {
    // 重置按钮
    handleClear () {
      this.searchParams.telephone = ''
      this.regDate = null
      this.searchParams.startDate = ''
      this.searchParams.endDate = ''
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
      getRegRecList({
        searchParams: this.searchParams,
        pageContent: vPageContent
      }).then(res => {
        if (res.data.success) {
          this.pageContent = res.data.body
        } else {
          this.$Message.error('查询出现异常, 错误信息: ' + res.data.msg)
        }
        this.tableLoading = false
      })
    },
    handleKeyDown (event) {
      if (event.keyCode === 13) {
        this.handleSearch(null, false)
      }
    },
    handleChangeRegDate (items) {
      console.log(items)
      if (items) {
        this.searchParams.startDate = items[0]
        this.searchParams.endDate = items[1]
      }
    }
  },
  mounted () {
    // 初始查询
    this.handleSearch(null, false)
  }
}
</script>
<style lang="less" scoped>
</style>
