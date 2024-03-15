import { Express } from "express"
import { constant, tables } from "../constant"
import { Knex } from "knex"
// 初始化创建表
export function initTables(ctx: Express) {
  const tableName = tables.eff_event
  const knext = ctx.get(constant.SIMP_SERVER_STORAGE) as Knex
  knext.schema.hasTable(tableName).then((has) => {
    console.log("has", has)
    if (has) {
      return
    }
    knext.schema
      .createTable(tableName, function (tableBuilder: Knex.CreateTableBuilder) {
        tableBuilder.bigIncrements("id").primary().notNullable()
        tableBuilder.dateTime("create_time").notNullable()
        tableBuilder.dateTime("end_time").notNullable()
        tableBuilder.dateTime("start_time").nullable()
        tableBuilder.dateTime("real_end_time").nullable()
        tableBuilder.string("title", 255).notNullable()
        tableBuilder.string("content", 255).nullable()
        tableBuilder.integer("status").notNullable().defaultTo(0)
        tableBuilder.integer("createby_user_id").notNullable()
        tableBuilder.integer("target_user_id").notNullable()
        tableBuilder.decimal("real_event_pay").nullable()
        tableBuilder.decimal("event_pay").nullable()
        console.log("done")
      })
      .catch((err) => {
        console.log("err", err)
      })
  })
}
