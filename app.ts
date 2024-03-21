import path from "path"
import { initTables } from "./src/configuration/storage"
import { constant } from "./src/constant"
import { NewHttpServerCtx, NewSimpHttpServer } from "./src/lib"
import events from "./src/routes/event"
import { errorHandler, targetHandler } from "./src/configuration"
import { initSchedule } from "./src/schedule"

const ctx = NewHttpServerCtx("simp.yaml")
ctx.use(targetHandler(ctx))
const conf = ctx.get(constant.SIMP_SERVER_CONF) as SimpConf["server"]
const servant = path.join("/", conf.name.toLowerCase())
ctx.use(servant, events(ctx))
// 错误处理中间件
ctx.use(errorHandler())
initTables(ctx)
NewSimpHttpServer(ctx)
initSchedule()
process.on("uncaughtException", (err) => {
  console.error(err)
})

process.on("unhandledRejection", (reason, p) => {
  console.error(reason, p)
})
