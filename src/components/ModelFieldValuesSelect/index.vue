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

@Component({
  name: 'ModelFieldValuesSelect'
})
export default class extends Vue {
  @Prop({ required: true }) readonly modelClassPath!: string
  @Prop({ required: true }) readonly modelFieldPath!: string
  @Prop({ default: '' }) readonly value!: ValueType
  @Prop({ default: false }) readonly multiple!: boolean
  @Prop({ default: false }) readonly allowCreate!: boolean
  @Prop({ default: () => ({}) }) readonly selectStyle!: () => CSSStyleDeclaration

  private loading = false
  private items: ValueType[] = []

  mounted() {
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

    // this would change the response structure, only interceptor will do
    // this request.get<T,R>(...), just for using interceptors that will change the return type in `Promise.then`
    // return request.get<ListResponse<ValueType>, ValueType[]>('/fev1/common/model-field-values/', {
    //   params
    //   // transformResponse: [
    //   //   (request.defaults.transformResponse as AxiosTransformer[])[0],
    //   //   (data) => {
    //   //   // will run before interceptors
    //   //   // at this time, `data` is stringified json string
    //   //     console.info('ModelFieldValueSelect.doFetchItems.tranformResponse', data)
    //   //     return data.results
    //   //   }
    //   // ]
    // }).then((data) => {
    // // }).then(({ data }) => {
    //   console.info('data', data)
    //   this.items = data
    // })

    return request.get<ListResponse<ValueType>>('/fev1/common/model-field-values/', {
      params
    }).then(({ data }) => {
      console.debug('results', data)
      this.items = data.results
    }).catch((err: any) => {
      console.error(err)
      this.$notify.error('操作失败')
    }).finally(() => {
      this.loading = false
    })
  }

  onChange(selectedValue: ValueType) {
    this.$emit('input', selectedValue)
  }
}
</script>
