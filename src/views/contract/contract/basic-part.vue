<template>
  <div>
    <el-form
      :model="form"
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
          <div slot="label">
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
          </div>
          <el-input
            v-model="form.contract_type"
            clearable
            placeholder="模糊匹配"
            @keyup.enter.native="submit"
          />
        </el-form-item>
        <el-form-item label="学生">
          <el-select
            value="abc"
            style="width: 88%;"
          >
            <el-option value="abc" />
            <el-option value="def" />
          </el-select>
          <el-button
            icon="el-icon-plus"
          >
            Add
          </el-button>
        </el-form-item>
        <el-form-item label="客户来源">
          <model-field-values-select
            v-model="form.source"
            model-class-path="django.contrib.auth.models.User"
            model-field-path="username"
            allow-create
            :style="{width: '100%'}"
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
import ModelFieldValuesSelect from '@/components/ModelFieldValuesSelect/index.vue'

@Component({
  name: 'BasicPart',
  components: {
    ModelFieldValuesSelect
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

  clipboardSuccess() {
    this.$message({
      message: 'Copy successfully',
      type: 'success'
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
