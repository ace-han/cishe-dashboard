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
            <el-input
              v-model="queryParams.name__icontains"
              clearable
              placeholder="模糊匹配"
              @keyup.enter.native="submit"
            />
          </el-form-item>
          <el-form-item label="申请国家">
            <el-input
              v-model="queryParams.name__icontains"
              clearable
              placeholder="模糊匹配"
              @keyup.enter.native="submit"
            />
          </el-form-item>
          <el-form-item label="申请专业">
            <el-input
              v-model="queryParams.name__icontains"
              clearable
              placeholder="模糊匹配"
              @keyup.enter.native="submit"
            />
          </el-form-item>
          <el-form-item label="策划期">
            <el-input
              v-model="queryParams.name__icontains"
              clearable
              placeholder="模糊匹配"
              @keyup.enter.native="submit"
            />
          </el-form-item>
          <el-form-item label="签约人员">
            <el-input
              v-model="queryParams.name__icontains"
              clearable
              placeholder="模糊匹配"
              @keyup.enter.native="submit"
            />
          </el-form-item>
          <el-form-item label="合同价格">
            <el-input
              v-model="queryParams.name__icontains"
              clearable
              placeholder="模糊匹配"
              @keyup.enter.native="submit"
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
          v-if="colKeyOptionInfoMap['cutomer.name'].selected"
          label="学生名字"
        >
          <template slot-scope="{row}">
            <el-link
              type="info"
              :href="`/#/contract/customers?name__icontains=${ row.customer.name }}`"
              target="_blank"
            >
              {{ row.customer.name }} ({{ row.customer.id }})
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          v-if="colKeyOptionInfoMap['serviceinfo.target_country_code'].selected"
          label="申请国家"
        >
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
          v-if="colKeyOptionInfoMap['probation_until'].selected"
          label="策划期"
        >
          <template slot-scope="{row}">
            <span>{{ row.probation_until | parseMoment }}</span>
          </template>
        </el-table-column>
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
              {{ row.sale_agent.username }} ({{ row.sale_agent.id }})
            </el-link>
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
          v-if="colKeyOptionInfoMap['contract_num'].selected"
          property="contract_num"
          label="合同编号"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['source'].selected"
          property="source"
          label="客户来源"
        />
        <el-table-column
          v-if="colKeyOptionInfoMap['signing_date'].selected"
          property="signing_date"
          label="签约日期"
        >
          <template slot-scope="{row}">
            <span>{{ row.signing_date | parseMoment('YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="colKeyOptionInfoMap['signing_branch'].selected"
          property="signing_branch"
          label="签约子公司"
        />
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
          v-if="colKeyOptionInfoMap['serviceinfo.enrollment_semester'].selected"
          property="serviceinfo.enrollment_semester"
          label="申请季"
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
      :title="form.title"
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
          label="组名"
          prop="name"
        >
          <el-input
            v-model="form.name"
            type="text"
            placeholder="组名"
            maxlength="150"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="成员"
          prop="usernames"
        >
          <el-transfer
            v-model="form.users"
            v-loading="formUsersLoading"
            filterable
            filter-placeholder="模糊匹配"
            :titles="['Source', 'Target']"
            :filter-method="filterMethod"
            :data="userOptions"
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
import { Component, Mixins } from 'vue-property-decorator'
import { createContract, deleteContracts, getContracts, partialUpdateContract } from '@/api/contracts'
import { IContractDataWithDetail, IUserData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import FetchDataMixin from '@/views/mixins/list-search'
import { Dictionary } from 'vue-router/types/router'
import { getUsers } from '@/api/users'
import { ElForm } from 'element-ui/types/form'
import { TransferData } from 'element-ui/types/transfer'

@Component({
  components: {
    Pagination
  }
})
class ContractList extends Mixins<FetchDataMixin<IContractDataWithDetail>>(FetchDataMixin) {
  protected watchRouteQueryChange = true
  protected queryParams: Dictionary<any> = {
    customer__in: [] as string[]
  }

  private formDialogVisible = false
  private form = {
    title: '创建',
    id: 0,
    contract_num: '',
    contract_type: '',
    source: '',
    signing_date: '',
    signing_branch: '',
    sale_agent: 0,
    probation_until: '',
    total_amount: 0,
    referrer: '',
    supplementary_agreement: ''
  }

  private rules = {
    name: [
      { required: true, trigger: 'blur' },
      { min: 1, max: 150, message: '最大长度150字符', trigger: 'change' }
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
    'cutomer.name': {
      label: '学生姓名',
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
    probation_until: {
      label: '策划期',
      selected: true
    },
    'sale_agent.username': {
      label: '签约人',
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
    contract_num: {
      label: '合同编号',
      selected: false
    },
    source: {
      label: '客户来源',
      selected: false
    },
    signing_date: {
      label: '签约日期',
      selected: false
    },
    signing_branch: {
      label: '签约子公司',
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
    'serviceinfo.enrollment_semester': {
      label: '申请季',
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

  private fetchUsers = _.debounce(this.doFetchUsers, 300)

  protected doPrepareFetchParams(): Dictionary<any> {
    const result = {
      ...this.queryParams,
      expand: 'users',
      ordering: '-id'
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
    console.info('onItemEdit, item: ', item)
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

  submitForm() {
    (this.$refs.form as ElForm).validate((valid: boolean) => {
      if (valid) {
        const params = Object.assign({}, this.form)
        const loading = this.$loading({
          lock: true
        })
        let promise
        if (this.form.id) {
          // put
          promise = partialUpdateContract(params.id, params)
        } else {
          // create
          promise = createContract(params)
        }
        promise.then(() => {
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

  onColumnsChange(selectedColKeys: string[]) {
    for (const optionInfo of Object.values(this.colKeyOptionInfoMap)) {
      optionInfo.selected = false
    }
    for (const selectedColKey of selectedColKeys) {
      this.colKeyOptionInfoMap[selectedColKey].selected = true
    }
  }

  onSelectedExport() {
    console.info('onSelectedExport, items: ', this.selectedDataItems)
  }

  onAllExport() {
    console.info('onAllExport')
  }
}

export default ContractList
</script>
