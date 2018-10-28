import { RESTDataSource, HTTPCache } from 'apollo-datasource-rest';
import { MAX_LIMIT, DEFAULT_LIMIT } from './constants';

export class METFetcher extends RESTDataSource {
  constructor({ ttl } = {}) {
    super();
    this.baseURL = 'https://collectionapi.metmuseum.org/public/collection/v1/';

    // responses are cached one day by default
    this.ttl = ttl || 3600 * 24;
  }

  async getObject(id) {
    const object = await this.get(
      `objects/${id}`,
      {},
      { cacheOptions: { ttl: this.ttl } }
    );

    return Object.entries(object).reduce(
      (obj, [field, value]) => ({
        ...obj,
        [field]: value === '' ? null : value,
      }),
      {}
    );
  }

  async getObjectsConnection({
    updatedAfter,
    limit = DEFAULT_LIMIT,
    offset = 0,
  }) {
    const connection = await this.get(
      'objects',
      updatedAfter && { metadataDate: updatedAfter },
      { cacheOptions: { ttl: this.ttl } }
    );

    return {
      ...connection,
      objectIDs: connection.objectIDs.slice(
        offset,
        offset + Math.min(limit, MAX_LIMIT)
      ),
    };
  }
}
