import { BASEURL } from './url'

// 封装的网络请求的方法
export const fetch = params => {
  const { method = 'GET', url, data, header } = params

  return new Promise((resolve, reject) => {
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
      }
    })
  })
}
