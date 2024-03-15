import { Knex } from "knex"
import { tables } from "../constant"
import { dbRsu2Vo, dto2tableFields } from "../lib/utils"

export function initEventStorage(knex: Knex) {
  const tableName = tables.eff_event
  return {
    saveEvent: async function (dto: Camelize<EffectiveEventsDto>) {
      const pojo = dto2tableFields<EffectiveEventsPojo>(dto)
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
