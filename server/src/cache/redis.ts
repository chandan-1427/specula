/**
 * Redis client wrapper and helper utilities.
 *
 * Maintains a singleton client with retry logic, exposes safe cache
 * helpers and a subscriber instance for pub/sub channels.
 */
import { createClient } from 'redis'
import type { RedisClientType } from 'redis'
import { env } from '../config/env.js'

let redis: RedisClientType

declare global {
  var _redis: RedisClientType | undefined
}

// Client Configuration
if (!global._redis) {
  global._redis = createClient({
    url: env.REDIS_URL,
    socket: {
      // simple exponential backoff reconnect strategy
      reconnectStrategy: (retries) => {
        // log each attempt
        console.warn(`Redis disconnected, retry #${retries}`)
        return Math.min(retries * 100, 3000)
      }
    }
  })

  // handle errors without crashing the process
  global._redis.on('error', (err) => {
    // treat connection refused as a warning
    if (err.message.includes('ECONNREFUSED')) {
      console.warn('Redis connection refused (is Redis running?)')
    } else {
      console.error('Redis client error:', err)
    }
  })

  global._redis.on('connect', () => console.log('Redis connecting...'))
  global._redis.on('ready', () => console.log('Redis connected successfully'))
}

redis = global._redis as RedisClientType

// Explicit Connection Management (Exported Functions)
export const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect()
  }
}

export const disconnectRedis = async () => {
  if (redis.isOpen) {
    await redis.quit()
    console.log('Redis connection closed.')
  }
}

export { redis }

// Safe Cache Helpers
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      if (!data) return null
      
      // Safety: Handle corrupt JSON
      return JSON.parse(data) as T
    } catch (err) {
      console.error(`❌ Redis Parse Error for key "${key}":`, err)
      return null // Return null instead of crashing
    }
  },

  async set(key: string, value: any, ttlSeconds?: number) {
    try {
      const stringified = JSON.stringify(value)
      if (ttlSeconds) {
        await redis.set(key, stringified, { EX: ttlSeconds })
      } else {
        await redis.set(key, stringified)
      }
    } catch (err) {
      console.error(`❌ Redis Set Error for key "${key}":`, err)
    }
  },

  async del(key: string) {
    try {
      await redis.del(key)
    } catch (err) {
      console.error(`❌ Redis Del Error for key "${key}":`, err)
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key)
      return result === 1
    } catch (err) {
      console.error(`❌ Redis Exists Error for key "${key}":`, err)
      return false
    }
  }
}

// subscriber client used for pub/sub (inherits connection settings)
export const redisSubscriber = redis.duplicate();

// Important: The subscriber needs its own error handler and connection management
redisSubscriber.on('error', (err) => {
  console.error('Redis subscriber error:', err);
});

redisSubscriber.on('ready', () => console.log('Redis subscriber ready'));

/**
 * Helper to ensure both clients are connected
 */
export const connectAllRedis = async () => {
  if (!redis.isOpen) await redis.connect();
  if (!redisSubscriber.isOpen) await redisSubscriber.connect();
};

export const disconnectAllRedis = async () => {
  if (redis.isOpen) await redis.quit();
  if (redisSubscriber.isOpen) await redisSubscriber.quit();
};
