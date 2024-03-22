type EffectiveEventsDto = Camelize<EffectiveEventsPojo>

interface Token {
  token: string
}

type UserDto = Camelize<UserPojo & Token>

type CommentDto = Camelize<CommentPojo>
