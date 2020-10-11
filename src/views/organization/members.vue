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
          <el-form-item label="组名">
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
          property="name"
          label="组名"
        />

        <el-table-column
          label="成员数"
        >
          <template slot-scope="{row}">
            <span>{{ row.users.length }}</span>
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
import { createGroup, deleteGroups, getGroups, partialUpdateGroup } from '@/api/groups'
import { IGroupWithUserData, IUserData } from '@/api/types'
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
class GroupList extends Mixins<FetchDataMixin<IGroupWithUserData>>(FetchDataMixin) {
  protected watchRouteQueryChange = true
  protected queryParams: Dictionary<any> = {
    name__icontains: ''
  }

  private formDialogVisible = false
  private form = {
    title: '创建',
    id: 0,
    name: '',
    users: [] as number[]
  }

  private rules = {
    name: [
      { required: true, trigger: 'blur' },
      { min: 1, max: 150, message: '最大长度150字符', trigger: 'change' }
    ]
  }

  private formUsers: IUserData[] = []
  private formUsersLoading = false

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
    return getGroups(queryParams)
  }

  onCreation() {
    this.form = {
      title: '创建',
      id: 0,
      name: '',
      users: [] as number[]
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

  onItemEdit(item: IGroupWithUserData) {
    const users = []
    for (const u of item.users) {
      users.push(u.id || 0)
    }
    this.form = {
      title: '编辑',
      id: item.id || 0,
      name: item.name,
      users
    }
    this.formDialogVisible = true
    this.fetchUsers('')
  }

  onItemDelete(item: IGroupWithUserData) {
    this.deleteItems([item])
  }

  deleteItems(items: IGroupWithUserData[]) {
    const content = ['确认删除以下吗?']
    const selected = [] as number[]
    for (const item of items) {
      selected.push(item.id || 0)
      content.push(`${item.name}(${item.id})`)
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
      deleteGroups(params).then(() => {
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
          promise = partialUpdateGroup(params.id, params)
        } else {
          // create
          promise = createGroup(params)
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

export default GroupList
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
