<template>
  <div>
    <el-form
      :model="form"
      label-width="10em"
    >
      <el-form-item label="咨询师">
        <el-input
          v-model="form.remark"
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
    </el-form>

    <el-divider
      v-if="historyEnabled"
      content-position="left"
    >
      交接历史
    </el-divider>
    <el-table
      v-show="historyEnabled"
      v-loading="takeoversLoading"
      border
      fit
      stripe
      :data="takeovers"
    >
      <el-table-column
        property="id"
        label="ID"
      />
      <el-table-column
        label="咨询师"
      >
        <template slot-scope="{row}">
          {{ row.staff.first_name }} ({{ row.staff.username }})
        </template>
      </el-table-column>
      <el-table-column
        label="交接日期"
      >
        <template slot-scope="{row}">
          {{ row.transfer_date | parseMoment('YYYY-MM-DD') }}
        </template>
      </el-table-column>

      <el-table-column
        property="remark"
        label="备注"
      />
      <el-table-column
        label="操作人"
      >
        <template slot-scope="{row}">
          <el-button
            size="small"
            icon="el-icon-edit"
            @click="onRecordEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            icon="el-icon-delete"
            @click="onRecordDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="{row}">
          {{ row.staff.first_name }} ({{ row.staff.username }})
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'

import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import EditPartMixin, { AbstractEditPart } from '@/views/mixins/edit-part'
import { Dictionary } from 'vue-router/types/router'
import { IContractDataWithDetail, ITakeOverData } from '@/api/types'

@Component({
  name: 'TakeoverPart'
})
export default class extends Mixins<EditPartMixin<IContractDataWithDetail>>(EditPartMixin) implements AbstractEditPart {
  protected form: Dictionary<any> = {
    staff: 0,
    contract: '',
    transfer_date: '',
    remark: '',
    comment_by: ''
  }

  @Prop({ required: true }) private historyEnabled = false
  private takeoversLoading = false
  private takeovers = []

  init(): Promise<Dictionary<any>> {
    return Promise.resolve(this.form)
  }

  validate(): Promise<string[]> {
    return Promise.resolve([])
  }

  serialize(): Dictionary<any> {
    return this.item
  }

  onRecordEdit(record: ITakeOverData) {
    console.info('onRecordEdit, record: ', record)
  }

  onRecordDelete(record: ITakeOverData) {
    console.info('onRecordDelete, record: ', record)
  }
}
</script>

<style lang="scss" scoped>
</style>
