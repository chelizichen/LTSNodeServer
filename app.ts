import path from "path"
import { initTables } from "./src/configuration/storage"
import { constant } from "./src/constant"
import { NewSgridServerCtx, NewSgridServer } from "./src/lib"
import EventController from "./src/routes/event"
import { errorHandler, loadStorage, targetHandler } from "./src/configuration"

function boost() {
  const ctx = NewSgridServerCtx()

  // targetHandler
  ctx.use(targetHandler(ctx))
  loadStorage(ctx)

  const conf = ctx.get(constant.SGRID_SERVER_CONF) as SimpConf
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
