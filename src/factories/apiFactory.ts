import qs from 'qs';
import { AxiosRequestConfig } from 'axios';
import {
  FetchCollectionItemOptions,
  FetchItemOptions,
  FetchNavigationOptions,
  KeyValue,
} from '../types';

export const ApiFactory = {
  createRequestConfig: (
    baseUrl: string,
    apiToken: string,
    headers?: Record<string, string>
  ): AxiosRequestConfig => ({
    baseURL: baseUrl.endsWith('/') ? `${baseUrl}api/` : `${baseUrl}/api/`,
    headers: {
      ...headers,
      Authorization: `Bearer ${apiToken}`,
    },
  }),

  createQueryString: (queryObject?: KeyValue<any>) =>
    queryObject
      ? qs.stringify(queryObject, {
          encodeValuesOnly: true,
        })
      : null,

  createQueryObjectForItem: ({
    locale,
    populateQueryObject,
  }: FetchItemOptions) => ({
    ...(locale && { locale }),
    ...populateQueryObject,
  }),

  createQueryObjectForCollectionItem: ({
    locale,
    slug,
    populateQueryObject,
  }: FetchCollectionItemOptions) => ({
    ...(locale && { locale }),
    ...(slug && {
      filters: {
        slug: {
          $eq: slug.join('/') || null,
        },
      },
    }),
    ...populateQueryObject,
  }),

  createQueryObjectForNavigation: ({
    type,
    menu,
    path,
    locale,
  }: FetchNavigationOptions) => ({
    ...(type && { type }),
    ...(menu && { menu }),
    ...(path && { path }),
    ...(locale && { locale }),
  }),
};
