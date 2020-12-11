<template>
  <div>
    <el-form
      v-if="inited"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="10em"
    >
      <el-row>
        <el-form-item
          v-show="!isItemCreation"
          label="合同编号"
        >
          <!-- <el-form-item
          label="合同编号"
        > -->
          <el-input
            :value="item.contract_num"
            :disabled="true"
          >
            <el-button
              slot="append"
              v-clipboard:copy="item.contract_num"
              v-clipboard:success="clipboardSuccess"
              type="primary"
              icon="el-icon-document"
            >
              Copy
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="contract_type">
          <span slot="label">
            <el-tooltip
              placement="top"
            >
              <div slot="content">
                V001: 美/加研究生<br>
                V002: MBA<br>
                V003: 美/英/加本科生<br>
                V004: ?<br>
              </div>
              <i class="el-icon-info">
                合同类型
              </i>
            </el-tooltip>
          </span>
          <model-field-values-select
            v-model="form.contract_type"
            :select-style="{width: '100%'}"
            model-class-path="cishe.contract.models.Contract"
            model-field-path="contract_type"
            allow-create
          />
        </el-form-item>
        <el-form-item
          label="学生"
          prop="customer"
        >
          <model-select
            ref="customerSelect"
            v-model="form.customer"
            :select-style="{width: '90%'}"
            url="/fev1/contract/customers/"
            :params="{fields: 'id,name,phone_num'}"
            :format-item="(item) => ({
              value: item.id,
              label: `${item.name} (${item.phone_num})`,
              object: item
            })"
            :init-func="fetchCustomersById"
          />
          <el-button
            icon="el-icon-plus"
            @click="onAddCustomer"
          />
        </el-form-item>
        <el-form-item
          label="客户来源"
          prop="source"
        >
          <model-field-values-select
            v-model="form.source"
            :select-style="{width: '100%'}"
            model-class-path="cishe.contract.models.Contract"
            model-field-path="source"
            allow-create
          />
        </el-form-item>
        <el-form-item
          label="签约日期"
          prop="signing_date"
        >
          <el-date-picker
            v-model="form.signing_date"
            clearable
            placeholder="日期"
            type="date"
            :style="{width: '100%'}"
          />
        </el-form-item>
        <el-form-item
          label="签约分公司"
          prop="signing_branch"
        >
          <model-field-values-select
            v-model="form.signing_branch"
            :select-style="{width: '100%'}"
            model-class-path="cishe.contract.models.Contract"
            model-field-path="signing_branch"
            allow-create
          />
        </el-form-item>
        <el-form-item
          label="签约人员"
          prop="sale_agent"
        >
          <model-select
            v-model="form.sale_agent"
            :select-style="{width: '100%'}"
            url="/fev1/account/users/"
            :params="{fields: 'id,username,first_name,last_name'}"
            :format-item="(item) => ({
              value: item.id,
              label: `${item.first_name} ${item.last_name} (${item.username})`,
              object: item
            })"
            :init-func="fetchUsersById"
          />
        </el-form-item>
        <el-form-item
          label="策划期"
          prop="probation_until"
        >
          <el-date-picker
            v-model="form.probation_until"
            clearable
            placeholder="日期"
            type="date"
            :style="{width: '100%'}"
          />
        </el-form-item>
        <el-form-item
          label="合同价格"
          prop="total_amount"
        >
          <el-input-number
            v-model="form.total_amount"
            :min="1000"
            :step="500"
            :precision="0"
            clearable
            placeholder="1000起步"
          />
        </el-form-item>
        <el-form-item
          label="介绍人"
          prop="referrer"
        >
          <model-field-values-select
            v-model="form.referrer"
            :select-style="{width: '100%'}"
            model-class-path="cishe.contract.models.Contract"
            model-field-path="referrer"
            allow-create
          />
        </el-form-item>
        <el-form-item
          label="补充协议"
          prop="supplementary_agreement"
        >
          <el-input
            v-model="form.supplementary_agreement"
            clearable
            placeholder="协议内容"
            type="textarea"
            :autosize="{minRows: 3, maxRows: 6}"
          />
        </el-form-item>
      </el-row>
    </el-form>
    <customer-form
      :visible.sync="customerFormDialogVisible"
      :form="customerForm"
      @success="onCustomerSuccessCreation"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import moment from 'moment'
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import EditPartMixin, { AbstractEditPart } from '@/views/mixins/edit-part'
import { Dictionary } from 'vue-router/types/router'
import { IContractData, ICustomerData } from '@/api/types'
import ModelFieldValuesSelect from '@/components/ModelFieldValuesSelect/index.vue'
import ModelSelect from '@/components/ModelSelect/index.vue'
import { getUsers } from '@/api/users'
import { getCustomers } from '@/api/customers'
import CustomerForm from '@/views/contract/customers/form.vue'

