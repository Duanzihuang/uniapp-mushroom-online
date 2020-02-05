<script lang="ts">
import Vue from 'vue'
import store from './store'
export default Vue.extend({
  mpType: 'app',
  onLaunch() {
    const my_token = uni.getStorageSync('my_token')

    if (my_token) {
      // 把本地的token赋值到store中
      store.commit('setToken',my_token)

      // 有，则直接跳转到首页
      uni.reLaunch({
        url: '/pages/home/index'
      })
    }
  }
})
</script>

<style>
/*每个页面公共css */
page {
  background-color: #f8f8f8;
  height: 100%;
}
</style>
