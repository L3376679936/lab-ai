const loadImage = (el, binding, isInitial = false) => {
  const { value } = binding
  if (!value) return

  // 1. 记录加载目标，防止竞态
  el._loadingUrl = value

  // 2. 应用初始渲染状态（模糊+轻微放大以遮盖滤镜边缘抖动）
  // 如果是第一次加载，模糊度更高；如果是更新，保持现有图并叠加模糊
  el.style.transition = 'filter 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s, opacity 0.6s'
  el.style.filter = 'blur(12px)'
  el.style.transform = 'translateZ(0) scale(1.05)' // 关键：硬件加速+比例遮罩
  if (isInitial) {
    el.style.opacity = '0.4'
  }

  const img = new Image()
  img.src = value

  img.onload = () => {
    // 检查是否还是最新的请求
    if (el._loadingUrl !== value) return

    // 3. 只有当新图准备好了，才进行替换
    if (el.tagName === 'IMG') {
      el.src = value
    } else {
      el.style.backgroundImage = `url(${value})`
    }
    
    // 渐进式呈现：消除模糊并恢复比例
    el.style.filter = 'blur(0)'
    el.style.transform = 'translateZ(0) scale(1)'
    el.style.opacity = '1'
  }

  img.onerror = () => {
    if (el._loadingUrl !== value) return
    el.style.filter = 'blur(0)'
    el.style.transform = 'translateZ(0) scale(1)'
    el.style.opacity = '1'
  }
}

export default {
  bind(el, binding) {
    // 基础固定样式
    el.style.willChange = 'filter, transform, opacity'
    el.style.backfaceVisibility = 'hidden'
    loadImage(el, binding, true)
  },
  update(el, binding) {
    if (binding.value !== binding.oldValue) {
      loadImage(el, binding, false)
    }
  }
}
