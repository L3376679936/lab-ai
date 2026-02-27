<template>
  <div class="theme-switcher">
    <el-switch
      v-model="isTech"
      active-text="暗色主题"
      inactive-text="亮色主题"
      active-color="#00d9ff"
      inactive-color="#409EFF"
      @change="handleThemeChange"
    >
    </el-switch>
  </div>
</template>

<script>
export default {
  name: 'ThemeSwitcher',
  computed: {
    isTech: {
      get() {
        return this.$store.state.theme === 'tech'
      },
      set(val) {
        // 这一步由 handleThemeChange 处理，这里只需返回状态
      }
    }
  },
  methods: {
    handleThemeChange(val) {
      const theme = val ? 'tech' : 'normal'
      this.$store.commit('SET_THEME', theme)
    }
  }
}
</script>

<style lang="scss" scoped>
.theme-switcher {
  display: inline-block;
}
</style>
