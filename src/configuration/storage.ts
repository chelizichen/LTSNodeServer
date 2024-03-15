import { Express } from "express"
import { constant, tables } from "../constant"
import { Knex } from "knex"

// 初始化创建表
export function initTables(ctx: Express) {
  const tableName = tables.eff_event
  const knext = ctx.get(constant.SIMP_SERVER_STORAGE) as Knex
  knext.schema.hasTable(tableName).then((exist) => {
    console.log("table ", tableName, " exist ", exist)
    if (exist) {
      return
    }
    knext.schema
      .createTable(tableName, function (tableBuilder: Knex.CreateTableBuilder) {
        tableBuilder.dateTime("create_time").notNullable()
        tableBuilder.bigIncrements("id").primary().notNullable()
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

  const effEveComment = tables.eff_eve_comment
  knext.schema.hasTable(effEveComment).then((exist) => {
    console.log("table ", effEveComment, " exist ", exist)
    if (exist) {
      return
    }
    knext.schema
      .createTable(effEveComment, function (tableBuilder: Knex.TableBuilder) {
        tableBuilder.dateTime("create_time").notNullable()
        tableBuilder.bigIncrements("id").primary().notNullable()
        tableBuilder.bigint("event_id").notNullable()
        tableBuilder.integer("status").notNullable().defaultTo(0)
        tableBuilder.integer("createby_user_id").notNullable()
        tableBuilder.integer("target_user_id").notNullable()
        tableBuilder.text("content").notNullable()
      })
      .catch((err) => {
        console.log("err", err)
      })
  })
}
