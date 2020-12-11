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
          name="basic"
        >
          <template slot="title">
            基础信息
            <i
              v-show="basicPartError"
              class="header-icon el-icon-warning"
              style="color: red;"
            />
          </template>
          <basic-part
            ref="basicPart"
            :item="item"
          />
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            项目信息
            <i
              v-show="servicePartError"
              class="header-icon el-icon-warning"
              style="color: red;"
            />
          </template>
          <service-part
            ref="servicePart"
            :item="item"
          />
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            交接信息
            <i
              v-show="takeoverPartError"
              class="header-icon el-icon-warning"
              style="color: red;"
            />
          </template>
          <takeover-part
            ref="takeoverPart"
            :item="item"
            :history-enabled="false"
          />
        </el-collapse-item>
      </el-collapse>
      <el-button-group style="margin:1em 0;">
        <el-button
          type="primary"
          @click="onSubmit"
        >
          保存
        </el-button>
        <el-button @click="onCancel">
          取消
        </el-button>
      </el-button-group>
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
import { createContract, getContracts } from '@/api/contracts'

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

  private basicPartError = false
  private servicePartError = false
  private takeoverPartError = false

  protected queryParams: Dictionary<any> = {
    customer__in: [] as string[]
  }

  private item: IContractDataWithDetail = {
    id: 0,
    customer: 0,
    contract_num: '',
    contract_type: '',
    source: '',
    signing_date: '',
    signing_branch: '',
    sale_agent: 0,
    probation_until: '',
    total_amount: 1000,
    referrer: '',
    supplementary_agreement: '',
    serviceinfo: {
      id: 0,
      contract: 0,
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
  }

  mounted() {
    this.init()
  }

  init() {
    const loading = this.$loading({
      lock: true
    })
    let p: Promise<any>
    if (this.$route.query.copy) {
      const contractId = this.$route.query.copy
      p = getContracts({
        id: contractId,
        expand: 'serviceinfo',
        page: 1,
        page_size: 1
      }).then(({ data }) => {
        if (data.results.length) {
          this.item = {
            ...data.results[0],
            // keep it 0 as isItemCreation == true
            id: 0
          }
          return Promise.resolve(this.item)
        } else {
          return Promise.reject(new Error(`Contract ID: '${this.id}' doest not exist`))
        }
      }).catch((err: any) => {
        console.error(err)
        this.$notify.error('获取合同信息失败')
        return Promise.reject(err)
      })
    } else {
      p = Promise.resolve()
    }
    p.then(() => {
      const ps = []
      for (const part of Object.values(this.$refs)) {
        ps.push(part.init())
      }
      return Promise.all(ps)
    }).then(() => {
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

  onSubmit() {
    console.info('onSubmit')
    const ps = []
    for (const [key, part] of Object.entries(this.$refs)) {
      ps.push(
        part.validate()
          .then(() => {
            switch (key) {
              case 'basicPart':
                this.basicPartError = false
                break
              case 'servicePart':
                this.servicePartError = false
                break
              case 'takeoverPart':
                this.takeoverPartError = false
                break
              default:
                throw new Error(`Unknown ${key}PartError`)
            }
            return part.serialize()
          }).catch((errors: string[]) => {
            switch (key) {
              case 'basicPart':
                this.basicPartError = true
                break
              case 'servicePart':
                this.servicePartError = true
                break
              case 'takeoverPart':
                this.takeoverPartError = true
                break
              default:
                throw new Error(`Unknown ${key}PartError`)
            }
            return Promise.reject(errors)
          })
      )
    }
    // dealing with long promise chains (one catch and make marks on errors)
    // refer to
    // https://medium.com/@arthurxavier/error-handling-in-long-promise-chains-155f610b5bc6
    Promise.all(ps).then((parts) => {
      console.info('serializer', parts)
      const serviceinfo = {}
      const takeover = {}
      const contract = {
        serviceinfo,
        takeover
      }

      Object.assign(contract, parts[0])
      Object.assign(serviceinfo, parts[1])
      Object.assign(takeover, parts[2])

      return contract
    }).catch((err) => {
      console.error(err)
      this.$notify.warning('请修正提示的错误')
      return Promise.reject(err)
    }).then((params) => {
      const loading = this.$loading({
        lock: true
      })
      return createContract(params)
        .then(({ data }) => {
          this.$router.push({
            name: 'ContractContractEdit',
            params: { id: '' + data.id }
          })
        }).catch((err: any) => {
          console.error(err)
          this.$notify.error('创建监控项失败, 请稍后重试或联系管理员')
        }).finally(() => {
          loading.close()
        })
    })
  }

  onCancel() {
    this.$router.push({ name: 'ContractContracts' })
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  margin-bottom: 10px;
}
</style>
