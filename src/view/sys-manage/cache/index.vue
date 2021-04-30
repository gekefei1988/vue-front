<template>
  <div>
    <Card>
      <SearchGroup @search="search" @clear="handleClear">
        <SearchGroupItem label="缓存类型">
          <Select v-model="searchParams.cacheType" @on-change="changeCacheType">
            <Option v-for="item in cacheNames" :key="item.key" :value="item.key">{{item.value}}</Option>
          </Select>
        </SearchGroupItem>
        <SearchGroupItem label="缓存键值">
          <Input @on-keydown="handleKeyDown" :maxlength="100" placeholder="缓存键值" class="search-input" v-model="searchParams.name"/>
        </SearchGroupItem>
      </SearchGroup>
      <div style="clear: both; margin-top:10px;">
        <Table border highlight-row stripe :loading="tableLoading" :columns="columns" :data="pageContent.content"></Table>
      </div>
    </Card>
  </div>
</template>
<script>
import { getCacheNames, getCacheList, clearCache } from '@/api/core/sys/cache/cache-api'
import { getAccess } from '@/api/open-api/sys/api'
export default {
  name: 'sys_cache_list',
  components: {},
  data () {
    return {
      // 权控
      buttonAccess: {
        'comp:cache:delete': false
      },
      cacheNames: [],
      columns: [
        {
          title: '缓存类型',
          key: 'cacheTypeName',
          width: 200,
          tooltip: true
        },
        {
          title: '缓存键值',
          key: 'key',
          width: 400,
          tooltip: true
        },
        {
          title: '操作',
          key: 'key',
          minWidth: 200,
          render: (h, params) => {
            let buttons = []
            // 删除
            if (this.buttonAccess['comp:cache:delete']) {
              buttons.push(
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: 'margin-left:5px',
                  on: {
                    click: () => {
                      this.handleDelete(params.row)
                    }
                  }
                }, '清除')
              )
            }
            return h('div', buttons)
          }
        }
      ],
      // table 加载蒙版
      tableLoading: false,
      pageContent: {
        content: []
      },
      searchParams: {
        name: '',
        cacheType: 'systemCache'
      }
    }
  },
  methods: {
    // 删除操作按钮
    handleDelete (cache) {
      this.$Modal.confirm({
        title: '清除缓存数据',
        content: '<p>您确定要清除该缓存数据吗?</p>',
        onOk: () => {
          clearCache({ cacheType: cache.cacheType, key: cache.key }).then(res => {
            if (res.data.success) {
              this.$Message.success('删除成功')
              this.search()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    // 重置按钮
    handleClear () {
      this.searchParams.name = ''
      this.searchParams.cacheType = ''
      this.search()
    },
    // 查询方法, 重新查询
    search () {
      let params = this.getSearchParams()
      this.tableLoading = true
      getCacheList(params).then(res => {
        this.pageContent.content = res.data
        this.tableLoading = false
      })
    },
    changeCacheType (item) {
      this.searchParams.cacheType = item
      this.search()
    },
    handleKeyDown (event) {
      if (event.keyCode === 13) {
        this.search()
      }
    },
    // 获取查询条件
    getSearchParams () {
      let params = {
        name: this.searchParams.name,
        cacheType: this.searchParams.cacheType
      }

      return params
    },
    // 获取权控按钮
    loadButtonsAccess () {
      getAccess(this.buttonAccess).then(res => {
        this.buttonAccess = res.data
      })
    }
  },
  mounted () {
    // 获取缓存类型
    getCacheNames().then(res => {
      this.cacheNames = res.data
    })
    // 初始查询
    this.search()
    this.loadButtonsAccess()
  }
}
</script>

<style lang="less" scoped>
</style>
