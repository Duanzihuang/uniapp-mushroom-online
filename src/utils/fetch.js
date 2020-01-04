import { BASEURL } from './url'

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
    // 是否需要授权
    const token = uni.getStorageSync('my_token')
    if (token) {
      header.Authorization = token
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
