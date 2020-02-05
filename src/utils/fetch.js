import { BASEURL } from './url'

import store from '../store'

// 封装的网络请求的方法
export const fetch = ({
  method = 'GET',
  url,
  data,
  header = {},
  tip = '数据加载中...',
  isNeedAuth = true
}) => {
  if (isNeedAuth) {
    // 先获取store中的token
    const token = store.getters.getToken

    // store中有token
    if (token) {
      header.Authorization = token
    } else {
      // store中没有token
      const my_token = uni.getStorageSync('my_token')
      header.Authorization = my_token

      // 把从本地取出来的token，放到store中
      store.commit('setToken', my_token)
    }
  }

  return new Promise((resolve, reject) => {
    uni.showLoading({
      title: tip, //提示的内容,
      mask: true //显示透明蒙层，防止触摸穿透,
    })

    uni.request({
      method,
      url: `${BASEURL}${url}`, //仅为示例，并非真实接口地址。
      data: data,
      header: header,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      },
      complete: () => {
        uni.hideLoading()
      }
    })
  })
}