@Component({
  name: 'BasicPart',
  components: {
    ModelFieldValuesSelect,
    ModelSelect,
    CustomerForm
  }
})
export default class extends Mixins<EditPartMixin<IContractData>>(EditPartMixin) implements AbstractEditPart {
  protected form: Dictionary<any> = {
    id: 0,
    customer: 0,
    // contract_num: '',
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

  private customerFormDialogVisible = false
  private customerForm: ICustomerData = {
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

  private rules = {
    customer: [
      { type: 'number', required: true, trigger: 'blur' }
    ],
    contract_type: [
      { required: true, trigger: 'blur' },
      { min: 1, max: 8, message: '最大长度8字符', trigger: 'change' }
    ],
    source: [
      { max: 8, message: '最大长度8字符', trigger: 'change' }
    ],
    signing_date: [
      { required: true, trigger: 'change' }
    ],
    signing_branch: [
      { max: 4, message: '最大长度150字符', trigger: 'change' }
    ],
    sale_agent: [
      { type: 'number', required: true, trigger: 'blur' }
    ],
    probation_until: [
      { required: true, trigger: 'blur' }
    ],
    total_amount: [
      { type: 'number', required: true, trigger: 'change' }
    ],
    referrer: [
      { max: 32, message: '最大长度32字符', trigger: 'change' }
    ],
    supplementary_agreement: [
      { max: 2000, message: '最大长度150字符', trigger: 'change' }
    ]
  }

  init(): Promise<Dictionary<any>> {
    for (const [k, v] of Object.entries(this.item)) {
      if (k in this.form) {
        this.form[k] = v
      }
    }
    if (!this.form.customer) {
      this.form.customer = ''
    }
    if (!this.form.sale_agent) {
      this.form.sale_agent = ''
    }
    this.inited = true
    return Promise.resolve(this.form)
  }

  validate(): Promise<string[]> {
    // debugging in element-ui.common.js#2300@validate,
    // found that promise catch only gets the `valid`, no `invalidFields`
    // this.$refs[formName].validate().then(() => {
    //   console.info('submitForm success')
    // }).catch((err, fields) => {
    //   console.error('sumitForm promise', err, fields)
    // })
    const result = new Promise<string[]>((resolve, reject) => {
      this.$refs.form.validate((valid, invalidFields) => {
        const errors:string[] = []
        if (valid) {
          resolve(errors)
        } else {
          for (const error of Object.values(invalidFields)) {
            errors.push(error)
          }
          reject(errors)
        }
      })
    })
    return result
  }

  serialize(): Dictionary<any> {
    const result = {
      ...this.form,
      probation_until: moment(this.form.probation_until).utc().format(),
      signing_date: moment(this.form.signing_date).utc().format()
    }
    console.info('basic-part serialize', result)
    return result
  }

  clipboardSuccess() {
    this.$message({
      message: 'Copy successfully',
      type: 'success'
    })
  }

  fetchUsersById(q: string): Promise<any[]> {
    const result = new Promise<any[]>((resolve, reject) => {
      getUsers({
        id__in: q,
        page_size: 20,
        fields: 'id,username,first_name,last_name'
      }).then(({ data }) => {
        resolve(data.results)
      }).catch((err: any) => {
        reject(err)
        this.$notify.error('获取签约人员失败')
      })
    })
    return result
  }

  fetchCustomersById(q: string): Promise<any[]> {
    const result = new Promise<any[]>((resolve, reject) => {
      getCustomers({
        id__in: q,
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

  onAddCustomer() {
    this.customerForm = {
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
    this.customerFormDialogVisible = true
  }

  onCustomerSuccessCreation(customer: ICustomerData) {
    this.form.customer = customer.id || 0
    this.$nextTick(() => {
      (this.$refs.customerSelect as ModelSelect).doFetchItems(customer.name)
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
