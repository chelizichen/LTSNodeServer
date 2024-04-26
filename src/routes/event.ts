// src/routes/index.ts

import e, { Router, Express, NextFunction, Request, Response } from "express"
import { constant } from "../constant"
import { Knex } from "knex"
import {
  initEventStorage,
  initEventStorageResp
} from "../storage/EffectiveEvent"
import { Now, Resp } from "../lib/utils"
import {
  changeStatusValidate,
  saveEventValidate,
  paginationValidate
} from "../validate"
import { validateMiddleWare } from "../configuration"
import { initCommentStorage, initCommentStorageResp } from "../storage/Comment"
import { Controller, Get, Post, PreHandle } from "../lib/utils/h"

@Controller("/event")
class EventController {
  public ctx: Express
  public router: Router | undefined
  public eventStorage: initEventStorageResp
  public commentStorage: initCommentStorageResp
  constructor(ctx: Express) {
    this.ctx = ctx
    const knex = ctx.get(constant.SGRID_DATABASE) as Knex
    this.eventStorage = initEventStorage(knex)
    this.commentStorage = initCommentStorage(knex)
  }

  @Get("/getEvents")
  @PreHandle([paginationValidate])
  getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const query: Pagination = req.query as unknown as Pagination
      this.eventStorage
        .queryEvents(query)
        .then((resp) => {
          return res.status(200).json(Resp.Ok(resp))
        })
        .catch((e) => {
          console.log("e", e)
          return res.status(200).json(Resp.Error(-1, "getEvents", e))
        })
    } catch (e) {
      next(e)
    }
  }

  @Post("/saveEvent")
  @PreHandle([saveEventValidate, validateMiddleWare])
  saveEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const body: EffectiveEventsDto = req.body
      this.eventStorage
        .saveEvent(body)
        .then((resp) => {
          return res.status(200).json(Resp.Ok(resp))
        })
        .catch((e) => {
          return res.status(200).json(Resp.Error(-1, "saveError", e))
        })
    } catch (e) {
      next(e)
    }
  }

  @Post("/deleteEvent")
  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.body as unknown as Pick<EffectiveEventsDto, "id">
      const body = {
        id: query.id,
        status: "-2"
      }
      const resp = await this.eventStorage.deleteEvent(body)
      res.status(200).json(Resp.Ok(resp))
    } catch (error) {
      next(e)
    }
  }

  @Post("/changeStatus")
  @PreHandle([changeStatusValidate, validateMiddleWare])
  async changeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const body: Pick<
        EffectiveEventsDto,
        "id" | "status" | "realEndTime" | "realEventPay" | "content"
      > = req.body
      const comment: Omit<CommentDto, "id"> = {
        content: body.content,
        eventId: body.id,
        status: body.status,
        targetUserId: 0,
        createbyUserId: 0,
        createTime: Now()
      }
      const saveCommentResp = await this.commentStorage.saveComment(comment)
      console.log("saveCommentResp", saveCommentResp)
      const resp = await this.eventStorage.changeStatus(body)
      res.status(200).json(Resp.Ok(resp))
    } catch (e) {
      next(e)
    }
  }

  @Get("/getCommentsByEventId")
  async getCommentsByEventId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query
      const data = await this.commentStorage.getCommentsByEventId(id as string)
      res.json(Resp.Ok(data))
    } catch (e) {
      next(e)
    }
  }
}

export default EventController
