import { Channel, ConsumeMessage } from 'amqplib'
import { getRabbitChannel } from '@/utils/rabbitmq'
import { logger } from '@/utils/logger'

async function ensureExchange(channel: Channel, exchange)

export const consumer = async <T>({
  exchange,
  queue,
  routingKey,
  handler
}: {
  exchange: string
  queue: string
  routingKey: string
  handler: (event: T) => Promise<void>
}) => {}
