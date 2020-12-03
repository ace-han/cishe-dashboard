<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
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
          v-model="form.parent_type"
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
      <el-button @click="onHide">取消</el-button>
      <el-button
        type="primary"
        @click="submitForm"
      >提交</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ICustomerData } from '@/api/types'
import { createCustomer, partialUpdateCustomer } from '@/api/customers'
import { ElForm } from 'element-ui/types/form'

@Component({
  name: 'CustomerForm'
})
export default class extends Vue {
  @Prop({ required: true }) readonly visible!: boolean
  @Prop({ required: true }) readonly form!: ICustomerData
  @Prop({ default: '创建' }) readonly dialogTitle!: string
  // @success, @failed as event

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
      { min: 1, max: 8, message: '最大长度8字符', trigger: 'change' }
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
          promise = partialUpdateCustomer(this.form.id, params)
        } else {
          // create
          promise = createCustomer(params)
        }
        promise.then(({ data }) => {
          this.$notify.success('操作成功')
          this.onHide()
          this.$emit('success', data)
        }).catch((err: any) => {
          console.error(err)
          this.$notify.error('操作失败')
          const { data, status, statusText } = err.response
          const msgs: string[] = []
          for (const [k, v] of Object.entries(data)) {
            msgs.push(
              `${k}: ${(v as string[]).join(',')}`
            )
          }
          this.$notify.error({
            title: `${status} ${statusText}`,
            message: msgs.join(';')
          })
          this.$emit('failed', err)
        }).finally(() => {
          loading.close()
        })
      } else {
        this.$notify.warning('请正确填写表格')
        return false
      }
    })
  }

  onHide() {
    this.$emit('update:visible', false)
  }
}

</script>
