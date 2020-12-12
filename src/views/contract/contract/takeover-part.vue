<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="10em"
    >
      <el-form-item
        label="咨询师"
        prop="counselor"
        :required="isItemCreation"
      >
        <model-select
          v-model="form.counselor"
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
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="form.remark"
          clearable
          placeholder="备注内容"
          type="textarea"
          :autosize="{minRows: 3, maxRows: 6}"
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
          {{ row.counselor.first_name }} ({{ row.counselor.username }})
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
        label="操作"
      >
        <template slot-scope="{row}">
          <el-button
            size="small"
            icon="el-icon-delete"
            @click="onRecordDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import { Component, Mixins, Prop } from 'vue-property-decorator'

import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import EditPartMixin, { AbstractEditPart } from '@/views/mixins/edit-part'
import { Dictionary } from 'vue-router/types/router'
import { IContractDataWithDetail, ITakeOverData, IUserData } from '@/api/types'
import ModelSelect from '@/components/ModelSelect/index.vue'
import { getUsers } from '@/api/users'
import { deleteTakeOvers, getTakeOvers } from '@/api/takeovers'

@Component({
  name: 'TakeoverPart',
  components: {
    ModelSelect
  }
})
export default class extends Mixins<EditPartMixin<IContractDataWithDetail>>(EditPartMixin) implements AbstractEditPart {
  @Prop({ required: true }) readonly historyEnabled!: boolean
  protected form: Dictionary<any> = {
    counselor: '',
    contract: '',
    transfer_date: '',
    remark: ''
  }

  private rules = {
    counselor: [
      {
        validator: (rule: Dictionary<any>, value: string | number) => {
          const errors = []
          if (this.isItemCreation) {
            if (!value) {
              errors.push(new Error('counselor is required'))
            }
            if (isNaN((value as number))) {
              errors.push(new Error('counselor is not a number'))
            }
          } else {
            if (value && isNaN((value as number))) {
              errors.push(new Error('counselor is not a number'))
            }
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
        trigger: 'blur'
      }
    ],
    remark: [
      { max: 2000, message: '最大长度2000字符', trigger: 'change' }
    ]
  }

  private takeoversLoading = false
  private takeovers: ITakeOverData[] = []

  init(): Promise<Dictionary<any>> {
    let ps: Promise<Dictionary<any>>
    if (this.isItemCreation) {
      ps = Promise.resolve(this.form)
    } else {
      this.takeoversLoading = true
      ps = new Promise<Dictionary<any>>((resolve) => {
        const params = {
          contract: this.item.id,
          page_size: 999,
          expand: 'counselor',
          ordering: '-transfer_date'
        }
        getTakeOvers(params).then(({ data }) => {
          this.takeovers = data.results
          resolve(this.form)
        }).finally(() => {
          this.takeoversLoading = false
        })
      })
    }
    return ps
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
      transfer_date: moment.utc().format()
    }
    console.info('takeover-part serialize', result)
    return result
  }

  // onRecordEdit(record: ITakeOverData) {
  //   console.info('onRecordEdit, record: ', record)
  // }

  onRecordDelete(record: ITakeOverData) {
    this.deleteRecords([record])
  }

  deleteRecords(records: ITakeOverData[]) {
    const content = ['确认删除以下吗?']
    const selected = [] as number[]
    for (const record of records) {
      selected.push(record.id || 0)
      content.push(`${(record.counselor as IUserData).username}(${record.id})`)
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
      deleteTakeOvers(params).then(() => {
        this.$notify.success('操作成功')
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
}
</script>

<style lang="scss" scoped>
</style>
