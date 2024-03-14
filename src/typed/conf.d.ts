interface SimpConf {
  server: {
    name: string
    port: number
    type: string
    staticPath: string
    storage: string
  }
}

// 路由配置接口
interface RouterConf {
  path: string
  router: Router
  meta?: unknown
}
