export type KeyValue<T> = {
  [key: string]: T;
};

export type NextStrapiConfig = {
  apiUrl: string;
  apiToken: string;
  headers?: Record<string, string>;
  verbose?: boolean;
};

type FetchOptions = {
  apiId: string;
  slug: string[] | null;
  locale?: string;
  populateQueryObject?: KeyValue<any>;
};

export type FetchCollectionItemOptions = FetchOptions;
export type FetchCollectionPaths = Pick<FetchOptions, 'apiId'>;
export type FetchItemOptions = Omit<FetchOptions, 'slug'>;

export type FetchMenuOptions = {
  slug: string;
};

export type FetchNavigationOptions = {
  navigationIdOrSlug: string;
  type?: 'TREE' | 'FLAT' | 'RFR';
  menu?: boolean;
  path?: string;
  locale?: string;
};
