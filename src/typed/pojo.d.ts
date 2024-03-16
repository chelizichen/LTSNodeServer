interface EffectiveEventsPojo {
  id: number
  create_time: string
  end_time: string
  start_time: string
  real_end_time: string
  title: string
  content: string
  status: int
  createby_user_id: int
  target_user_id: int
  event_pay: string
  real_event_pay: string
}

interface usersPojo {
  createby_user_name: string
  target_user_name: string
}

interface UserPojo {
  id: number
  user_name: string
  create_time: string
  password: string
  level: number
}

interface CommentPojo {
  create_time: string
  id: number
  event_id: number
  status: number
  createby_user_id: number
  target_user_id: number
  content: string
}
