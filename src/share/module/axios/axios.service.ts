import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

import { BadRequestException } from '@exception/bad-request.exception';
import { AppLogger } from '@share/module/logger/app-logger.config';

@Injectable()
export class AxiosService {
  private readonly options: AxiosRequestConfig;

  constructor(private readonly log: AppLogger) {
    this.log.setContext(AxiosService.name);
    this.options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async post<T>(uri: string, data: any, headers?: Record<string, string>): Promise<T> {
    this.log.info(`POST to ${uri} with data #`, data);
    try {
      const response = await axios.post<T>(uri, data, this.getOptions(headers));
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      throw new BadRequestException(`Error when POST to ${uri} with error #${errorMsg}`);
    }
  }

  async get<T>(uri: string, params: any, headers?: Record<string, string>): Promise<T> {
    this.log.info(`GET to ${uri} with params #`, params);
    try {
      const response = await axios.get<T>(uri, this.getOptions(headers, params));
      return response.data;
    } catch (error) {
      throw new BadRequestException(`Error when GET to ${uri} with error #${error.message}`);
    }
  }

  private getOptions(headers: Record<string, string>, params?: any): AxiosRequestConfig {
    let ops = {
      ...this.options,
    };
    if (headers) {
      ops = {
        ...ops,
        headers: {
          ...ops.headers,
          ...headers,
        },
      };
    }
    if (params) {
      ops = {
        ...ops,
        params,
      };
    }
    return ops;
  }
}
