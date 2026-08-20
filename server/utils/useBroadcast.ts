import Redis from 'ioredis'

const { redis: { port, host } } = useRuntimeConfig()

const redis = new Redis(port, host)
const redisSub = new Redis(port, host)

export function useBroadcast() {
  return {
    redis,
    redisSub,
    publish(event: string, data: unknown) {
      redis.publish('@all', JSON.stringify({ event, data }))
    },
  }
}
