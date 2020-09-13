<template>
  <div class="dashboard-container">
    <el-card header="Single Request">
      <el-button @click="token403">
        Token 403
      </el-button>
      <el-button @click="unauthorized403">
        Unauthorized
      </el-button>
      <el-button @click="token401">
        Token 401
      </el-button>
      <el-button @click="singleAuth">
        Single Auth
      </el-button>
    </el-card>
    <el-divider />
    <el-card header="Multi Requests">
      <el-button @click="userInfos">
        tweak tokens then click
      </el-button>
    </el-card>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import requestService from '@/utils/request'
import { getUsers, getUserInfo } from '@/api/users'

@Component({
  name: 'Home'
})
export default class extends Vue {
  get roles() {
    return UserModule.roles
  }

  created() {
    console.info('Home')
  }

  async token403() {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    requestService.get('/fev1/auth/token/token-403/', {
      cancelToken: source.token
    }).catch((err) => {
      if (axios.isCancel(err)) {
        console.warn('Request canceled', err.message)
      } else {
        console.error('token403 other error', err)
      }
    })
    setTimeout(() => {
      source.cancel('Endless 403 loop canceled by timer 3 sec.')
    }, 3000)
  }

  async unauthorized403() {
    requestService.get('/fev1/auth/token/unauthorized/')
  }

  async token401() {
    requestService.get('/fev1/auth/token/token-401/')
  }

  async singleAuth() {
    requestService.get('/fev1/account/users/current-user-info/')
  }

  async userInfos() {
    Promise.all([
      getUsers({ page: 1 }),
      getUserInfo()
    ])
  }
}
</script>
