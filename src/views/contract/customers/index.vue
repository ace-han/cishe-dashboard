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
          <el-form-item label="姓名">
            <el-input
              v-model="queryParams.name__icontains"
              clearable
              placeholder="模糊匹配"
              @keyup.enter.native="submit"
            />
          </el-form-item>
          <el-form-item label="电话">
            <el-input
              v-model="queryParams.phone_number__icontains"
              clearable
              placeholder="模糊匹配"
              @keyup.enter.native="submit"
            />
          </el-form-item>
          <el-form-item label="大学">
            <el-input
              v-model="queryParams.university__icontains"
              clearable
              placeholder="模糊匹配"
              @keyup.enter.native="submit"
            />
          </el-form-item>
          <el-form-item label="专业">
            <el-input
              v-model="queryParams.major__icontains"
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
          label="姓名"
        />
        <el-table-column
          property="phone_num"
          label="电话"
        />
        <el-table-column
          property="university"
          label="学校"
        />
        <el-table-column
          property="department"
          label="学院"
        />
        <el-table-column
          property="major"
          label="专业"
        />
        <el-table-column
          property="phone_num2"
          label="备用电话"
        />
        <el-table-column
          property="email"
          label="e-Mail"
        />
        <el-table-column
          property="parent_phone_num"
          label="家长电话"
        />
        <el-table-column
          property="parent_type"
          label="家长类型"
        />
        <el-table-column
          align="center"
          label="操作"
          fixed="right"
        >
          <template slot-scope="{row}">
            <el-button
              size="mini"
              icon="el-icon-edit"
              @click="onItemEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
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
    <customer-form
      :visible.sync="formDialogVisible"
      :form="form"
      :dialog-title="formTitle"
      @success="fetchData"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { ICustomerData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import FetchDataMixin from '@/views/mixins/list-search'
import { Dictionary } from 'vue-router/types/router'
import { deleteCustomers, getCustomers } from '@/api/customers'

import CustomerForm from '@/views/contract/customers/form.vue'

@Component({
  components: {
    Pagination,
    CustomerForm
  }
})
class CustomerList extends Mixins<FetchDataMixin<ICustomerData>>(FetchDataMixin) {
  protected watchRouteQueryChange = true
  protected queryParams: Dictionary<any> = {
    name__icontains: '',
    phone_number__icontains: '',
    university__icontains: '',
    major__icontains: ''
  }

  private formDialogVisible = false
  private formTitle = '创建'
  private form: ICustomerData = {
    id: 0,
    name: '',
    phone_num: '',
    phone_num2: '',
    email: '',
    parent_phone_num: '',
    parent_type: '',
    university: '',
    department: '',
    major: ''
  }

  protected doPrepareFetchParams(): Dictionary<any> {
    const result = Object.assign({
      ordering: '-name'
    }, this.queryParams)

    if (result.groups__name__in && result.groups__name__in.length) {
      result.groups__name__in = result.groups__name__in.join(',')
    }
    return result
  }

  protected async doFetchData(queryParams: Dictionary<any>) {
    return getCustomers(queryParams)
  }

  onCreation() {
    this.form = {
      id: 0,
      name: '',
      phone_num: '',
      phone_num2: '',
      email: '',
      parent_phone_num: '',
      parent_type: '',
      university: '',
      department: '',
      major: ''
    }
    this.formDialogVisible = true
  }

  onSelectedDeletion() {
    if (this.isEmptyItemSelection) {
      this.$notify.warning('请先选择')
      return
    }
    this.deleteItems(this.selectedDataItems)
  }

  onItemEdit(item: ICustomerData) {
    this.formTitle = '编辑'
    this.form = {
      ...item
    }
    this.formDialogVisible = true
    // this.fetchGroups('')
  }

  onItemDelete(item: ICustomerData) {
    this.deleteItems([item])
  }

  deleteItems(items: ICustomerData[]) {
    const content = ['确认删除以下吗?']
    const selected = [] as number[]
    for (const item of items) {
      selected.push(item.id || 0)
      content.push(`${item.name} (${item.phone_num})`)
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
      deleteCustomers(params).then(() => {
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
}

export default CustomerList
</script>
