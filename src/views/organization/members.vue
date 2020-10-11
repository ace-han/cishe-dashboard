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
          <el-form-item label="名字">
            <el-input
              v-model="queryParams.search"
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
          property="username"
          label="登录名"
        />
        <el-table-column
          property="first_name"
          label="名"
        />
        <el-table-column
          property="last_name"
          label="姓"
        />
        <el-table-column
          property="date_joined"
          label="入职时间"
        />
        <el-table-column
          property="last_login"
          label="最后登录"
        />

        <el-table-column
          label="分组"
        >
          <template slot-scope="{row}">
            <span>{{ row.groups.length }}</span>
          </template>
        </el-table-column>

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
            v-model="form.groups__id__in"
            v-loading="formGroupsLoading"
            filterable
            filter-placeholder="模糊匹配"
            :titles="['Source', 'Target']"
            :filter-method="filterMethod"
            :data="groupOptions"
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
import moment from 'moment'
import _ from 'lodash'
import { Component, Mixins } from 'vue-property-decorator'
import { getGroups } from '@/api/groups'
import { IGroupData, IUserWithGroupData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import FetchDataMixin from '@/views/mixins/list-search'
import { Dictionary } from 'vue-router/types/router'
import { createUser, deleteUsers, partialUpdateUser, getUsers } from '@/api/users'
import { ElForm } from 'element-ui/types/form'
import { TransferData } from 'element-ui/types/transfer'

@Component({
  components: {
    Pagination
  }
})
class MemberList extends Mixins<FetchDataMixin<IUserWithGroupData>>(FetchDataMixin) {
  protected watchRouteQueryChange = true
  protected queryParams: Dictionary<any> = {
    search: '',
    groups__id__in: [] as number[],
    is_active: null as boolean | null,
    date_joined__range: [] as moment.Moment[],
    last_login__range: [] as moment.Moment[]
  }

  private formDialogVisible = false
  private form = {
    title: '创建',
    id: 0,
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    is_active: true,
    date_joined: '',
    last_login: '',
    groups: [] as number[]
  }

  private rules = {
    name: [
      { required: true, trigger: 'blur' },
      { min: 1, max: 150, message: '最大长度150字符', trigger: 'change' }
    ]
  }

  private formGroups: IGroupData[] = []
  private formGroupsLoading = false

  private get groupOptions(): TransferData[] {
    const result = [] as TransferData[]
    for (const g of this.formGroups) {
      result.push({
        key: g.id,
        label: `${g.name}(${g.id})`,
        disabled: false
      })
    }
    return result
  }

  private fetchGroups = _.debounce(this.doFetchGroups, 300)

  protected doPrepareFetchParams(): Dictionary<any> {
    const result = {
      ...this.queryParams,
      expand: 'groups',
      omit: 'user_permissions',
      ordering: '-id'
    }
    return result
  }

  protected async doFetchData(queryParams: Dictionary<any>) {
    return getUsers(queryParams)
  }

  onCreation() {
    this.form = {
      title: '创建',
      id: 0,
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      is_active: true,
      date_joined: '',
      last_login: '',
      groups: [] as number[]
    }
    this.formDialogVisible = true
    this.fetchGroups('')
  }

  onSelectedDeletion() {
    if (this.isEmptyItemSelection) {
      this.$notify.warning('请先选择')
      return
    }
    this.deleteItems(this.selectedDataItems)
  }

  onItemEdit(item: IUserWithGroupData) {
    const groups = []
    for (const u of item.groups) {
      groups.push(u.id || 0)
    }
    this.form = {
      title: '编辑',
      id: 0,
      username: item.username,
      first_name: item.first_name,
      last_name: item.last_name,
      email: item.email,
      is_active: item.is_active,
      date_joined: item.date_joined,
      last_login: item.last_login,
      groups
    }
    this.formDialogVisible = true
    this.fetchGroups('')
  }

  onItemDelete(item: IUserWithGroupData) {
    this.deleteItems([item])
  }

  deleteItems(items: IUserWithGroupData[]) {
    const content = ['确认删除以下吗?']
    const selected = [] as number[]
    for (const item of items) {
      selected.push(item.id || 0)
      content.push(`${item.first_name} ${item.last_name} (${item.username})`)
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
      deleteUsers(params).then(() => {
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

  doFetchGroups(term: string) {
    this.formGroupsLoading = true
    return getGroups({
      search: term,
      page_size: 999999
    }).then(({ data }) => {
      this.formGroups = data.results
      return data.results
    }).finally(() => {
      this.formGroupsLoading = false
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
          promise = partialUpdateUser(params.id, params)
        } else {
          // create
          promise = createUser(params)
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
}

export default MemberList
</script>
