import axios, { AxiosInstance } from 'axios'
import { env } from '@/config/env'
import {
  HttpError,
  InternalServerError,
  ServiceErrorRespose
} from '@chatapp/common'
import { CreateUserInput, SearchUsersQuery } from '@/validations/user.schema'

export class UserProxyService {
  private readonly userHeader = {
    headers: {
      'x-internal-token': env.INTERNAL_API_TOKEN
    }
  }
  constructor(private readonly userClient: AxiosInstance) {}

  async userServiceHealth() {
    try {
      const response = await this.userClient.get('/health', this.userHeader)
      return response.data
    } catch (e) {
      return this.handleAxiosError(e)
    }
  }

  async userDatabaseServicehealth() {
    try {
      const response = await this.userClient.get('/health/db', this.userHeader)
      return response.data
    } catch (e) {
      return this.handleAxiosError(e)
    }
  }

  async userRabbitServiceHealth() {
    try {
      const response = await this.userClient.get(
        '/health/rabbit',
        this.userHeader
      )
      return response.data
    } catch (e) {
      return this.handleAxiosError(e)
    }
  }

  async getUserById(id: string) {
    try {
      const response = await this.userClient.get(
        `/users/${id}`,
        this.userHeader
      )
      return response.data
    } catch (e) {
      return this.handleAxiosError(e)
    }
  }

  async getAllUsers() {
    try {
      const response = await this.userClient.get('/users', this.userHeader)
      return response.data
    } catch (e) {
      return this.handleAxiosError(e)
    }
  }

  async searchUsers(query: SearchUsersQuery) {
    try {
      const response = await this.userClient.get('/users/search', {
        headers: this.userHeader.headers,
        params: {
          query: query.query,
          ...(query.limit ? { limit: query.limit } : {}),
          ...(query.exclude && query.exclude.length > 0
            ? { exclude: query.exclude }
            : {})
        }
      })
      return response.data
    } catch (e) {
      return this.handleAxiosError(e)
    }
  }

  async createUser(payload: CreateUserInput) {
    try {
      const response = await this.userClient.post(
        '/users',
        payload,
        this.userHeader
      )
      return response.data
    } catch (e) {
      return this.handleAxiosError(e)
    }
  }

  private resolvedMessage = (status: number, data: unknown): string => {
    if (typeof data === 'object' && data && 'message' in data) {
      const message = (data as Record<string, unknown>).message
      if (typeof message === 'string' && message.trim().length > 0) {
        return message
      }
    }

    return status >= 500
      ? 'User service is unavailable'
      : 'An error occurred while processing the request'
  }

  private isServiceErrorResponse(data: unknown): data is ServiceErrorRespose {
    return (
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      'errorcode' in data
    )
  }

  private handleAxiosError = (error: unknown): never => {
    if (!axios.isAxiosError(error) || !error.response) {
      throw new InternalServerError('User service is unavailable')
    }

    const { status, data } = error.response as {
      status: number
      data: unknown
    }

    if (this.isServiceErrorResponse(data)) {
      throw new HttpError(status, data.message, data.errorCode)
    }

    throw new HttpError(status, this.resolvedMessage(status, data))
  }
}
