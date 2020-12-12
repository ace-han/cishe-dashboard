<template>
  <div class="app-container">
    <el-card class="filter-container">
      <div
        slot="header"
        class="clearfix"
      >
        <div style="float: left; margin-top: .5em;">
          <i class="el-icon-search" /> 查询条件
        </div>
        <div style="float: right;">
          <el-button
            type="primary"
            size="medium"
            :disabled="dataLoading"
            @click="fetchData"
          >
            查询
          </el-button>
        </div>
      </div>
      <el-form
        inline
        :model="queryParams"
        :disabled="dataLoading"
      >
        <el-row>
          <el-form-item label="学生名字">
            <model-select
              v-model="queryParams.customer__name__in"
              url="/fev1/contract/customers/"
              multiple
              :params="{fields: 'id,name,phone_num'}"
              :format-item="(item) => ({
                value: item.name,
                label: `${item.name} (${item.phone_num})`,
                object: item
              })"
              :init-func="fetchCustomersByName"
            />
          </el-form-item>
          <el-form-item label="申请季">
            <model-field-values-select
              v-model="queryParams.serviceinfo__enrollment_semester__in"
              model-class-path="cishe.contract.models.ServiceInfo"
              model-field-path="enrollment_semester"
              allow-create
              multiple
            />
          </el-form-item>
          <el-form-item label="申请国家">
            <model-field-values-select
              v-model="queryParams.serviceinfo__target_country_code__oricontains"
              model-class-path="cishe.contract.models.ServiceInfo"
              model-field-path="target_country_code"
              allow-create
              multiple
              :format-items="formCSVItems"
            />
          </el-form-item>
          <el-form-item label="申请专业">
            <model-field-values-select
              v-model="queryParams.serviceinfo__target_major__oricontains"
              model-class-path="cishe.contract.models.ServiceInfo"
              model-field-path="target_major"
              allow-create
              multiple
              :format-items="formCSVItems"
            />
          </el-form-item>
          <el-form-item label="咨询师">
            <model-select
              v-model="queryParams.last_counselor__username__in"
              url="/fev1/account/users/"
              multiple
              :params="{fields: 'id,username,first_name,last_name'}"
              :format-item="(item) => ({
                value: item.username,
                label: `${item.first_name} ${item.last_name} (${item.username})`,
                object: item
              })"
              :init-func="fetchCounselorsByUsername"
            />
          </el-form-item>

          <el-form-item label="策划期">
            <el-date-picker
              v-model="queryParams.probation_until__range"
              type="daterange"
              clearable
              start-placeholder="From"
              end-placeholder="To"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="签约日期">
            <el-date-picker
              v-model="queryParams.signing_date__range"
              type="daterange"
              clearable
              start-placeholder="From"
              end-placeholder="To"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <div
        slot="header"
        class="clearfix"
      >
        <router-link
          :to="{
            path: '/contract/contracts/create'
          }"
        >
          <el-button
            type="success"
            icon="el-icon-plus"
          />
        </router-link>
        <el-button
          style="margin-left: 10px;"
          type="danger"
          icon="el-icon-delete"
          :disabled="isEmptyItemSelection"
          @click="onSelectedDeletion"
        />
        <el-tooltip content="Export Selected">
          <el-button
            title="Export selected"
            :disabled="isEmptyItemSelection"
            @click="onSelectedExport"
          >
            <svg-icon name="excel" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="Export All">
          <el-button
            title="Export all"
            icon="el-icon-download"
            @click="onAllExport"
          />
        </el-tooltip>
        <el-form
          inline
          style="float:right"
        >
          <el-form-item label="列选择">
            <el-select
              :value="selectedColumns"
              collapse-tags
              filterable
              multiple
              placeholder="Select columns to show"
              @change="onColumnsChange"
            >
              <el-option
                v-for="item in columnOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="dataLoading"
        border
        fit
        stripe
        :data="dataItems"
        @selection-change="onSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['id'].selected"
          property="id"
          label="ID"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['contract_num'].selected"
          property="contract_num"
          label="合同编号"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['cutomer.name'].selected"
          label="学生名字"
        >
          <template slot-scope="{row}">
            <el-link
              type="info"
              :href="`/#/contract/customers?name__icontains=${ row.customer.name }}`"
              target="_blank"
            >
              {{ row.customer.name }} ({{ row.customer.phone_num }})
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          v-if="colKeyOptionInfoMap['serviceinfo.enrollment_semester'].selected"
          property="serviceinfo.enrollment_semester"
          label="申请季"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['serviceinfo.target_country_code'].selected"
          label="申请国家"
        >
          <template slot="header">
            <el-tooltip
              placement="top"
            >
              <div slot="content">
                国家代码 (ISO 3166-1)<br><br>
                美国:  US<br>
                英国: UK<br>
                香港: HK<br>
                新加坡: SG<br>
                澳大利亚: AU<br>
                法国: FR<br>
                德国: DE<br>
              </div>
              <el-link
                href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2"
                icon="el-icon-info"
                target="_blank"
              >
                申请国家
              </el-link>
            </el-tooltip>
          </template>
          <template slot-scope="{row}">
            <span>{{ row.serviceinfo.target_country_code }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="colKeyOptionInfoMap['serviceinfo.target_major'].selected"
          label="申请专业"
        >
          <template slot-scope="{row}">
            <span>{{ row.serviceinfo.target_major }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="colKeyOptionInfoMap['takeovers'].selected"
          label="咨询师"
        >
          <template slot-scope="{row}">
            <el-tooltip
              v-if="row.takeovers.length>1"
              placement="top"
              effect="light"
            >
              <div slot="content">
                <el-table
                  border
                  fit
                  stripe
                  :data="row.takeovers.slice(1)"
                >
                  <el-table-column
                    property="id"
                    label="ID"
                  />
                  <el-table-column
                    label="咨询师"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.counselor.first_name }} {{ scope.row.counselor.last_name }} ({{ scope.row.counselor.username }})
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="交接日期"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.transfer_date | parseMoment('YYYY-MM-DD') }}
                    </template>
                  </el-table-column>

                  <el-table-column
                    property="remark"
                    label="备注"
                  />
                </el-table>
              </div>
              <i class="el-icon-info">
                {{ row.takeovers[0].counselor.first_name }} {{ row.takeovers[0].counselor.last_name }} ({{ row.takeovers[0].counselor.username }})
              </i>
            </el-tooltip>
            <span v-else>{{ row.takeovers[0].counselor.first_name }} {{ row.takeovers[0].counselor.last_name }} ({{ row.takeovers[0].counselor.username }})</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="colKeyOptionInfoMap['probation_until'].selected"
          label="策划期"
        >
          <template slot-scope="{row}">
            <span>{{ row.probation_until | parseMoment('YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="colKeyOptionInfoMap['signing_date'].selected"
          property="signing_date"
          label="签约日期"
        >
          <template slot-scope="{row}">
            <span>{{ row.signing_date | parseMoment('YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
        <!--
          v-show doesnot work
          <el-table-column
            v-show="false"
            property="total_amount"
            label="签约价格"
          />
        -->
        <el-table-column
          v-if="colKeyOptionInfoMap['total_amount'].selected"
          property="total_amount"
          label="签约价格"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['contract_type'].selected"
          property="contract_type"
          label="合同类型"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['source'].selected"
          property="source"
          label="客户来源"
        />

        <el-table-column
          v-if="colKeyOptionInfoMap['signing_branch'].selected"
          property="signing_branch"
          label="签约分公司"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['sale_agent.username'].selected"
          label="签约人员"
        >
          <template slot-scope="{row}">
            <el-link
              type="info"
              :href="`/#/organization/members?search=${ row.sale_agent.username }}`"
              target="_blank"
            >
              {{ row.sale_agent.first_name }} {{ row.sale_agent.last_name }} ({{ row.sale_agent.username }})
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          v-if="colKeyOptionInfoMap['referrer'].selected"
          property="referrer"
          label="介绍人"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['supplementary_agreement'].selected"
          property="supplementary_agreement"
          label="附加协议"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['supplementary_agreement'].selected"
          property="supplementary_agreement"
          label="附加协议"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['serviceinfo.id'].selected"
          property="serviceinfo.id"
          label="服务项目ID"
        />

        <el-table-column
          v-if="colKeyOptionInfoMap['serviceinfo.retention_statement'].selected"
          property="serviceinfo.retention_statement"
          label="延期描述"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['serviceinfo.target_subject'].selected"
          property="serviceinfo.target_subject"
          label="合同科目"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['serviceinfo.target_degree'].selected"
          property="serviceinfo.target_degree"
          label="申请学位"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['serviceinfo.team'].selected"
          property="serviceinfo.team"
          label="项目组"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['serviceinfo.workload'].selected"
          property="serviceinfo.workload"
          label="工作量"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['serviceinfo.status'].selected"
          property="serviceinfo.status"
          label="项目状态"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['serviceinfo.start_date'].selected"
          property="serviceinfo.start_date"
          label="启动日期"
        >
          <template slot-scope="{row}">
            <span>{{ row.start_date | parseMoment('YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="colKeyOptionInfoMap['serviceinfo.remark'].selected"
          property="serviceinfo.remark"
          label="备注"
        />
        <el-table-column
          align="center"
          label="操作"
          fixed="right"
        >
          <template slot-scope="{row}">
            <el-button
              size="small"
              icon="el-icon-edit"
              @click="onItemEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              icon="el-icon-user"
              @click="onItemTransfer(row)"
            >
              交接
            </el-button>
            <el-button
              size="small"
              icon="el-icon-document-copy"
              @click="onItemCopy(row)"
            >
              复制
            </el-button>
            <el-button
              size="small"
              icon="el-icon-delete"
              @click="onItemDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="!dataLoading"
        :total="pager.total"
        :page.sync="pager.page"
        :limit.sync="pager.pageSize"
        @pagination="fetchData"
      />
    </el-card>
    <el-dialog
      title="交接"
      :visible.sync="formDialogVisible"
      width="60%"
    >
      <el-form
        ref="form"
        label-width="120px"
        :model="form"
        :rules="rules"
      >
        <el-form-item
          label="合同编号"
        >
          <el-input
            v-model="form.contract_num"
            type="text"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="咨询师"
          prop="counselor"
        >
          <model-select
            v-model="form.counselor"
            :select-style="{width: '100%'}"
            url="/fev1/account/users/"
            :params="{fields: 'id,username,first_name,last_name'}"
            :format-item="(item) => ({
              value: item.id,
              label: `${item.first_name} ${item.last_name} (${item.username})`,
              object: item
            })"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="form.remark"
            clearable
            placeholder="备注内容"
            type="textarea"
            :autosize="{minRows: 3, maxRows: 6}"
          />
        </el-form-item>
        <el-form-item
          prop="contract"
        >
          <el-input
            v-model="form.contract"
            type="hidden"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import moment from 'moment'
import { Component, Mixins } from 'vue-property-decorator'
import { deleteContracts, getContracts } from '@/api/contracts'
import { IContractDataWithDetail, ICustomerData, IUserData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import FetchDataMixin from '@/views/mixins/list-search'
import { Dictionary } from 'vue-router/types/router'
import { getUsers } from '@/api/users'
import { ElForm } from 'element-ui/types/form'
import { TransferData } from 'element-ui/types/transfer'
import { getCustomers } from '@/api/customers'
import ModelFieldValuesSelect from '@/components/ModelFieldValuesSelect/index.vue'
import ModelSelect from '@/components/ModelSelect/index.vue'
import { createTakeOver } from '@/api/takeovers'

@Component({
  components: {
    Pagination,
    ModelFieldValuesSelect,
    ModelSelect
  }
})
class ContractList extends Mixins<FetchDataMixin<IContractDataWithDetail>>(FetchDataMixin) {
  protected watchRouteQueryChange = true
  protected queryParams: Dictionary<any> = {
    customer__name__in: [] as string[],
    serviceinfo__enrollment_semester__in: [] as string[],
    serviceinfo__target_country_code__oricontains: [] as string[],
    serviceinfo__target_major__oricontains: [] as string[],
    last_counselor__username__in: [] as string[],
    signing_date__range: [] as string[],
    probation_until__range: [] as string[],
    selectedCols: ''
  }

  private formDialogVisible = false
  private form = {
    contract_num: '',
    contract: 0,
    counselor: 0 || '',
    remark: ''
  }

  private rules = {
    contract: [
      { type: 'number', required: true, trigger: 'blur' },
      { type: 'number', min: 1, message: 'should greater than 0', trigger: 'input' }
    ],
    counselor: [
      {
        validator: (rule: Dictionary<any>, value: string | number) => {
          const errors = []
          if (!value) {
            errors.push(new Error('counselor is required'))
          }
          if (isNaN((value as number))) {
            errors.push(new Error('counselor is not a number'))
          }

          // do not follow async-validator doc, trust debugging
          // return errors
          // callback(errors)
          if (errors.length) {
            return Promise.reject(errors)
          } else {
            return Promise.resolve()
          }
        },
        trigger: 'blur'
      }
    ],
    remark: [
      { max: 2000, message: '最大长度2000字符', trigger: 'change' }
    ]
  }

  private formUsers: IUserData[] = []
  private formUsersLoading = false

  private colKeyOptionInfoMap: {
    [key: string]: {
      label: string
      selected: boolean
  }} = {
    id: {
      label: 'ID',
      selected: false
    },
    contract_num: {
      label: '合同编号',
      selected: true
    },
    'cutomer.name': {
      label: '学生姓名',
      selected: true
    },
    'serviceinfo.enrollment_semester': {
      label: '申请季',
      selected: true
    },
    'serviceinfo.target_country_code': {
      label: '申请国家',
      selected: true
    },
    'serviceinfo.target_major': {
      label: '申请专业',
      selected: true
    },
    takeovers: {
      label: '咨询师',
      selected: true
    },
    probation_until: {
      label: '策划期',
      selected: true
    },
    signing_date: {
      label: '签约日期',
      selected: true
    },
    total_amount: {
      label: '签约价格',
      selected: true
    },
    contract_type: {
      label: '合同类型',
      selected: false
    },
    source: {
      label: '客户来源',
      selected: false
    },

    signing_branch: {
      label: '签约分公司',
      selected: false
    },
    'sale_agent.username': {
      label: '签约人',
      selected: false
    },
    referrer: {
      label: '介绍人',
      selected: false
    },
    supplementary_agreement: {
      label: '附加协议',
      selected: false
    },
    'serviceinfo.id': {
      label: '服务项目ID',
      selected: false
    },

    'serviceinfo.retention_statement': {
      label: '延期描述',
      selected: false
    },
    'serviceinfo.target_subject': {
      label: '申请科目',
      selected: false
    },
    'serviceinfo.target_degree': {
      label: '申请学位',
      selected: false
    },
    'serviceinfo.team': {
      label: '项目组',
      selected: false
    },
    'serviceinfo.workload': {
      label: '工作量',
      selected: false
    },
    'serviceinfo.status': {
      label: '项目状态',
      selected: false
    },
    'serviceinfo.start_date': {
      label: '启动日期',
      selected: false
    },
    'serviceinfo.remark': {
      label: '备注',
      selected: false
    }
  }

  get selectedColumns(): string[] {
    const result = []
    for (const [key, columnInfo] of Object.entries(this.colKeyOptionInfoMap)) {
      if (columnInfo.selected) {
        result.push(key)
      }
    }
    return result
  }

  get columnOptions(): Dictionary<string>[] {
    const result = []
    for (const [key, columnInfo] of Object.entries(this.colKeyOptionInfoMap)) {
      result.push({
        value: key,
        label: columnInfo.label
      })
    }
    return result
  }

  private get userOptions(): TransferData[] {
    const result = [] as TransferData[]
    for (const u of this.formUsers) {
      result.push({
        key: u.id,
        label: `${u.first_name} ${u.last_name} (${u.username}) ${u.is_active ? '' : '(resigned)'}`,
        disabled: !u.is_active
      })
    }
    return result
  }

  mounted() {
    // col display analysing
    if (this.$route.query.selectedCols) {
      const selectedCols = (this.$route.query.selectedCols as string).split(',')
      for (const columnInfo of Object.values(this.colKeyOptionInfoMap)) {
        columnInfo.selected = false
      }
      for (const colKey of selectedCols) {
        this.colKeyOptionInfoMap[colKey].selected = true
      }
    }
  }

  private fetchUsers = _.debounce(this.doFetchUsers, 300)

  protected doPrepareFetchParams(): Dictionary<any> {
    const result: Dictionary<any> = {
      ...this.queryParams,
      expand: 'customer,sale_agent,serviceinfo,takeovers.counselor',
      ordering: '-id'
    }
    delete result.selectedCols
    const commanSepFields = [
      'customer__name__in',
      'serviceinfo__enrollment_semester__in',
      'serviceinfo__target_country_code__oricontains',
      'serviceinfo__target_major__oricontains',
      'last_counselor__username__in'
    ]
    for (const field of commanSepFields) {
      result[field] = this.queryParams[field].join(',')
    }
    const dateRangeFields = [
      'signing_date__range',
      'probation_until__range'
    ]
    for (const field of dateRangeFields) {
      const dateRange = this.queryParams[field]
      if (dateRange && dateRange.length) {
        result[field] = [
          moment(dateRange[0]).utc().format(),
          moment(dateRange[1]).utc().format()
        ].join(',')
      }
    }

    return result
  }

  protected async doFetchData(queryParams: Dictionary<any>) {
    return getContracts(queryParams)
  }

  onSelectedDeletion() {
    if (this.isEmptyItemSelection) {
      this.$notify.warning('请先选择')
      return
    }
    this.deleteItems(this.selectedDataItems)
  }

  onItemEdit(item: IContractDataWithDetail) {
    this.$router.push({
      name: 'ContractContractEdit',
      params: {
        id: item.id + ''
      }
    })
  }

  onItemDelete(item: IContractDataWithDetail) {
    this.deleteItems([item])
  }

  deleteItems(items: IContractDataWithDetail[]) {
    const content = ['确认删除以下吗?']
    const selected = [] as number[]
    for (const item of items) {
      selected.push(item.id || 0)
      content.push(`${item.contract_num}(${item.id})`)
    }

    this.$confirm(content.join('<br/>'), '确认', {
      dangerouslyUseHTMLString: true,
      type: 'warning'
    }).then(() => {
      // confirmed
      const params = {
        id__in: selected.join(',')
      }
      const loading = this.$loading({
        lock: true
      })
      deleteContracts(params).then(() => {
        this.$notify.success('操作成功')
        this.search()
      }).catch((err: any) => {
        console.error(err)
        this.$notify.error('操作失败')
      }).finally(() => {
        loading.close()
      })
    }).catch(() => {
      this.$message('操作取消')
    })
  }

  submit() {
  // we need to wait a little bit to get all changes in form committed
    setTimeout(() => {
      this.fetchData()
    }, 10)
  }

  doFetchUsers(term: string) {
    this.formUsersLoading = true
    return getUsers({
      search: term,
      page_size: 999999
    }).then(({ data }) => {
      this.formUsers = data.results
      return data.results
    }).finally(() => {
      this.formUsersLoading = false
    })
  }

  filterMethod(term: string, item: TransferData) {
    return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1
  }

  onColumnsChange(selectedColKeys: string[]) {
    for (const optionInfo of Object.values(this.colKeyOptionInfoMap)) {
      optionInfo.selected = false
    }
    for (const selectedColKey of selectedColKeys) {
      this.colKeyOptionInfoMap[selectedColKey].selected = true
    }
    this.queryParams.selectedCols = selectedColKeys.join(',')
  }

  onSelectedExport() {
    console.info('onSelectedExport, items: ', this.selectedDataItems)
  }

  onAllExport() {
    console.info('onAllExport')
  }

  fetchCounselorsByUsername(q: string): Promise<any[]> {
    const result = new Promise<any[]>((resolve, reject) => {
      getUsers({
        username__in: q,
        page_size: 20,
        fields: 'id,username,first_name,last_name'
      }).then(({ data }) => {
        resolve(data.results)
      }).catch((err: any) => {
        reject(err)
        this.$notify.error('获取咨询师失败')
      })
    })
    return result
  }

  fetchCustomersByName(q: string): Promise<ICustomerData[]> {
    const result = new Promise<ICustomerData[]>((resolve, reject) => {
      getCustomers({
        name__in: q,
        page_size: 20,
        fields: 'id,name,phone_num'
      }).then(({ data }) => {
        resolve(data.results)
      }).catch((err: any) => {
        reject(err)
        this.$notify.error('获取学生失败')
      })
    })
    return result
  }

  formCSVItems(items: string[]) : string[] {
    const result: string[] = []
    for (const item of items) {
      for (const v of item.split(',')) {
        if (result.includes(v)) {
          continue
        }
        result.push(v)
      }
    }
    return result
  }

  onItemCopy(item: IContractDataWithDetail) {
    this.$router.push({
      name: 'ContractContractCreate',
      query: { copy: item.id + '' }
    })
  }

  onItemTransfer(item: IContractDataWithDetail) {
    this.form = {
      contract_num: item.contract_num,
      contract: item.id || 0,
      counselor: 0 || '',
      remark: ''
    }
    this.formDialogVisible = true
  }

  submitForm() {
    (this.$refs.form as ElForm).validate((valid: boolean) => {
      if (valid) {
        const params: Dictionary<any> = {
          ...this.form,
          transfer_date: moment.utc().format()
        }
        delete params.contract_num
        const loading = this.$loading({
          lock: true
        })
        createTakeOver(params).then(() => {
          this.$notify.success('操作成功')
          this.fetchData()
          this.formDialogVisible = false
        }).catch((err: any) => {
          console.error(err)
          this.$notify.error('操作失败')
        }).finally(() => {
          loading.close()
        })
      } else {
        this.$notify.warning('请正确填写表格')
        return false
      }
    })
  }
}

export default ContractList
</script>
