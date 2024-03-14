import { NewHttpServerCtx, NewSimpHttpServer } from "./lib"
import routes from "./routes"

const ctx = NewHttpServerCtx("simp.yaml")

ctx.use(routes)

NewSimpHttpServer(ctx)
