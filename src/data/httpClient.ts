import axios, { AxiosInstance } from 'axios';
import { ApiFactory } from '../factories/apiFactory';
import { NextStrapiConfig } from '../types';
import { throwError, validateConfig } from '../utils';

export class HttpClient {
  private __instance: AxiosInstance;

  private constructor({ apiUrl, apiToken }: NextStrapiConfig) {
    const requestConfig = ApiFactory.createRequestConfig(apiUrl, apiToken);
    this.__instance = axios.create(requestConfig);
  }

  static create(config: NextStrapiConfig) {
    validateConfig(config);

    return new HttpClient(config);
  }

  async get(url: string) {
    let response: any;

    try {
      response = await this.__instance.get<any>(url);
    } catch (err: any) {
      throwError('Unable to get data from url.', url, err);
    }

    return response!.data;
  }
}
