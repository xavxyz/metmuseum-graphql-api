import fetch from 'node-fetch';
import querystring from 'querystring';

// hardcode a max limit to prevent hammering the MET API
export const MAX_LIMIT = 20;

// wrapper around fetch to define endpoint and query strings in a friendlier way
// if the API allows it at some point, it could support batching 🤔
export const fetcher = async (endpoint, query) => {
  try {
    // prettier-ignore
    const response = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/${endpoint}${query ? `?${querystring.parse(query)}` : ''}`
      );

    return await response.json();
  } catch (exception) {
    throw Error(exception);
  }
};
