// src/routes/index.ts

import { Router, Express } from "express"
import { constant } from "../constant"
import { Knex } from "knex"
import { initEventStorage } from "../storage/EffectiveEvent"

function routes(ctx: Express): Router {
  const r = Router()
  const knex = ctx.get(constant.SIMP_SERVER_STORAGE) as Knex
  const storage = initEventStorage(knex)

  r.get("/getEvents", async function (req, res, next) {
    try {
      const query: Pagination = req.query
      const resp = await storage.queryEvents(query)
      res.status(200).send(resp)
    } catch (e) {
      next(e)
    }
  })

  r.post("/saveEvent", async function (req, res, next) {
    try {
      const body: EffectiveEventsDto = req.body
      const resp = await storage.saveEvent(body)
      res.status(200).send(resp)
    } catch (e) {
      next(e)
    }
  })

  r.post("/changeStatus", async function (req, res, next) {
    try {
      const body: Pick<EffectiveEventsDto, "id" | "status"> = req.body
      const resp = await storage.changeStatus(body)
      res.status(200).send(resp)
    } catch (e) {
      next(e)
    }
  })

  return r
}

export default routes
