<template>
  <div class="eip-area-cascade">
    <Row v-if="isEdit">
      <Col span="7">
        <Select v-model="provinceSelected" transfer clearable filterable placeholder="省"
          @on-change="handleChangeProvince" style="width: calc(100% - 20px)">
          <template v-for="item in province">
            <Option :value="item.value" :key="item.id" :label="item.label"></Option>
          </template>
        </Select>
        <span>省</span>
      </Col>
      <Col span="7" offset="1">
        <Select v-model="citySelected" transfer clearable filterable placeholder="市"
          @on-change="handleChangeCity" style="width: calc(100% - 20px)">
          <template v-for="item in city">
            <Option :value="item.value" :key="item.id" :label="item.label"></Option>
          </template>
        </Select>
        <span>市</span>
      </Col>
      <Col span="8" offset="1">
        <Select v-model="districtSelected" transfer clearable filterable placeholder="区/县"
          @on-change="handleChangeDistrict" style="width: calc(100% - 40px)">
          <template v-for="item in district">
            <Option :value="item.value" :key="item.id" :label="item.label"></Option>
          </template>
        </Select>
        <span>区/县</span>
      </Col>
    </Row>
    <template v-else>{{areasName}}</template>
  </div>
</template>

<script>
import { getAreaCascader } from '@/api/open-api/sys/api'
export default {
  name: 'EipAreaCascade',
  props: {
    areas: {
      type: String,
      default: () => ''
    },
    areaCode: {
      type: String,
      default: () => '370000'
    },
    isEdit: {
      type: Boolean,
      default: () => true
    }
  },
  model: {
    prop: 'areas',
    event: 'returnBack'
  },
  data () {
    return {
      province: [],
      city: [],
      district: [],
      provinceSelected: '',
      citySelected: '',
      districtSelected: '',
      areasName: ''
    }
  },
  methods: {
    searchArea (level) {
      if (level === 1) {
        this.city.forEach(item => {
          if (item.value === this.citySelected) {
            this.district = item.children
          }
        })
      } else {
        this.province.forEach(item => {
          if (item.value === this.provinceSelected) {
            this.city = item.children
          }
        })
      }
    },
    initLoadArea () {
      // 是否编辑, 不为编辑需要获取地址
      if (this.isEdit) {
        let areas = this.areas.split(',')
        this.provinceSelected = areas[0]
        this.citySelected = areas[1]
        this.districtSelected = areas[2]
        this.handleChangeProvince(this.provinceSelected)
        this.handleChangeCity(this.citySelected)
      }
    },
    // 更改省
    handleChangeProvince (item) {
      if (item) {
        this.searchArea(0)
      } else {
        this.city = []
        this.district = []
        this.citySelected = ''
        this.districtSelected = ''
      }
      let value = [ this.provinceSelected, this.citySelected, this.districtSelected ]
      this.$emit('returnBack', value.join(','))
    },
    // 更改市
    handleChangeCity (item) {
      if (item) {
        this.searchArea(1)
      } else {
        this.district = []
        this.districtSelected = ''
      }
      let value = [ this.provinceSelected, this.citySelected, this.districtSelected ]
      this.$emit('returnBack', value.join(','))
    },
    // 更改区县
    handleChangeDistrict (item) {
      let value = [ this.provinceSelected, this.citySelected, this.districtSelected ]
      this.$emit('returnBack', value.join(','))
    }
  },
  mounted () {
    getAreaCascader({ areaCode: this.areaCode }).then(res => {
      this.province = res.data
    })
  },
  watch: {
    areas (newVal) {
      if (newVal) {
        this.initLoadArea()
      }
    }
  }
}
</script>

<style lang="less" scoped="scoped">
</style>
