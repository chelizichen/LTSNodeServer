import { NewHttpServerCtx, NewSimpHttpServer } from "./lib"
import routes from "./routes"

const ctx = NewHttpServerCtx("simp.yaml")

ctx.use(routes)

NewSimpHttpServer(ctx)

process.on("uncaughtException", (err) => {
  console.error(err)
})

process.on("unhandledRejection", (reason, p) => {
  console.error(reason, p)
})
