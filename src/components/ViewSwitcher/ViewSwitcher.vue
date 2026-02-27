<template>
  <div class="view-switcher" @click="toggleMode" :title="tooltipText">
    <div class="switch-track" :class="{ 'is-scroll': isScroll }">
      <div class="switch-handle">
        <i :class="iconClass"></i>
      </div>
    </div>
    <span class="label">{{ labelText }}</span>
  </div>
</template>

<script>
export default {
  name: 'ViewSwitcher',
  computed: {
    isScroll() {
      return this.$store.state.viewMode === 'scroll'
    },
    iconClass() {
      return this.isScroll ? 'el-icon-document' : 'el-icon-monitor'
    },
    labelText() {
      return this.isScroll ? '文档视图' : '分页视图'
    },
    tooltipText() {
      return this.isScroll ? '点击切换为分页路由模式' : '点击切换为单页滚动模式'
    }
  },
  methods: {
    toggleMode() {
      this.$store.dispatch('toggleViewMode')
    }
  }
}
</script>

<style lang="scss" scoped>
.view-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  color: var(--text-secondary);
  transition: color 0.3s;
  
  &:hover {
    color: var(--primary-color);
  }
  
  .switch-track {
    width: 40px;
    height: 20px;
    background-color: rgba(0,0,0,0.1);
    border-radius: 10px;
    position: relative;
    transition: background-color 0.3s;
    border: 1px solid var(--border-color);
    
    &.is-scroll {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
      
      .switch-handle {
        transform: translateX(20px);
        background-color: #fff;
        color: var(--primary-color);
      }
    }
    
    .switch-handle {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: var(--text-secondary);
      color: #fff;
      position: absolute;
      top: 1px;
      left: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
      
      i {
        font-size: 10px;
      }
    }
  }
}
</style>
