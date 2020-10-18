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
          label="姓名"
          prop="name"
        >
          <el-input
            v-model="form.name"
            type="text"
            maxlength="32"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="电话"
          prop="phone_num"
        >
          <el-input
            v-model="form.phone_num"
            type="text"
            maxlength="128"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="备用电话"
          prop="phone_num2"
        >
          <el-input
            v-model="form.phone_num2"
            type="text"
            maxlength="128"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="e-Mail"
          prop="email"
        >
          <el-input
            v-model="form.email"
            type="text"
            maxlength="254"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="家长电话"
          prop="parent_phone_num"
        >
          <el-input
            v-model="form.parent_phone_num"
            type="text"
            maxlength="128"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="家长类型"
          prop="parent_type"
        >
          <el-select
            v-model="queryParams.parent_type"
            clearable
            filterable
            class="filter-item"
          >
            <el-option
              value="father"
              label="父亲"
            />
            <el-option
              value="mother"
              label="母亲"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="大学"
          prop="university"
        >
          <el-input
            v-model="form.university"
            type="text"
            maxlength="32"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="学院"
          prop="department"
        >
          <el-input
            v-model="form.department"
            type="text"
            maxlength="32"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="专业"
          prop="major"
        >
          <el-input
            v-model="form.major"
            type="text"
            maxlength="32"
            show-word-limit
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
import { Component, Mixins } from 'vue-property-decorator'
import { ICustomerData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import FetchDataMixin from '@/views/mixins/list-search'
import { Dictionary } from 'vue-router/types/router'
import { createCustomer, deleteCustomers, partialUpdateCustomer, getCustomers } from '@/api/customers'
import { ElForm } from 'element-ui/types/form'

@Component({
  components: {
    Pagination
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
  private form = {
    title: '创建',
    id: 0,
    name: '',
    phone_num: '',
    phone_num2: '',
    email: '',
    parent_phone_num: '',
    university: '',
    department: '',
    major: ''
  }

  private rules = {
    name: [
      { required: true, trigger: 'blur' },
      { min: 1, max: 32, message: '最大长度32字符', trigger: 'change' }
    ],
    phone_num: [
      { required: true, trigger: 'blur' },
      { min: 1, max: 128, message: '最大长度128字符', trigger: 'change' }
    ],
    phone_num2: [
      { min: 1, max: 128, message: '最大长度150字符', trigger: 'change' }
    ],
    email: [
      { min: 1, max: 254, message: '最大长度254字符', trigger: 'change' }
    ],
    parent_phone_num: [
      { min: 1, max: 128, message: '最大长度128字符', trigger: 'change' }
    ],
    parent_type: [
      { min: 1, max: 4, message: '最大长度4字符', trigger: 'change' }
    ],
    university: [
      { required: true, trigger: 'blur' },
      { min: 1, max: 32, message: '最大长度32字符', trigger: 'change' }
    ],
    department: [
      { min: 1, max: 32, message: '最大长度32字符', trigger: 'change' }
    ],
    major: [
      { required: true, trigger: 'blur' },
      { min: 1, max: 32, message: '最大长度32字符', trigger: 'change' }
    ]
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
      title: '创建',
      id: 0,
      name: '',
      phone_num: '',
      phone_num2: '',
      email: '',
      parent_phone_num: '',
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
    this.form = {
      title: '编辑',
      ...item,
      id: item.id || 0
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
          promise = partialUpdateCustomer(params.id, params)
        } else {
          // create
          promise = createCustomer(params)
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

export default CustomerList
</script>
