/**
 * Lab-AI 指令源码库
 * 用于下载功能，提供各指令的纯文本代码
 */

export const directiveSource = {
  // 1. 复制指令
  copy: `const copyDirective = {
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
export default copyDirective`,

  // 2. 防抖指令
  debounce: `const debounce = {
  inserted: function (el, binding) {
    const { fn, event, time, args = [] } = binding.value
    if (typeof fn !== 'function') return
    el._timer = null
    el.addEventListener(event, () => {
      if (el._timer !== null) {
        clearTimeout(el._timer)
        el._timer = null
      }
      el._timer = setTimeout(() => {
        fn(...args)
      }, time)
    })
  },
}
export default debounce`,

  // 3. 节流指令
  throttle: `export default {
  bind(el, bindingObj) {
    let flag, timer;
    const [fn, time = 300, attr = 'click', ...args] = bindingObj.value;
    
    el.addEventListener(attr, (event) => {
      if (flag) {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), time);
        return false;
      }
      fn(...args);
      flag = setTimeout(() => flag = null, time);
    });
  }
}`,

  // 4. 水印指令
  waterMarker: `export default {
  bind(el, binding) {
    const { text, font, textColor } = binding.value
    const canvas = document.createElement('canvas')
    el.appendChild(canvas)
    canvas.width = 200
    canvas.height = 150
    canvas.style.display = 'none'
    const imgs = canvas.getContext('2d')
    imgs.rotate((-20 * Math.PI) / 180)
    imgs.font = font || '16px Microsoft JhengHei'
    imgs.fillStyle = textColor || 'rgba(180, 180, 180, 0.3)'
    imgs.textAlign = 'left'
    imgs.textBaseline = 'Middle'
    imgs.fillText(text, canvas.width / 10, canvas.height / 2)
    el.style.backgroundImage = 'url(' + canvas.toDataURL('image/png') + ')'
  },
}`,

  // 5. 点击外部
  clickOutside: `const nodeList = [];
const ctx = '@@clickoutsideContext';
let seed = 0;
let startClick;

function createDocumentHandler(el, binding, vnode) {
  return function(mouseup = {}, mousedown = {}) {
    if (!vnode || !vnode.context || !mouseup.target || !mousedown.target ||
      el.contains(mouseup.target) || el.contains(mousedown.target) || el === mouseup.target ||
      (vnode.context.popperElm &&
      (vnode.context.popperElm.contains(mouseup.target) ||
      vnode.context.popperElm.contains(mousedown.target)))) return;

    if (binding.expression && el[ctx].methodName && vnode.context[el[ctx].methodName]) {
      vnode.context[el[ctx].methodName]();
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  };
}

document.addEventListener('mousedown', e => (startClick = e));
document.addEventListener('mouseup', e => {
  nodeList.forEach(node => node[ctx].documentHandler(e, startClick));
});

export default {
  bind(el, binding, vnode) {
    nodeList.push(el);
    const id = seed++;
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value
    };
  },
  update(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
    el[ctx].methodName = binding.expression;
    el[ctx].bindingFn = binding.value;
  },
  unbind(el) {
    let len = nodeList.length;
    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }
    delete el[ctx];
  }
}`,

  // 6. 水波纹
  waves: `const css = \`.wavesRipple { position: absolute; border-radius: 100%; background-color: rgba(0, 0, 0, 0.15); pointer-events: none; transform: scale(0); opacity: 1; } .wavesRipple.live { animation: ripple 0.6s ease-out; } @keyframes ripple { to { transform: scale(2.5); opacity: 0; } }\`
const style = document.createElement('style')
style.type = 'text/css'
style.appendChild(document.createTextNode(css))
document.head.appendChild(style)

export default {
  bind(el, binding) {
    el.waveFn = (e) => {
      const target = el
      if (target) {
        target.style.position = "relative"
        target.style.overflow = "hidden"
        const rect = target.getBoundingClientRect()
        let ripple = target.querySelector(".wavesRipple")
        if (!ripple) {
          ripple = document.createElement("span")
          ripple.className = "wavesRipple"
          ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + "px"
          target.appendChild(ripple)
        }
        ripple.className = "wavesRipple"
        ripple.style.top = (e.pageY - rect.top - ripple.offsetHeight / 2 - (document.documentElement.scrollTop || document.body.scrollTop)) + "px"
        ripple.style.left = (e.pageX - rect.left - ripple.offsetWidth / 2 - (document.documentElement.scrollLeft || document.body.scrollLeft)) + "px"
        ripple.style.backgroundColor = binding.value
        ripple.className = "wavesRipple live"
      }
    }
    el.addEventListener("click", el.waveFn, false)
  },
  unbind(el) { el.removeEventListener('click', el.waveFn) }
}`,

  // 7. 文本省略
  ellipsis: `let tooltipDom;
function bindEvent(el, bindings) {
  el.removeEventListener("mouseenter", handleMouseEnter);
  el.removeEventListener("mouseleave", removeTooltip);
  if (bindings.value === false) return;
  if (bindings.value) {
    el.style.display = "-webkit-box";
    el.style.webkitBoxOrient = "vertical";
    el.style.webkitLineClamp = bindings.value;
  } else {
    el.style.textOverflow = "ellipsis";
    el.style.whiteSpace = "nowrap";
  }
  el.style.overflow = "hidden";
  if (el.scrollWidth > el.offsetWidth || el.scrollHeight > el.offsetHeight) {
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", removeTooltip);
  }
}
function handleMouseEnter(e) {
  if (!tooltipDom) {
    tooltipDom = document.createElement("div");
    document.body.appendChild(tooltipDom);
  }
  const maxWidth = 600;
  let cssText = "max-width: " + maxWidth + "px; overflow: auto; position: fixed; background: #262627; color: #fff; border-radius: 4px; line-height: 20px; padding: 10px; display: block; font-size: 12px; z-index: 99999; word-break: break-all;";
  if (window.innerWidth - e.clientX < maxWidth) cssText += "right:" + (window.innerWidth - e.clientX) + "px;";
  else cssText += "left:" + (e.clientX + 20) + "px;";
  if (window.innerHeight - e.clientY < 600) cssText += "bottom:" + (window.innerHeight - e.clientY) + "px;";
  else cssText += "top:" + e.clientY + "px;";
  tooltipDom.style.cssText = cssText;
  tooltipDom.innerHTML = e.currentTarget.innerText;
}
function removeTooltip() { if (tooltipDom) tooltipDom.style.display = "none"; }
export default {
  inserted: (el, bindings) => bindEvent(el, bindings),
  componentUpdated: (el, bindings) => bindEvent(el, bindings),
  unbind: () => removeTooltip(),
}`,

  // 8. 图片懒加载
  lazyload: `const loadimage = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
const errorimage = 'data:image/gif;base64,R0lGODlhAQABAIAAAP8AAAD/ACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='
export default {
  inserted(el, binding) {
    el.src = loadimage
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        el.src = binding.value
        el.onerror = () => { el.src = errorimage }
        observer.unobserve(el)
      }
    })
    observer.observe(el)
  },
}`,

  // 9. 渐进式图片加载
  progressiveImg: `const loadImage = (el, binding, isInitial = false) => {
  const { value } = binding
  if (!value) return
  el._loadingUrl = value
  el.style.transition = 'filter 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s, opacity 0.6s'
  el.style.filter = 'blur(12px)'
  el.style.transform = 'translateZ(0) scale(1.05)'
  if (isInitial) el.style.opacity = '0.4'
  const img = new Image()
  img.src = value
  img.onload = () => {
    if (el._loadingUrl !== value) return
    if (el.tagName === 'IMG') el.src = value
    else el.style.backgroundImage = \`url(\${value})\`
    el.style.filter = 'blur(0)'
    el.style.transform = 'translateZ(0) scale(1)'
    el.style.opacity = '1'
  }
}
export default {
  bind(el, binding) {
    el.style.willChange = 'filter, transform, opacity'
    el.style.backfaceVisibility = 'hidden'
    loadImage(el, binding, true)
  },
  update(el, binding) {
    if (binding.value !== binding.oldValue) loadImage(el, binding, false)
  }
}`,

  // 10. 热键指令 (简化版实现)
  hotkey: `export default {
  bind(el, binding) {
    const map = binding.value
    el._handler = (e) => {
      for (const key in map) {
        const keys = key.toLowerCase().split('+')
        const ctrl = keys.includes('ctrl')
        const shift = keys.includes('shift')
        const alt = keys.includes('alt')
        const actualKey = keys.filter(k => !['ctrl', 'shift', 'alt'].includes(k))[0]
        
        if (
          e.key.toLowerCase() === actualKey &&
          e.ctrlKey === ctrl &&
          e.shiftKey === shift &&
          e.altKey === alt
        ) {
          map[key](e)
        }
      }
    }
    el.addEventListener('keydown', el._handler)
  },
  unbind(el) {
    el.removeEventListener('keydown', el._handler)
  }
}`
}
