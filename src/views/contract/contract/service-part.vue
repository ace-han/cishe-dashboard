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
          label="申请季"
          prop="enrollment_semester"
        >
          <model-field-values-select
            v-model="form.enrollment_semester"
            :select-style="{width: '100%'}"
            model-class-path="cishe.contract.models.ServiceInfo"
            model-field-path="enrollment_semester"
            allow-create
          />
        </el-form-item>
        <el-form-item
          label="延期说明"
          prop="retention_statement"
        >
          <el-input
            v-model="form.retention_statement"
            clearable
            placeholder="说明内容"
            type="textarea"
            :autosize="{minRows: 3, maxRows: 6}"
          />
        </el-form-item>
        <el-form-item
          prop="target_country_code"
        >
          <span slot="label">
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
              >申请国家</el-link>
            </el-tooltip>
          </span>
          <model-field-values-select
            v-model="form.target_country_code"
            :select-style="{width: '100%'}"
            model-class-path="cishe.contract.models.ServiceInfo"
            model-field-path="target_country_code"
            allow-create
            multiple
            :format-items="formCSVItems"
          />
        </el-form-item>
        <el-form-item
          label="申请科目"
          prop="target_subject"
        >
          <model-field-values-select
            v-model="form.target_subject"
            :select-style="{width: '100%'}"
            model-class-path="cishe.contract.models.ServiceInfo"
            model-field-path="target_subject"
            allow-create
          />
        </el-form-item>
        <el-form-item
          label="申请学位"
          prop="target_degree"
        >
          <model-field-values-select
            v-model="form.target_degree"
            :select-style="{width: '100%'}"
            model-class-path="cishe.contract.models.ServiceInfo"
            model-field-path="target_degree"
            allow-create
          />
        </el-form-item>
        <el-form-item
          label="申请专业"
          prop="target_major"
        >
          <model-field-values-select
            v-model="form.target_major"
            :select-style="{width: '100%'}"
            model-class-path="cishe.contract.models.ServiceInfo"
            model-field-path="target_major"
            allow-create
            multiple
            :format-items="formCSVItems"
          />
        </el-form-item>
        <el-form-item
          label="项目组"
          prop="team"
        >
          <model-field-values-select
            v-model="form.team"
            :select-style="{width: '100%'}"
            model-class-path="cishe.contract.models.ServiceInfo"
            model-field-path="team"
            allow-create
          />
        </el-form-item>
        <el-form-item
          prop="workload"
        >
          <span slot="label">
            <el-tooltip
              placement="top"
            >
              <div slot="content">
                北美本科、MBA按1.5计算，研究型学位按1.3，北美商科按1.2，其余按1.0（以签约时合同为准）；EV合同或双专业合同在相应基准上增加0.2（北美艺术类可以酌情上调0.2）<br><br>
                上一季延期客户，已返回《执行期完成确认书》的，北美本科、MBA按1.0计算，研究型学位按0.8，北美商科按0.7，其余按0.5；EV合同或双专业合同在相应基准上增加0.1<br>
              </div>
              <i class="el-icon-info">
                工作量
              </i>
            </el-tooltip>
          </span>
          <el-input-number
            v-model="form.workload"
            :min="0.1"
            :step="0.1"
            :precision="1"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="项目状态"
          prop="status"
        >
          <model-field-values-select
            v-model="form.status"
            :select-style="{width: '100%'}"
            model-class-path="cishe.contract.models.ServiceInfo"
            model-field-path="status"
            allow-create
          />
        </el-form-item>
        <el-form-item
          label="启动日期"
          prop="start_date"
        >
          <el-date-picker
            v-model="form.start_date"
            clearable
            placeholder="日期"
            type="date"
            :style="{width: '100%'}"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="supplementary_agreement"
        >
          <el-input
            v-model="form.supplementary_agreement"
            clearable
            placeholder="备注内容"
            type="textarea"
            :autosize="{minRows: 3, maxRows: 6}"
          />
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import moment from 'moment'
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import EditPartMixin, { AbstractEditPart } from '@/views/mixins/edit-part'
import { Dictionary } from 'vue-router/types/router'
import { IContractDataWithDetail } from '@/api/types'
import ModelFieldValuesSelect from '@/components/ModelFieldValuesSelect/index.vue'

@Component({
  name: 'ServicePart',
  components: {
    ModelFieldValuesSelect
  }
})
export default class extends Mixins<EditPartMixin<IContractDataWithDetail>>(EditPartMixin) implements AbstractEditPart {
  protected form: Dictionary<any> = {
    id: 0,
    contract: 0,
    enrollment_semester: '',
    retention_statement: '',
    target_country_code: [],
    target_subject: '',
    target_degree: '',
    target_major: [],
    team: '',
    workload: 0,
    status: '',
    start_date: '',
    remark: ''
  }

  private rules = {
    enrollment_semester: [
      { required: true, trigger: 'blur' },
      { min: 1, max: 4, message: '最大长度4字符', trigger: 'change' }
    ],
    retention_statement: [
      { max: 4, message: '最大长度4字符', trigger: 'change' }
    ],
    target_country_code: [
      {
        type: 'array',
        required: true,
        validator(rule: Dictionary<any>, value: string[]) {
          const errors = []
          const v = value.join(',')
          if (!v) {
            errors.push(new Error('target_country_code is required'))
          }
          if (v.length > 32) {
            errors.push(new Error('选项过多，以`,`分隔，最多32字符'))
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
        trigger: 'input'
      }
    ],
    target_subject: [
      { required: true, trigger: 'blur' },
      { min: 1, max: 4, message: '最大长度4字符', trigger: 'change' }
    ],
    target_degree: [
      { required: true, trigger: 'blur' },
      { min: 1, max: 4, message: '最大长度4字符', trigger: 'change' }
    ],
    target_major: [
      {
        type: 'array',
        required: true,
        validator(rule: Dictionary<any>, value: string[]) {
          const errors = []
          const v = value.join(',')
          if (!v) {
            errors.push(new Error('target_major is required'))
          }
          if (v.length > 32) {
            errors.push(new Error('选项过多，以`,`分隔，最多32字符'))
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
        trigger: 'input'
      }
    ],
    team: [
      { required: true, trigger: 'blur' },
      { min: 1, max: 4, message: '最大长度4字符', trigger: 'change' }
    ],
    workload: [
      { type: 'number', required: true, trigger: 'blur' }
    ],
    status: [
      { required: true, trigger: 'blur' },
      { max: 32, message: '最大长度32字符', trigger: 'change' }
    ],
    start_date: [
      { required: true, trigger: 'change' }
    ],
    remark: [
      { max: 2000, message: '最大长度2000字符', trigger: 'change' }
    ]
  }

  init(): Promise<Dictionary<any>> {
    const serviceInfo = this.item.serviceinfo
    for (const [k, v] of Object.entries(serviceInfo)) {
      if (k in this.form) {
        this.form[k] = v
      }
    }
    if (serviceInfo.target_country_code) {
      this.form.target_country_code = serviceInfo.target_country_code.split(',')
    } else {
      this.form.target_country_code = []
    }
    if (serviceInfo.target_major) {
      this.form.target_major = serviceInfo.target_major.split(',')
    } else {
      this.form.target_major = []
    }
    if (serviceInfo.start_date) {
      this.form.start_date = moment(serviceInfo.start_date)
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
      start_date: moment(this.form.start_date).utc().format(),
      target_country_code: this.form.target_country_code.join(','),
      target_major: this.form.target_major.join(',')
    }
    console.info('service-part serialize', result)
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
}
</script>

<style lang="scss" scoped>
</style>
