import qs from 'qs';
import {
  FetchCollectionItemOptions,
  FetchItemOptions,
  FetchNavigationOptions,
  KeyValue,
  NextStrapiConfig,
} from '../types';

export const ApiFactory = {
  createRequestOptions: (config: NextStrapiConfig) => ({
    headers: {
      ...config.headers,
      Authorization: `Bearer ${config.apiToken}`,
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
