import path from "path"
import { initTables } from "./src/configuration/storage"
import EventController from "./src/routes/event"
import { errorHandler, loadStorage, targetHandler } from "./src/configuration"
import { NewSgridServerCtx, NewSgridServer } from "sgridnode/build/main"
import { f_env } from "sgridnode/build/lib/constant/index"

function boost() {
  const ctx = NewSgridServerCtx()

  // targetHandler
  ctx.use(targetHandler(ctx))
  loadStorage(ctx)

  const conf = ctx.get(f_env.ENV_SGRID_CONFIG) as SimpConf
  console.info("boost :: SgridConf ", conf)
  const servant = path.join("/", conf.server.name.toLowerCase())

  // initController
  const eventController = new EventController(ctx)
  ctx.use(servant, eventController.router!)
  // errorHandler
  ctx.use(errorHandler())

  // initTables
  initTables(ctx)

  // newServer
  NewSgridServer(ctx)
}

process.on("uncaughtException", (err) => {
  console.error(err)
})

process.on("unhandledRejection", (reason, p) => {
  console.error(reason, p)
})

boost()
