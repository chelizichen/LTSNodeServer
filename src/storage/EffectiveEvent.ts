import { Knex } from "knex"
import { tables } from "../constant"
import { FMT_DAY, dbRsu2Vo, dto2tableFields } from "../lib/utils"

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
        .offset(pagination.offset)
        .limit(pagination.size)
      console.log("resp", resp)

      const voResp = dbRsu2Vo(resp)
      return voResp
    },
    changeStatus: async function (
      body: Pick<EffectiveEventsDto, "id" | "status">
    ) {
      return await knex(tableName).where("id", body.id).update({
        status: body.status
      })
    }
  }
}
