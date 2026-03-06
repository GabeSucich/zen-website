declare module '@lucien144/vue3-parallaxy' {
  import type { DefineComponent } from 'vue'
  const Parallaxy: DefineComponent<{
    speed?: number
    axis?: 'x' | 'y'
    direction?: 'normal' | 'opposite'
    disabled?: boolean
  }>
  export default Parallaxy
}
