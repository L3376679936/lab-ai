
// 1x1 灰色占位图
const loadimage = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
const errorimage = 'data:image/gif;base64,R0lGODlhAQABAIAAAP8AAAD/ACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='

export default {
    inserted(el, binding) {
        const url = binding.value
        if (!url) return

        // 设置初始占位图
        el.src = loadimage
        el.style.backgroundColor = '#f0f2f5'
        el.style.transition = 'all 0.5s'
        
        console.log('[Lazyload] 正在观察元素:', el, '预期地址:', url)

        const loadRealImg = () => {
            if (el.getAttribute('data-loaded')) return
            const tempImg = new Image()
            tempImg.src = url
            tempImg.onload = () => {
                el.src = url
                el.style.backgroundColor = 'transparent'
                el.setAttribute('data-loaded', 'true')
                console.log('[Lazyload] 加载成功:', url)
            }
            tempImg.onerror = () => {
                el.src = errorimage
                console.log('[Lazyload] 加载失败:', url)
            }
            if (el._observer) el._observer.unobserve(el)
        }

        // 增加手动触发机制 (点击图片即可触发)
        el.onclick = () => {
            console.log('[Lazyload] 手动触发加载...')
            loadRealImg()
        }

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0]
            // 调试日志：输出当前交叉状态
            console.log('[Lazyload] 观察器状态变更 - isIntersecting:', entry.isIntersecting, 'ratio:', entry.intersectionRatio)
            
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
                console.log('[Lazyload] 触发自动加载')
                loadRealImg()
            }
        }, {
            rootMargin: '100px', // 提前 100px 开始加载
            threshold: [0, 0.01]  // 极小比例触发
        })

        el._observer = observer
        observer.observe(el)
    }
}