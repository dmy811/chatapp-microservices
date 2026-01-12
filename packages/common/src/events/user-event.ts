import { EventPayload, OutBoundEvent } from './event-types'

export const USER_EVENTS_EXCHANGE = 'user.events'
export const USER_CREATED_ROUTING_KEY = 'user.created'

export interface UserCreatedPayload extends EventPayload {
  id: string
  email: string
  displayName: string
  createdAt: string
  updatedAt: string
}

export type UserCreatedEvent = OutBoundEvent<
  typeof USER_CREATED_ROUTING_KEY,
  UserCreatedPayload
>

// {
//   type: string
//   payload: {
//       id: string
//       email: string
//       displayName: string
//       createdAt: string
//       updatedAt: string
//   }
//   occurredAt: string
//   metadata: {
//       correlationId?: string
//       causationId?: string
//       version?: string
//   }
// }
