import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, refresh } from '@/api/auth'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'
import { getLoggedIn } from '@/utils/cookies'
import { getUserInfo } from '@/api/users'

export interface IUserState {
  username: string
  email: string
  roles: string[]
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public username = ''
  public email = ''
  public roles: string[] = []

  // public hasLoggedIn(): boolean {
  //   // it won't work !!!
  //   // getters are based on pre-defined fields of its own `state`
  //   const result = (getLoggedIn() || '').toLowerCase() === 'true'
  //   return result
  // }

  @Mutation
  private SET_USERNAME(username: string) {
    this.username = username
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  public RESET() {
    resetRouter()
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
    this.username = ''
    this.email = ''
    this.roles = []
  }

  @Action
  public async Login(userInfo: { username: string, password: string}) {
    let { username, password } = userInfo
    username = username.trim()
    await login({ username, password })
  }

  @Action
  public async RefreshToken() {
    await refresh()
  }

  @Action
  public async GetUserInfo() {
    const data = await getUserInfo()
    const { username, email, roles } = data

    if (!roles.length) {
      roles.push('visitor')
    }
    const { commit } = this.context
    commit('SET_USERNAME', username)
    commit('SET_EMAIL', email)
    commit('SET_ROLES', roles)
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    console.warn('src/store/modules/user.ts@ChageRoles, role: ', role)
    await this.GetUserInfo()
    resetRouter()
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles)
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes)
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
  }

  @Action
  public async LogOut() {
    await logout()
    this.RESET()
  }
}

// add hasLoggedIn function signature...
interface User {
  hasLoggedIn(): boolean
}

export const UserModule = getModule(User)

UserModule.hasLoggedIn = (): boolean => {
  const result = (getLoggedIn() || '').toLowerCase() === 'true'
  return result
}
