import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiFactory } from '../factories/apiFactory';
import { NextStrapiConfig } from '../types';
import { logger, throwError, validateConfig } from '../utils';

export class HttpClient {
  private __instance: AxiosInstance;
  private __config: NextStrapiConfig;

  private constructor(config: NextStrapiConfig) {
    this.__config = config;

    const requestConfig = ApiFactory.createRequestConfig(
      config.apiUrl,
      config.apiToken,
      config.headers,
      config.additionalConfig,
    );
    this.__instance = axios.create(requestConfig);
  }

  static create(config: NextStrapiConfig) {
    validateConfig(config);

    return new HttpClient(config);
  }

  async get(url: string, revalidate?: number) {
    let response: any;
    const startTime = Date.now();

    try {
      response = await this.__instance.get<any>(url, {
        ...(revalidate ? { next: { revalidate } } : {}),
      } as AxiosRequestConfig);
      const responseTime = Date.now() - startTime;
      logger(
        { fetchUrl: url, responseTime: `${responseTime} ms` },
        this.__config.verbose,
      );
    } catch (err: any) {
      throwError('Unable to get data from url.', url, err);
    }

    return response!.data;
  }
}
