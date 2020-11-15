<template>
  <div>
    <el-form
      :model="form"
      label-width="10em"
    >
      <el-row>
        <el-form-item label="申请季">
          <el-input
            v-model="form.enrollment_semester"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="延期说明">
          <el-input
            v-model="form.retention_statement"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="申请国家">
          <el-input
            v-model="form.target_country_code"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="申请科目">
          <el-input
            v-model="form.target_subject"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="申请学位">
          <el-input
            v-model="form.target_degree"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="申请专业">
          <el-input
            v-model="form.target_major"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="项目组">
          <el-input
            v-model="form.team"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="工作量">
          <el-input
            v-model="form.workload"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="项目状态">
          <el-input
            v-model="form.status"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="启动日期">
          <el-input
            v-model="form.start_date"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'

import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import EditPartMixin, { AbstractEditPart } from '@/views/mixins/edit-part'
import { Dictionary } from 'vue-router/types/router'
import { IContractDataWithDetail } from '@/api/types'

@Component({
  name: 'ServicePart'
})
export default class extends Mixins<EditPartMixin<IContractDataWithDetail>>(EditPartMixin) implements AbstractEditPart {
  protected form: Dictionary<any> = {
    id: 0,
    contract: 0,
    contract_num: '',
    enrollment_semester: '',
    retention_statement: '',
    target_country_code: '',
    target_subject: '',
    target_degree: '',
    target_major: '',
    team: '',
    workload: 0,
    status: '',
    start_date: '',
    remark: ''
  }

  init(): Promise<Dictionary<any>> {
    for (const [k, v] of Object.entries(this.item.serviceinfo)) {
      if (k in this.form) {
        this.form[k] = v
      }
    }
    return Promise.resolve(this.form)
  }

  validate(): Promise<string[]> {
    return Promise.resolve([])
  }

  serialize(): Dictionary<any> {
    return this.item
  }
}
</script>

<style lang="scss" scoped>
</style>
