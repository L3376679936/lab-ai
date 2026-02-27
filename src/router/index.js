import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/Layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/components/introduction',
    children: [
      {
        path: '/components/introduction',
        name: 'Introduction',
        component: () => import('@/views/Home.vue'),
        meta: { title: '介绍' }
      },
      {
        path: '/components/labtable',
        name: 'LabTable',
        component: () => import('@/views/components/labTableDoc.vue'),
        meta: { title: 'LabTable 表格' }
      },
      {
        path: '/components/labform',
        name: 'LabForm',
        component: () => import('@/views/components/labFormDoc.vue'),
        meta: { title: 'LabForm 表单' }
      },
      {
        path: '/components/labchart',
        name: 'LabChart',
        component: () => import('@/views/components/labChartDoc.vue'),
        meta: { title: 'LabChart 图表' }
      },
      {
        path: '/components/labupload',
        name: 'LabUpload',
        component: () => import('@/views/components/labUploadDoc.vue'),
        meta: { title: 'LabUpload 上传' }
      },
      {
        path: '/components/labtable-page',
        name: 'LabTablePage',
        component: () => import('@/views/components/labTablePageDoc.vue'),
        meta: { title: 'LabTablePage 综合表格' }
      },
      {
        path: '/components/labtable-transfer',
        name: 'LabTableTransfer',
        component: () => import('@/views/components/labTableTransferDoc.vue'),
        meta: { title: 'LabTableTransfer 表格穿梭' }
      },
      {
        path: '/components/labqrcode',
        name: 'LabQRCode',
        component: () => import('@/views/components/labQRCodeDoc.vue'),
        meta: { title: 'LabQRCode 二维码' }
      },
      {
        path: '/components/labslice-frame',
        name: 'LabSliceFrame',
        component: () => import('@/views/components/labSliceFrameDoc.vue'),
        meta: { title: 'LabSliceFrame 九宫格容器' }
      },
      {
        path: '/components/labrichtext',
        name: 'LabRichText',
        component: () => import('@/views/components/labRichTextDoc.vue'),
        meta: { title: 'LabRichText 富文本' }
      },
      {
        path: '/components/labvideo',
        name: 'LabVideo',
        component: () => import('@/views/components/labVideoDoc.vue'),
        meta: { title: 'LabVideo 视频' }
      },
      {
        path: '/components/labfuzzy-select',
        name: 'LabFuzzySelect',
        component: () => import('@/views/components/LabFuzzySelectDoc.vue'),
        meta: { title: 'LabFuzzySelect 模糊查询' }
      },
      {
        path: '/components/labinput-new',
        name: 'LabInputNew',
        component: () => import('@/views/components/LabInputNewDoc.vue'),
        meta: { title: 'LabInputNew 快捷新增' }
      },
      {
        path: '/components/labip-input',
        name: 'LabIpInput',
        component: () => import('@/views/components/LabIpInputDoc.vue'),
        meta: { title: 'LabIpInput IP输入框' }
      },
      {
        path: '/components/labtext-roll',
        name: 'LabTextRoll',
        component: () => import('@/views/components/LabTextRollDoc.vue'),
        meta: { title: 'LabTextRoll 文字滚动' }
      },
      {
        path: '/components/labexcel-read',
        name: 'LabExcelRead',
        component: () => import('@/views/components/LabExcelReadDoc.vue'),
        meta: { title: 'LabExcelRead 表格读取' }
      },
      {
        path: '/components/directives',
        name: 'LabDirectiveDoc',
        component: () => import('@/views/components/LabDirectiveDoc.vue'),
        meta: { title: '自定义指令 Directives' }
      },
      {
        path: '/download',
        name: 'Download',
        component: () => import('@/views/Download.vue'),
        meta: { title: '下载' }
      },
      {
        path: '/download/directives',
        name: 'DownloadDirectives',
        component: () => import('@/views/DownloadDirectives.vue'),
        meta: { title: '下载指令' }
      }
    ]
  },
  {
    path: '*',
    name: 'Error404',
    component: () => import('@/views/Error404.vue'),
    meta: { title: '404 - 页面未找到' }
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: 'smooth'
      }
    }
    return { x: 0, y: 0 }
  }
})

export default router
