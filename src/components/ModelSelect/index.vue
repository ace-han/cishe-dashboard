<template>
  <el-select
    :value="value"
    clearable
    filterable
    remote
    reserve-keyword
    placeholder="模糊匹配，一次返回20个"
    :loading="loading"
    :multiple="multiple"
    :remote-method="getItems"
    :style="selectStyle"
    @change="onChange"
  >
    <el-option
      v-for="item in items"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    />
  </el-select>
</template>

<script lang="ts">
import _ from 'lodash'
import request from '@/utils/request'
import { ListResponse } from '@/api/types'
import { Component, Prop, Vue } from 'vue-property-decorator'

interface SelectOption {
  value: any
  label: string
  object?: any
}
type ValueType = number | number[] | string | string[]

@Component({
  name: 'ModelSelect'
})
export default class ModelSelect extends Vue {
  private loading = false
  private items: SelectOption[] = []

  @Prop({ required: true }) readonly url!: string
  @Prop({ default: () => ({}) }) readonly params!: {[key: string]: any}
  @Prop({ default: '' }) readonly value!: ValueType
  @Prop({ default: '模糊匹配' }) readonly placeholder!: string
  @Prop({ default: false }) readonly multiple!: boolean
  @Prop({ default: () => ({}) }) readonly selectStyle!: () => CSSStyleDeclaration
  @Prop({
    default: () => (item: any): SelectOption => {
      // do nothing just direct return
      return item as SelectOption
    }
  })
  readonly formatItem!: (item: any) => SelectOption

  @Prop({
    default(this: ModelSelect) {
      return (q: string): Promise<any[]> => {
        const result = new Promise<any[]>((resolve, reject) => {
          this.loading = true
          // this is request.get<T,R> should be used with response interceptor
          // return request.get<ListResponse<any>, Promise<any[]>>(this.url, {
          request.get<ListResponse<any>>(this.url, {
            params: {
              ...this.params,
              search: q || '',
              page_size: 20
            }
          }).then(({ data }) => {
            resolve(data.results)
          }).catch((err: any) => {
            reject(err)
            this.$notify.error('获取数据失败')
          }).finally(() => {
            this.loading = false
          })
        })
        return result
      }
    }
  })
  readonly fetchItems!: (q: string) => Promise<any[]>

  @Prop({
    default(this: ModelSelect) {
      return this.fetchItems
    }
  })
  readonly initFunc!: (q: string) => Promise<any[]>

  mounted() {
    let q = this.value as string
    if (!q) {
      this.$emit('input', '')
    }
    if (Array.isArray(this.value)) {
      q = this.value.join(',')
    }
    this.initFunc(q).then((items) => {
      this.items.length = 0
      for (const item of items) {
        this.items.push(
          this.formatItem(item)
        )
      }
    })
  }

  doFetchItems(q: string): void {
    this.fetchItems(q).then((items) => {
      this.items.length = 0
      for (const item of items) {
        this.items.push(
          this.formatItem(item)
        )
      }
    })
  }

  getItems = _.debounce(this.doFetchItems, 300)

  onChange(selectedValue: ValueType) {
    this.$emit('input', selectedValue)
  }
}
</script>
