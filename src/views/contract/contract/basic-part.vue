<template>
  <div>
    <el-form
      :model="form"
      label-width="10em"
    >
      <el-row>
        <el-form-item label="合同编号">
          <el-input
            v-model="form.contract_num"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="合同类型">
          <el-input
            v-model="form.contract_type"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="学生名字">
          <el-input
            v-model="form.customer"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="客户来源">
          <el-input
            v-model="form.source"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="签约日期">
          <el-input
            v-model="form.signing_date"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="签约分公司">
          <el-input
            v-model="form.signing_branch"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="签约人员">
          <el-input
            v-model="form.sale_agent"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="策划期">
          <el-input
            v-model="form.probation_until"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="合同价格">
          <el-input
            v-model="form.total_amount"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="介绍人">
          <el-input
            v-model="form.referrer"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="补充协议">
          <el-input
            v-model="form.supplementary_agreement"
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
import { IContractData } from '@/api/types'

@Component({
  name: 'BasicPart'
})
export default class extends Mixins<EditPartMixin<IContractData>>(EditPartMixin) implements AbstractEditPart {
  protected form: Dictionary<any> = {
    id: 0,
    customer: 0,
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

  init(): Promise<Dictionary<any>> {
    for (const [k, v] of Object.entries(this.item)) {
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
