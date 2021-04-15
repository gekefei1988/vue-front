<template>
  <div class="dict-data">
    <Card dis-hover>
      <p slot="title">
        <span v-if="type">{{type.dictName}}-</span>字典数据
      </p>
      <ButtonGroup>
        <Button type="primary" @click="dictDataForm.handleNew">新增</Button>
        <Button type="default" @click="batchDictData.handleNew">批量新增</Button>
      </ButtonGroup>
      <div style="margin-top: 10px; clear: both;">
        <Table ref="dictDataTable" :loading="loading" :columns="columns" :data="dataList" border stripe>
          <template slot-scope="{ row }" slot="status">
            <Badge v-if="row.status === '0'" color="green" text="启用"/>
            <Badge v-else color="red" text="停用"/>
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button type="info" size="small" @click="dictDataForm.handleSubNew(row)">下级</Button>
            <Button type="info" size="small" @click="batchDictData.handleSubNew(row)" class="table-row-btn">批量下级</Button>
            <Button type="primary" size="small" @click="dictDataForm.handleEdit(row)" class="table-row-btn">编辑</Button>
            <Button type="error" size="small" @click="dictDataForm.handleDelete(row)" class="table-row-btn">删除</Button>
          </template>
        </Table>
      </div>
    </Card>
    <Modal :title="dictDataForm.title" v-model="dictDataForm.modalShow" width="900"
      @on-cancel="dictDataForm.handleCancel" :mask-closable="false">
      <DictDataForm ref="dictDataForm"></DictDataForm>
      <div slot="footer">
        <Button @click="dictDataForm.handleCancel" type="default">取消</Button>
        <Button @click="dictDataForm.handleSubmit" :loading="dictDataForm.loading" type="primary">确定</Button>
      </div>
    </Modal>
    <!--批量新增-->
    <Modal title="批量新增字典数据" v-model="batchDictData.modalShow" width="900"
      @on-cancel="batchDictData.handleCancel" :mask-closable="false">
      <DictDataBatch ref="dictDataBatch" :parentId="batchDictData.parentId" :dictType="batchDictData.dictType"></DictDataBatch>
      <div slot="footer">
        <Button @click="batchDictData.handleCancel" type="default">取消</Button>
        <Button @click="batchDictData.handleSubmit" :loading="batchDictData.loading" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { dataListTree, dataDeleteById } from '@/api/core/sys/dict/dict.js'
import DictDataForm from './DictDataForm.vue'
import DictDataBatch from './DictDataBatch.vue'
export default {
  name: 'DictData',
  components: {
    DictDataForm,
    DictDataBatch
  },
  props: {
    type: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  data () {
    return {
      // 查询条件
      searchParams: {
        dictLabel: ''
      },
      // table 蒙版
      loading: false,
      columns: [
        {
          title: '字典键名',
          key: 'label',
          width: 250,
          fixed: 'left',
          tree: true
        },
        {
          title: '字典键值',
          key: 'value',
          width: 120,
          tooltip: true
        },
        {
          title: '显示顺序',
          key: 'displayOrder',
          width: 120,
          align: 'right'
        },
        {
          title: '状态',
          key: 'status',
          width: 100,
          align: 'center',
          slot: 'status'
        },
        { title: '操作',
          minWidth: 180,
          key: 'id',
          slot: 'action'
        }
      ],
      dataList: [],
      // 表单
      dictDataForm: {
        title: '',
        modalShow: false,
        loading: false,
        handleNew: () => {
          if (this.type) {
            this.dictDataForm.title = '新增字典数据'
            this.dictDataForm.modalShow = true
            this.$refs.dictDataForm.handleSetParent('0', this.type.dictType)
          } else {
            this.$Notice.warning({
              title: '提醒信息',
              desc: '未获取到相应类型, 不能进行新增操作'
            })
          }
        },
        // 新增下级
        handleSubNew: (row) => {
          this.dictDataForm.title = '新增字典数据'
          this.dictDataForm.modalShow = true
          this.$refs.dictDataForm.handleSetParent(row.id, row.dictType)
        },
        // 编辑
        handleEdit: (row) => {
          this.dictDataForm.title = '编辑字典数据'
          this.dictDataForm.modalShow = true
          this.$refs.dictDataForm.handleLoadDataForm(row.id)
        },
        // 删除
        handleDelete: (row) => {
          if (row) {
            this.$Modal.confirm({
              title: '删除确认',
              content: '您确定要删除字典数据<font color="red">[' + row.label + ']</font>吗?',
              onOk: () => {
                dataDeleteById(row.id).then(res => {
                  if (!res.data.success) {
                    this.$Message.error(res.data.msg)
                  } else {
                    this.handleSearch()
                  }
                })
              }
            })
          }
        },
        // 取消
        handleCancel: () => {
          this.dictDataForm.modalShow = false
          this.$refs.dictDataForm.handleCancel()
        },
        // 提交表单
        handleSubmit: () => {
          this.$refs.dictDataForm.handleSubmit().then(res => {
            if (res && res.data.success) {
              this.dictDataForm.handleCancel()
              this.handleSearch()
            } else if (res && !res.data.success) {
              this.$Message.error(res.data.msg)
            }
          })
        }
      },
      // 批量新增
      batchDictData: {
        loading: false,
        modalShow: false,
        parentId: '',
        dictType: '',
        handleNew: () => {
          this.batchDictData.parentId = '0'
          this.batchDictData.dictType = this.type.dictType
          this.batchDictData.modalShow = true
        },
        handleSubNew: (row) => {
          this.batchDictData.parentId = row.id
          this.batchDictData.dictType = row.dictType
          this.batchDictData.modalShow = true
        },
        // 取消
        handleCancel: () => {
          this.batchDictData.modalShow = false
          this.batchDictData.parentId = ''
          this.batchDictData.dictType = ''
          this.$refs.dictDataBatch.handleClear()
        },
        // 提交
        handleSubmit: () => {
          this.$refs.dictDataBatch.handleSubmit().then(res => {
            if (res) {
              if (res.data.success) {
                this.batchDictData.handleCancel()
                this.handleSearch()
              } else {
                this.$Message.error(res.data.msg)
              }
            }
          })
        }
      }
    }
  },
  methods: {
    handleSearch () {
      if (this.type) {
        this.loading = true
        dataListTree({ dictType: this.type.dictType, dictLabel: this.searchParams.dictLabel }).then(res => {
          if (res.data.success) {
            this.dataList = res.data.body
          } else {
            this.$Message.error(res.data.msg)
          }
          this.loading = false
        })
      }
    },
    // 清除
    handleClear () {
      this.searchParams.dictLabel = ''
      this.handleSearch()
    }
  },
  watch: {
    type (newVal) {
      if (newVal) {
        this.handleSearch()
      }
    }
  }
}
</script>

<style>
</style>
