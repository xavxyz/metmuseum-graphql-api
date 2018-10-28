import { RESTDataSource, HTTPCache } from 'apollo-datasource-rest';

export class METFetcher extends RESTDataSource {
  constructor({ maxLimit, ttl } = {}) {
    super();
    this.baseURL = 'https://collectionapi.metmuseum.org/public/collection/v1/';

    // limit the number of parallel requests on /objects/:id by default to 20
    this.maxLimit = maxLimit || 20;

    // responses are cached one day by default
    this.ttl = ttl || 3600 * 24;
  }

  async getObject(id) {
    return this.get(`objects/${id}`, {}, { cacheOptions: { ttl: this.ttl } });
  }

  async getObjectsConnection({ updatedAfter, limit = 10, offset = 0 }) {
    const connection = await this.get(
      'objects',
      updatedAfter && { metadataDate: updatedAfter },
      { cacheOptions: { ttl: this.ttl } }
    );

    return {
      ...connection,
      objectIDs: connection.objectIDs.slice(
        offset,
        offset + Math.min(limit, this.maxLimit)
      ),
    };
  }
}
