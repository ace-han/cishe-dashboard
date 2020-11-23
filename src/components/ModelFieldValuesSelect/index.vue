<template>
  <el-select
    :value="value"
    filterable
    remote
    reserve-keyword
    placeholder="模糊匹配，一次返回20个"
    :allow-create="allowCreate"
    :loading="loading"
    :multiple="multiple"
    :remote-method="fetchItems"
    :style="selectStyle"
    @change="onChange"
  >
    <el-option
      v-for="item in items"
      :key="item"
      :value="item"
    />
  </el-select>
</template>

<script lang="ts">
import _ from 'lodash'
import request from '@/utils/request'
import { ListResponse } from '@/api/types'
import { Component, Prop, Vue } from 'vue-property-decorator'

type ValueType = number|number[]|string|string[]
type FactoryFunc = () => object
@Component({
  name: 'ModelFieldValuesSelect'
})
export default class extends Vue {
  @Prop({ required: true }) readonly modelClassPath!: string
  @Prop({ required: true }) readonly modelFieldPath!: string
  @Prop({ default: '' }) readonly value!: ValueType
  @Prop({ default: false }) readonly multiple!: boolean
  @Prop({ default: false }) readonly allowCreate!: boolean
  @Prop({ default: () => ({}) }) readonly selectStyle!: FactoryFunc

  private loading = false
  private items: ValueType[] = []

  created() {
    let q = this.value as string
    if (Array.isArray(this.value)) {
      q = this.value.join(',')
    }
    this.doFetchItems(q)
  }

  fetchItems = _.debounce(this.doFetchItems, 300)

  doFetchItems(q: string) {
    this.loading = true
    const params = {
      model_class_path: this.modelClassPath,
      model_field_path: this.modelFieldPath,
      value: q,
      page_size: 20
    }
    return request.get<ListResponse<ValueType>>('/fev1/common/model-field-values/', {
      params
    }).then(({ data }) => {
      this.items = data.results
    }).catch((err: any) => {
      console.error(err)
      this.$notify.error('操作失败')
    }).finally(() => {
      this.loading = false
    })
  }

  onChange(selectedValue: ValueType) {
    this.$emit('update', selectedValue)
  }
}
</script>
