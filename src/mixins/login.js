export default {
    methods: {
        loginHandle(res) {
            if (res.data.status === 0) {
                // 登录成功之后的提示
                uni.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 500
                })
                // 保存token
                uni.setStorageSync('my_token', res.data.token)
                // 跳转到首页
                uni.reLaunch({ url: '/pages/home/index' })
            } else {
                uni.showModal({
                    content: res.data.message, //提示的内容,
                    showCancel: false, //是否显示取消按钮,
                    confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                    confirmColor: '#ff8d44' //确定按钮的文字颜色
                })
            }
        }
    }
}