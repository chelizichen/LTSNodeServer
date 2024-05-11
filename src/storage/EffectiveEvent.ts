import { Knex } from "knex"
import { eventStatus, tables } from "../constant"
import { dto2tableFields, dbRsu2Vo, FMT_DAY, Now } from "sgridnode/build/main"

export interface initEventStorageResp {
  saveEvent: (dto: EffectiveEventsDto) => Promise<unknown[]>
  queryEvents: (pagination: Pagination) => Promise<unknown>
  changeStatus: (
    body: Pick<
      EffectiveEventsDto,
      "id" | "status" | "realEndTime" | "realEventPay"
    >
  ) => Promise<number>
  deleteEvent: (
    body: Pick<EffectiveEventsDto, "id" | "status">
  ) => Promise<number>
}

export function initEventStorage(knex: Knex) {
  const tableName = tables.eff_event
  return {
    saveEvent: async function (dto: EffectiveEventsDto) {
      const pojo = dto2tableFields<EffectiveEventsPojo>(dto)
      pojo.create_time = FMT_DAY(pojo.create_time)
      pojo.end_time = FMT_DAY(pojo.end_time)
      pojo.start_time = FMT_DAY(pojo.start_time)
      pojo.real_end_time = FMT_DAY(pojo.real_end_time)
      const r = await knex.insert(pojo, ["id"]).into(tableName)
      return r
    },
    queryEvents: async function (pagination: Pagination) {
      console.log("pagination", pagination)
      const resp = await knex
        .select("*")
        .from(tableName)
        .where("title", "like", `%${pagination.keyword}%`)
        .where("status ", "!=", "-2")
        .offset(pagination.offset)
        .limit(pagination.size)
      console.log("resp", resp)
      const voResp = dbRsu2Vo(resp)
      return voResp
    },
    changeStatus: async function (
      body: Pick<
        EffectiveEventsDto,
        "id" | "status" | "realEndTime" | "realEventPay"
      >
    ) {
      const updateBody: Partial<EffectiveEventsPojo> = {
        status: body.status
      }
      if (
        [eventStatus.done, eventStatus.overTime].includes(Number(body.status))
      ) {
        updateBody.real_end_time = Now()
        updateBody.real_event_pay = body.realEventPay
      }
      console.log("updateBody", JSON.stringify(updateBody))
      return await knex(tableName).where("id", body.id).update(updateBody)
    },
    deleteEvent: async function (
      body: Pick<EffectiveEventsDto, "id" | "status">
    ) {
      const updateBody: Partial<EffectiveEventsPojo> = {
        status: body.status,
        id: body.id
      }
      console.log("updateBody", JSON.stringify(updateBody))
      const ret = await knex(tableName)
        .where("id", updateBody.id)
        .update(updateBody)
      return ret
    }
  }
}
