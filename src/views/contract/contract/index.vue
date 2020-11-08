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
        <el-button
          type="success"
          icon="el-icon-plus"
          @click="onCreation"
        />
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="isEmptyItemSelection"
          @click="onSelectedDeletion"
        />
        <el-dropdown
          style="float:right"
          split-button
          :hide-on-click="false"
          @command="toggleColumn"
        >
          列选择
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">
              Action 1
            </el-dropdown-item>
            <el-dropdown-item command="b">
              Action 2
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
            <el-dropdown-item command="c">
              Action 3
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
          property="id"
          label="ID"
        />
        <el-table-column
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
          label="申请国家"
        >
          <template slot-scope="{row}">
            <span>{{ row.serviceinfo.target_country_code }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="申请专业"
        >
          <template slot-scope="{row}">
            <span>{{ row.serviceinfo.target_major }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="策划期"
        >
          <template slot-scope="{row}">
            <span>{{ row.probation_until | parseMoment }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="签约人员"
        >
          <template slot-scope="{row}">
            <el-link
              type="info"
              :href="`/#/organization/members?search=${ row.sale_agent.name }}`"
              target="_blank"
            >
              {{ row.sale_agent.name }} ({{ row.sale_agent.id }})
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
          v-show="false"
          property="total_amount"
          label="签约价格"
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

  private colKeySelectionMap = {
    id: {
      label: 'ID',
      selected: true
    },
    'cutomer.id': {
      label: '学生ID',
      selected: false
    },
    'cutomer.name': {
      label: '学生ID',
      selected: true
    },
    'serviceinfo.target_country_code': {
      label: '学生ID',
      selected: false
    }

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

  onCreation() {
    this.form = {
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
    this.formDialogVisible = true
    this.fetchUsers('')
  }

  onSelectedDeletion() {
    if (this.isEmptyItemSelection) {
      this.$notify.warning('请先选择')
      return
    }
    this.deleteItems(this.selectedDataItems)
  }

  onItemEdit(item: IContractDataWithDetail) {
    this.form = {
      ...item,
      title: '编辑',
      id: item.id || 0
    }
    this.formDialogVisible = true
    this.fetchUsers('')
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

  toggleColumn(command: string) {
    this.$message('toggleColumn item ' + command)
  }
}

export default ContractList
</script>
