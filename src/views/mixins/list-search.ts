
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Dictionary } from 'vue-router/types/router'
import qs from 'qs'

interface IFetchData<T> {
  data: {
    count: number
    results: T[]
  }
}

@Component
export default class FetchDataMixin<T> extends Vue {
  protected watchRouteQueryChange = false
  protected dataLoading = false
  protected dataItems: T[] = []
  protected selectedDataItems: T[] = []
  protected booleanQsFields: string[] = []
  protected numericQsFields: string[] = []

  protected queryParams: Dictionary<any> = {}
  protected pager = {
    total: 0,
    page: 1,
    pageSize: 20
  }

  protected get isRouteQueryChange(): boolean {
    const queryParams = {
      ...this.queryParams,
      page: this.pager.page,
      pageSize: this.pager.pageSize
    }
    const { query } = this.$route
    const result = qs.stringify(query, { arrayFormat: 'comma' }) !== qs.stringify(queryParams, { arrayFormat: 'comma' })
    return result
  }

  protected get isEmptyItemSelection(): boolean {
    return !this.selectedDataItems.length
  }

  @Watch('$route')
  protected onRouteQueryChange(): void {
    // we need to define this watch function to listen to url change directly
    console.info('onRouteChange====')
    if (this.watchRouteQueryChange && this.isRouteQueryChange) {
    // we need `this.isRouteQueryChange` to avoid double trigger from `fetchData`
    // if (this.watchRouteQueryChange) {
      console.info('directly change from url =========')
      this.queryParams = this.normalizeRouteQuery()
      this.fetchData()
    }
  }

  created() {
    console.info('created========')
    this.queryParams = this.normalizeRouteQuery()
    this.fetchData()
  }

  protected normalizeRouteQuery() {
    const params = this.$route.query
    const result: Dictionary<any> = {
      // avoid queryParams default values not get along
      ...this.queryParams
    }
    for (const [k, v] of Object.entries(params)) {
      if (!v) {
        // don't do anything
        continue
      }
      if (k === 'page') {
        this.pager.page = parseInt(v as string)
        continue
      }
      if (k === 'pageSize') {
        this.pager.pageSize = parseInt(v as string)
        continue
      }
      // if (['page', 'pageSize'].includes(k)) {
      //   // these two do not go to normalizeQueryParamValue
      //   // this.pager[k as 'page'|'pageSize'] = parseInt(v as string)
      //   this.pager[k] = parseInt(v as string)
      //   continue
      // }
      if (Array.isArray(this.queryParams[k])) {
        const values = Array.isArray(v) ? v : [v]
        result[k] = []
        for (const value of values) {
          result[k].push(
            this.normalizeQueryParamValue(k, value as string)
          )
        }
      } else if (Array.isArray(v) && !v.length) {
        // sometimes this.$route.query is {k1: [...], k2: [...]}
        continue
      } else {
        result[k] = this.normalizeQueryParamValue(k, v as string)
      }
    }
    return result
  }

  protected normalizeQueryParamValue(field: string, value: string) {
    let result
    if (this.booleanQsFields.includes(field)) {
      result = ['true', '1', 'on'].includes((value + '').toLowerCase())
    } else if (this.numericQsFields.includes(field)) {
      result = Number(value)
    } else {
      result = value
    }
    return result
  }

  onSelectionChange(rows: T[]) {
    this.selectedDataItems = rows
  }

  protected prepareFetchParams(): Dictionary<any> {
    // please override this method as you wish
    const queryParams = this.doPrepareFetchParams()
    const result = {
      ...queryParams,
      page: this.pager.page,
      page_size: this.pager.pageSize
    }
    return result
  }

  protected doPrepareFetchParams(): Dictionary<any> {
    // please override this method as you wish
    return this.queryParams
  }

  protected refreshRoute(): void {
    // just need to compare with the `this.$route.query`
    // if not the same then `this.$router.push`, otherwise don't
    const queryParams = {
      ...this.queryParams,
      page: this.pager.page,
      pageSize: this.pager.pageSize
    }
    const { path } = this.$route
    if (this.isRouteQueryChange) {
      this.$router.push({
        path,
        query: queryParams as Dictionary<any>
      })
    }
  }

  protected async fetchData() {
    this.dataLoading = true
    const queryParams = this.prepareFetchParams()
    if (this.watchRouteQueryChange) {
      this.refreshRoute()
    }
    return this.doFetchData(queryParams).then(({ data: { count, results } }) => {
      this.pager.total = count as number
      this.dataItems = results as T[]
    }).finally(() => {
      this.dataLoading = false
    })
  }

  protected async doFetchData(queryParams: Dictionary<any>): Promise<IFetchData<T>> {
    // please override this method as you wish
    // x = 1 just to avoid typescript warning
    queryParams.x = 1
    return Promise.resolve({ data: { count: 0, results: [] } })
  }

  protected async search() {
    this.pager.page = 1
    return this.fetchData()
  }
}
