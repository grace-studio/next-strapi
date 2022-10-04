import { generateUUID } from '../utils';
import { KeyValue } from '../types';

const isObject = (data: any) =>
  Object.prototype.toString.call(data) === '[object Object]';
const isArray = (data: any) =>
  Object.prototype.toString.call(data) === '[object Array]';

const flatten = (data: any) => {
  if (!data.attributes) {
    return data;
  }

  return {
    id: data.id,
    ...(data._key && { _key: data._key }),
    ...data.attributes,
  };
};

type FlattenResponse<T = KeyValue<any>> = T | T[];

const strapiFlatten = <T>(data: any): FlattenResponse<T> => {
  if (isArray(data)) {
    return data.map((item: any) =>
      strapiFlatten({ ...item, _key: generateUUID() })
    );
  }

  if (isObject(data)) {
    if (isArray(data.data)) {
      data = [...data.data];
      data = data.map((item: any) => ({ ...item, _key: generateUUID() }));
    } else if (isObject(data.data)) {
      data = flatten({ ...data.data });
    } else if (data.data === null) {
      data = null;
    } else {
      data = flatten(data);
    }

    for (const key in data) {
      data[key] = strapiFlatten(data[key]);
    }

    return data;
  }

  return data;
};

export const DataFactory = {
  flattenStrapiV4Response: strapiFlatten,
};
