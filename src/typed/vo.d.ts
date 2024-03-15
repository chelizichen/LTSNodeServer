interface T_EffectiveEventsVo extends EffectiveEventsPojo {
  // join
  createby_user_name: string
  target_user_name: string
}

type EffectiveEventsVO = Camelize<T_EffectiveEventsVo>
