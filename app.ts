import { NewHttpServerCtx, NewSimpHttpServer } from "./src/lib"
import routes from "./src/routes"

const ctx = NewHttpServerCtx("simp.yaml")

ctx.use(routes)

NewSimpHttpServer(ctx)

process.on("uncaughtException", (err) => {
  console.error(err)
})

process.on("unhandledRejection", (reason, p) => {
  console.error(reason, p)
})
