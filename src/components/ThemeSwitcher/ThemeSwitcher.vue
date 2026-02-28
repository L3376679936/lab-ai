<template>
  <div class="theme-switcher">
    <!-- 移动端：图标模式，两个图标分别点击切换 -->
    <template v-if="isMobile">
      <span
        class="theme-icon-btn"
        :class="{ active: !isTech }"
        title="亮色主题"
        @click="setTheme('normal')"
      ><i class="el-icon-sunny"></i></span>
      <el-switch
        v-model="isTech"
        active-color="#00d9ff"
        inactive-color="#409EFF"
        class="icon-switch"
        @change="handleThemeChange"
      />
      <span
        class="theme-icon-btn"
        :class="{ active: isTech }"
        title="暗色主题"
        @click="setTheme('tech')"
      ><i class="el-icon-moon"></i></span>
    </template>

    <!-- 桌面端：带文字 Switch -->
    <template v-else>
      <el-switch
        v-model="isTech"
        active-text="暗色主题"
        inactive-text="亮色主题"
        active-color="#00d9ff"
        inactive-color="#409EFF"
        @change="handleThemeChange"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'ThemeSwitcher',
  data() {
    return {
      windowWidth: window.innerWidth
    }
  },
  computed: {
    isMobile() {
      return this.windowWidth < 768
    },
    isTech: {
      get() {
        return this.$store.state.theme === 'tech'
      },
      set() {
        // 由 handleThemeChange 处理
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
    },
    handleThemeChange(val) {
      this.$store.commit('SET_THEME', val ? 'tech' : 'normal')
    },
    setTheme(theme) {
      this.$store.commit('SET_THEME', theme)
    }
  }
}
</script>

<style lang="scss" scoped>
.theme-switcher {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  /* 移动端图标按钮 */
  .theme-icon-btn {
    font-size: 18px;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.2s, transform 0.2s;
    line-height: 1;
    user-select: none;

    &.active {
      opacity: 1;
      transform: scale(1.2);
    }

    &:hover {
      opacity: 0.9;
    }
  }

  /* 图标模式下 switch 更紧凑 */
  .icon-switch {
    transform: scale(0.85);
  }
}
</style>
