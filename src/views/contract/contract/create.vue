<template>
  <el-container>
    <el-header>
      <div style="margin-top:2em;">
        合同创建
      </div>
    </el-header>
    <el-main>
      <el-collapse
        value="basic"
      >
        <el-collapse-item
          title="基础信息"
          name="basic"
        >
          <basic-part
            ref="basicPart"
            :item="item"
          />
        </el-collapse-item>
        <el-collapse-item title="项目信息">
          <service-part
            ref="servicePart"
            :item="item"
          />
        </el-collapse-item>
        <el-collapse-item title="交接信息">
          <takeover-part
            ref="takeoverPart"
            :item="item"
            :history-enabled="false"
          />
        </el-collapse-item>
        <el-collapse-item
          title="备注"
        >
          <div> To Be Continued </div>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import { Dictionary } from 'vue-router/types/router'
import BasicPart from '@/views/contract/contract/basic-part.vue'
import ServicePart from '@/views/contract/contract/service-part.vue'
import TakeoverPart from '@/views/contract/contract/takeover-part.vue'
import { IContractDataWithDetail } from '@/api/types'
import { AbstractEditPart } from '@/views/mixins/edit-part'

@Component({
  components: {
    BasicPart,
    ServicePart,
    TakeoverPart
  }
})
export default class extends Vue {
  $refs!: {
    basicPart: BasicPart & AbstractEditPart
    servicePart: ServicePart & AbstractEditPart
    takeoverPart: TakeoverPart & AbstractEditPart
  }

  protected queryParams: Dictionary<any> = {
    customer__in: [] as string[]
  }

  private item: IContractDataWithDetail = {
    id: 0,
    customer: 0,
    contract_num: 'abc',
    contract_type: '',
    source: '',
    signing_date: '',
    signing_branch: '',
    sale_agent: 0,
    probation_until: '',
    total_amount: 0,
    referrer: '',
    supplementary_agreement: '',
    serviceinfo: {
      id: 0,
      contract: 0,
      enrollment_semester: '20秋',
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
  }

  mounted() {
    this.init()
  }

  init() {
    const ps = []
    const loading = this.$loading({
      lock: true
    })

    ps.push(this.$refs.basicPart.init())
    ps.push(this.$refs.servicePart.init())
    Promise.all(ps).then(() => {
      // for add we don't do any validations
      // for (const part of this.parts) {
      //   this.$refs[part].validate()
      // }
    }).catch((err) => {
      console.error(err)
    }).finally(() => {
      loading.close()
    })
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  margin-bottom: 10px;
}
</style>
