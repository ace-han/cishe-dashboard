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
            :history-enabled="true"
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
import { Component, Prop, Vue } from 'vue-property-decorator'

import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import { Dictionary } from 'vue-router/types/router'
import BasicPart from '@/views/contract/contract/basic-part.vue'
import ServicePart from '@/views/contract/contract/service-part.vue'
import TakeoverPart from '@/views/contract/contract/takeover-part.vue'
import { IContractDataWithDetail } from '@/api/types'
import { AbstractEditPart } from '@/views/mixins/edit-part'
import { getContracts, partialUpdateContract } from '@/api/contracts'

const DEFAULT_ITEM = {
  id: 0,
  customer: 0,
  contract_num: 'abc',
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

// function fetchContract(id: number | string): Promise<IContractDataWithDetail> {
//   const loading = Loading.service({
//     lock: true
//   })
//   const result = new Promise<IContractDataWithDetail>((resolve, reject) => {
//     getContracts({
//       id: id,
//       expand: 'serviceinfo,takeovers',
//       page: 1,
//       page_size: 1
//     }).then(({ data }) => {
//       if (data.results.length) {
//         resolve(data.results[0])
//       } else {
//         reject(new Error(`Contract ID: '${id}' doest not exist`))
//       }
//     }).catch((err: any) => {
//       console.error(err)
//       Notification.error('获取合同信息失败')
//       reject(err)
//     }).finally(() => {
//       loading.close()
//     })
//   })
//   return result
// }

@Component({
  components: {
    BasicPart,
    ServicePart,
    TakeoverPart
  }
})
export default class ContractContractEdit extends Vue {
  @Prop({ type: [String, Number], required: true }) id!: string|number

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

  item: IContractDataWithDetail = DEFAULT_ITEM

  // beforeRouteEnter(to: any, from: any, next: any) {
  //   fetchContract(to.params.id).then((item) => {
  //     next((vm: ContractContractEdit) => {
  //       vm.item = item
  //     })
  //   }).catch(() => {
  //     // should navi to list view
  //     next({ name: 'ContractContracts' })
  //   })
  // }

  // beforeRouteUpdate(to: any, from: any, next: any) {
  //   this.item = DEFAULT_ITEM
  //   fetchContract(to.params.id).then((item) => {
  //     this.item = item
  //     next()
  //   }).catch(() => {
  //     // should navi to list view
  //     next({ name: 'ContractContracts' })
  //   })
  // }

  mounted() {
    this.init()
  }

  init() {
    getContracts({
      id: this.id,
      expand: 'serviceinfo',
      page: 1,
      page_size: 1
    }).then(({ data }) => {
      if (data.results.length) {
        this.item = data.results[0]
        return Promise.resolve(this.item)
      } else {
        return Promise.reject(new Error(`Contract ID: '${this.id}' doest not exist`))
      }
    }).catch((err: any) => {
      console.error(err)
      this.$notify.error('获取合同信息失败')
      return Promise.reject(err)
    }).then(() => {
      const ps = []
      for (const part of Object.values(this.$refs)) {
        ps.push(part.init())
      }
      return Promise.all(ps)
    }).catch((err) => {
      console.error(err)
      this.$notify.error('初始化失败')
    }).then(() => {
      for (const part of Object.values(this.$refs)) {
        part.validate()
      }
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
        id: 0,
        serviceinfo,
        takeover
      }

      Object.assign(contract, parts[0])
      Object.assign(serviceinfo, parts[1])
      if (parts[2].counselor) {
        Object.assign(takeover, parts[2])
      }

      return contract
    }).catch((err) => {
      console.error(err)
      this.$notify.warning('请修正提示的错误')
      return Promise.reject(err)
    }).then((params) => {
      const loading = this.$loading({
        lock: true
      })
      return partialUpdateContract(params.id, params)
        .then(() => {
          this.$router.go(0)
        }).catch((err: any) => {
          console.error(err)
          this.$notify.error('修改监控项失败, 请稍后重试或联系管理员')
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
