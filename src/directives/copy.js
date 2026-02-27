const copyDirective = {
  bind(el, { value }, vnode) {
    el.$value = value
    el.handler = () => {
      if (!el.$value) {
        if (vnode.context.$message) vnode.context.$message.warning('无复制内容')
        return
      }
      
      const success = (val) => {
        if (vnode.context.$message) {
          vnode.context.$message.success('复制成功: ' + val)
        } else {
          console.log('复制成功:', val)
        }
      }

      // 优先使用 Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(el.$value).then(() => {
          success(el.$value)
        }).catch(err => {
          console.error('Clipboard API 失败，尝试 fallback:', err)
          fallbackCopy(el.$value, success)
        })
      } else {
        fallbackCopy(el.$value, success)
      }
    }

    function fallbackCopy(text, callback) {
      const textarea = document.createElement('textarea')
      textarea.readOnly = 'readonly'
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      const result = document.execCommand('Copy')
      if (result) callback(text)
      document.body.removeChild(textarea)
    }

    el.addEventListener('click', el.handler)
  },
  componentUpdated(el, { value }) {
    el.$value = value
  },
  unbind(el) {
    el.removeEventListener('click', el.handler)
  },
}

export default copyDirective
