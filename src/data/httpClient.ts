import deepmerge from 'deepmerge';
import { ApiFactory } from '../factories/apiFactory';
import { NextStrapiConfig } from '../types';
import { logger, throwError, validateConfig } from '../utils';

export class HttpClient {
  private __config: NextStrapiConfig;

  private constructor(config: NextStrapiConfig) {
    this.__config = config;
  }

  static create(config: NextStrapiConfig) {
    validateConfig(config);

    return new HttpClient(config);
  }

  async get(url: string, extraOptions: RequestInit = {}) {
    let response: any;
    const baseUrl = this.__config.apiUrl.endsWith('/')
      ? `${this.__config.apiUrl}api/`
      : `${this.__config.apiUrl}/api/`;
    const startTime = Date.now();

    const options: RequestInit = deepmerge(
      ApiFactory.createRequestOptions(this.__config),
      extraOptions,
    );

    try {
      response = await fetch(`${baseUrl}${url}`, options);
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
