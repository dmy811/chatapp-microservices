import {
  USER_EVENTS_EXCHANGE,
  USER_CREATED_ROUTING_KEY,
  UserCreatedPayload
} from '@chatapp/common'

import { publish } from '../rabbit-publisher'
import { logger } from '@/utils/logger'

export const publishUserCreated = async (payload: UserCreatedPayload) => {
  await publish<UserCreatedPayload>({
    exchange: USER_EVENTS_EXCHANGE,
    routingKey: USER_CREATED_ROUTING_KEY,
    message: payload
  })
  logger.info('Publishing a message to rabbit', payload)
}
