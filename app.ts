import path from "path"
import { initTables } from "./src/configuration/storage"
import { constant } from "./src/constant"
import { NewHttpServerCtx, NewSimpHttpServer } from "./src/lib"
import routes from "./src/routes"

const ctx = NewHttpServerCtx("simp.yaml")

const conf = ctx.get(constant.SIMP_SERVER_CONF) as SimpConf["server"]
const servant = path.join("/", conf.name.toLowerCase())

ctx.use(servant, routes())

initTables(ctx)

NewSimpHttpServer(ctx)

process.on("uncaughtException", (err) => {
  console.error(err)
})

process.on("unhandledRejection", (reason, p) => {
  console.error(reason, p)
})
