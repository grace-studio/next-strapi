# @grace-studio/next-strapi

[![npm version](https://badge.fury.io/js/@grace-studio%2Fnext-strapi.svg)](https://badge.fury.io/js/@grace-studio%2Fnext-strapi)

Middle layer to connect a Next.js application with Strapi.

## Installation

```
npm i @grace-studio/next-strapi

// or

yarn add @grace-studio/next-strapi
```

## Usage example

```ts
import {
  NextStrapiConfig,
  NextStrapi,
  CollectionItem,
} from '@grace-studio/next-strapi';

const config: NextStrapiConfig = {
  apiToken: process.env.STRAPI_API_TOKEN!,
  apiUrl: process.env.NEXT_PUBLIC_STRAPI_API_URL!,
};

// Create instance of NextStrapi
const api = NextStrapi.create(config);

// Get single item with id = global
const [global] = await api.get.item({
  apiId: 'global',
  locale: 'en',
  populateQueryObject: {
    populate: '*',
  },
});

// Get collection with id = pages
const pages = await api.get.collection({
  apiId: 'pages',
  locale: 'en',
  populateQueryObject: {
    populate: '*',
  },
});

// Get collections paths with id = pages
const pages = await api.fetch.collectionPaths({ apiId: 'pages' });

const paths = pages.map((page: CollectionItem) => {
  const { slug } = page;

  return {
    params: { slug },
  };
});

// The expected output type from the api can be provided to the methods
type GlobalItem = {
  id: number;
  title: string;
  slug: string;
};

const [global] = await api.get.item<GlobalItem>({
  apiId: 'global',
  locale: 'en',
  populateQueryObject: {
    populate: '*',
  },
});
```
