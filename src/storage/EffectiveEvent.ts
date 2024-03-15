import { Knex } from "knex"
import { tables } from "../constant"
import { dbRsu2Vo, dto2tableFields } from "../lib/utils"

export function initEventStorage(knex: Knex) {
  const tableName = tables.eff_event
  return {
    saveEvent: function (dto: Camelize<EffectiveEventsDto>) {
      const pojo = dto2tableFields<EffectiveEventsPojo>(dto)
      return knex.insert(pojo, ["id"]).into(tableName)
    },
    queryEvents: async function (pagination: Pagination) {
      const resp = await knex
        .select("*")
        .from(tableName)
        .where("title", "like", `%${pagination.keyword}%`)
        .offset(pagination.offset)
        .limit(pagination.size)

      const voResp = dbRsu2Vo(resp)
      return voResp
    },
    changeStatus: async function (
      body: Pick<EffectiveEventsDto, "id" | "status">
    ) {
      return knex(tableName).where("id", body.id).update({
        status: body.status
      })
    }
  }
}
