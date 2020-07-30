<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

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
}
</script>
