import { action, observable } from 'mobx'
class AuthStore {
  // @observable
  // public googleUser: GoogleUserModel = new GoogleUserModel()

  // @action
  // public logout(): void {
  //   if (Cookies.get('google_oauth2')) Cookies.remove('google_oauth2')
  //   const timer: number = +setTimeout(() => 0)
  //   for (let i = timer; i > 0; i--) {
  //     window.clearInterval(i)
  //     window.clearTimeout(i)
  //     if (window.cancelAnimationFrame) window.cancelAnimationFrame(i)
  //   }
  //   this.googleUser = new GoogleUserModel()
  // }

  // @action
  // public setAuthState(googleUser: GoogleUserModel): void {
  //   this.googleUser = googleUser
  //   Cookies.set('google_oauth2', this.googleUser, { expires: 1 })
  // }
}

const authStore: AuthStore = new AuthStore()
export type AuthStoreType = typeof authStore
export default authStore
