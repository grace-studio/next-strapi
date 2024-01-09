import { ApiFactory } from '../factories/apiFactory';
import { DataFactory } from '../factories/dataFactory';
import { HttpClient } from '../data/httpClient';
import { validateConfig } from '../utils';
import type {
  FetchCollectionItemOptions,
  FetchCollectionPaths,
  FetchItemOptions,
  FetchMenuOptions,
  FetchNavigationOptions,
  KeyValue,
  NextStrapiConfig,
} from '../types';

export class NextStrapi {
  private __config: NextStrapiConfig;
  private __httpClient: HttpClient;

  private constructor(config: NextStrapiConfig) {
    this.__config = config;
    this.__httpClient = HttpClient.create(config);
  }

  static create(config: NextStrapiConfig) {
    validateConfig(config);

    return new NextStrapi(config);
  }

  private async __fetchFromApi<T, M>(
    path: string,
    queryObject: KeyValue<any>,
    extraOptions?: RequestInit,
  ) {
    const queryString = ApiFactory.createQueryString(queryObject);
    const url = queryString ? `${path}?${queryString}` : path;

    const response = await this.__httpClient.get(url, extraOptions);

    return {
      data: [DataFactory.flattenStrapiV4Response<T>(response)].flat(),
      meta: response.meta as M,
    };
  }

  get get() {
    const __this = this;

    const item = <T extends {} = object, M extends {} = object>(
      options: FetchItemOptions,
    ) => {
      const queryObject = ApiFactory.createQueryObjectForItem(options);

      return __this.__fetchFromApi<T, M>(
        options.apiId,
        queryObject,
        options.extraFetchOptions,
      );
    };

    const collectionItem = <T extends {} = object, M extends {} = object>(
      options: FetchCollectionItemOptions,
    ) => {
      const queryObject =
        ApiFactory.createQueryObjectForCollectionItem(options);

      return __this.__fetchFromApi<T, M>(
        options.apiId,
        queryObject,
        options.extraFetchOptions,
      );
    };

    const collectionPaths = <T extends {} = object, M extends {} = object>({
      apiId,
      extraFetchOptions,
    }: FetchCollectionPaths) => {
      const queryObject = {
        locale: 'all',
        fields: ['slug', 'locale'],
      };

      return __this.__fetchFromApi<T, M>(apiId, queryObject, extraFetchOptions);
    };

    const navigation = <T extends {} = object, M extends {} = object>(
      options: FetchNavigationOptions,
    ) => {
      const queryObject = ApiFactory.createQueryObjectForNavigation(options);
      const path = `navigation/render/${options.navigationIdOrSlug}`;

      return __this.__fetchFromApi<T, M>(
        path,
        queryObject,
        options.extraFetchOptions,
      );
    };

    const menu = async <T extends {} = object, M extends {} = object>({
      slug,
      extraFetchOptions,
    }: FetchMenuOptions) => {
      let id;
      try {
        const { data: menuData } = await __this.__fetchFromApi('menus', {});
        id = menuData.find((item: any) => item.slug === slug);
      } catch (err: any) {
        throw new Error(err);
      }

      const queryObject = {
        nested: true,
        populate: '*',
      };
      const path = `menus/${id}`;

      return __this.__fetchFromApi<T, M>(path, queryObject, extraFetchOptions);
    };

    return {
      item,
      collection: item,
      collectionItem,
      collectionPaths,
      navigation,
      menu,
    };
  }

  resolveAbsoluteImageUrl(path: string) {
    return path && (path.startsWith('http:') || path.startsWith('https:'))
      ? path
      : `${this.__config.apiUrl}${path || ''}`;
  }
}
