import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, refresh } from '@/api/auth'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'

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
    // TODO
    // const { data } = await getUserInfo({ /* Your params here */ })
    // if (!data) {
    //   throw Error('Verification failed, please Login again.')
    // }
    // const { username, email, roles } = data.user
    // // roles must be a non-empty array
    // if (!roles || roles.length <= 0) {
    //   throw Error('GetUserInfo: roles must be a non-null array!')
    // }
    this.SET_USERNAME('')
    this.SET_EMAIL('')
    this.SET_ROLES([])
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
    resetRouter()
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
    this.SET_USERNAME('')
    this.SET_EMAIL('')
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)
