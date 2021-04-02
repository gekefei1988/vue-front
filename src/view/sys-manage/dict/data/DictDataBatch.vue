<template>
  <div class="dict-data-batch">
    <ButtonGroup>
      <Button type="primary" @click="handleAdd">添加</Button>
    </ButtonGroup>
    <Table border :columns="columns" size="small" :data="dictDataSubs" maxHeight="400" style="margin-top: 10px;">
      <template slot-scope="{ row, index }" slot="dictLabel">
        <Input v-model="dictDataSubs[index].dictLabel" :maxlength="50" placeholder="请输入字典键名"></Input>
      </template>
      <template slot-scope="{ row, index }" slot="dictValue">
        <Input v-model="dictDataSubs[index].dictValue" :maxlength="50" placeholder="请输入字典键值"></Input>
      </template>
      <template slot-scope="{ row, index }" slot="displayOrder">
        <Input v-model="dictDataSubs[index].displayOrder" type="number" placeholder="请输入显示顺序"></Input>
      </template>
      <template slot-scope="{ row, index }" slot="status">
        <i-switch v-model="dictDataSubs[index].status" size="large" true-value="0" false-value="1" false-color="#ff4949">
          <span slot="open">启用</span>
          <span slot="close">停用</span>
        </i-switch>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="error" size="small" @click="handleDelete(index)">移除</Button>
      </template>
    </Table>
    <Spin size="large" fix v-if="spinShow">加载中...</Spin>
  </div>
</template>

<script>
import { saveDataList } from '@/api/core/sys/dict/dict.js'
export default {
  name: 'DictDataBatch',
  props: {
    parentId: {
      type: String,
      default: ''
    },
    dictType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      spinShow: false,
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80,
          align: 'center'
        },
        {
          title: '字典键名',
          key: 'dictLabel',
          width: 250,
          slot: 'dictLabel'
        },
        {
          title: '字典键值',
          key: 'dictValue',
          width: 150,
          slot: 'dictValue'
        },
        {
          title: '显示顺序',
          key: 'displayOrder',
          width: 150,
          align: 'right',
          slot: 'displayOrder'
        },
        {
          title: '状态',
          key: 'status',
          width: 100,
          align: 'center',
          slot: 'status'
        },
        { title: '操作',
          key: 'id',
          slot: 'action'
        }
      ],
      dictDataSubs: []
    }
  },
  methods: {
    // 添加
    handleAdd () {
      this.dictDataSubs.push({
        id: '',
        dictLabel: '',
        dictValue: '',
        displayOrder: this.dictDataSubs.length * 10,
        status: '0'
      })
    },
    // 移除
    handleDelete (index) {
      if (index >= 0) {
        this.dictDataSubs.splice(index, 1)
      }
    },
    // 提交
    handleSubmit () {
      return new Promise((resolve, reject) => {
        if (this.dictDataSubs.length > 0) {
          saveDataList(this.dictDataSubs, this.parentId, this.dictType).then(res => {
            resolve(res)
          })
        } else {
          resolve()
        }
      })
    },
    // 清空
    handleClear () {
      setTimeout(() => {
        this.dictDataSubs = []
      })
    }
  }
}
</script>

<style>
</style>
