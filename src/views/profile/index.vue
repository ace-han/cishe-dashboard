<template>
  <div class="app-container">
    <div v-if="user">
      <el-card>
        <el-tabs v-model="activeTab">
          <el-tab-pane
            label="Account"
            name="account"
          >
            <account :user="user" />
          </el-tab-pane>
          <el-tab-pane
            label="Activity"
            name="activity"
          >
            <activity />
          </el-tab-pane>
          <el-tab-pane
            label="Timeline"
            name="timeline"
          >
            <timeline />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import Account from './components/Account.vue'
import Activity from './components/Activity.vue'
import Timeline from './components/Timeline.vue'

export interface IProfile {
  name: string
  email: string
  roles: string
}

const defaultProfile: IProfile = {
  name: 'Loading...',
  email: 'Loading...',
  roles: 'Loading...'
}

@Component({
  name: 'Profile',
  components: {
    Account,
    Activity,
    Timeline
  }
})
export default class extends Vue {
  private user = defaultProfile
  private activeTab = 'account'

  get name() {
    return UserModule.username
  }

  get email() {
    return UserModule.email
  }

  get roles() {
    return UserModule.roles
  }

  created() {
    this.getUser()
  }

  private getUser() {
    this.user = {
      name: this.name,
      email: this.email,
      roles: this.roles.join(' | ')
    }
  }
}
</script>
