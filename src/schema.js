import { gql } from 'apollo-server';
import { MAX_LIMIT, DEFAULT_LIMIT } from './constants';

export const typeDefs = gql`
  type Query {
    """
    Returns a list of objects of the Metropolitan Museum of Art
    """
    allObjects(
      """
      Returns any objects with updated data after this date
      """
      updatedAfter: String,
      """
      Limit the number of objects returned by the query.

      The default limit is ${DEFAULT_LIMIT} objects.
      The maximum limit is ${MAX_LIMIT} objects.
      """
      limit: Int,
      """
      Skip that many objects before beginning to return objects
      """
      offset: Int
    ): ObjectsConnection

    """
    A record for an object, containing all open access data about that object, including its image (if the image is available under Open Access)
    """
    object(
      """
      The unique Object ID for an object

      Format 0-9, like 123.
      """
      id: ID!
    ): Object
  }

  type ObjectsConnection {
    """
    The total number of publicly-available objects
    """
    total: Int
    """
    A list containing publicly-available object
    """
    objects: [Object]
  }

  type Object {
    """
    Identifying number for each artwork (unique, can be used as key field)
    """
    id: ID

    """
    Artist related to the object
    """
    artist: Artist

    """
    Title, identifying phrase, or name given to a work of art
    """
    title: String

    """
    URL to the primary image of an object in JPEG format
    """
    primaryImage: String

    """
    A list containing URLs to the additional images of an object in JPEG format
    """
    additionalImages: [String]

    """
    Year, a span of years, or a phrase that describes the specific or approximate date when an artwork was designed or created
    """
    date: String

    """
    Machine readable date indicating the year the artwork was started to be created
    """
    beginDate: String

    """
    Machine readable date indicating the year the artwork was completed (may be the same year or different year than the objectBeginDate)
    """
    endDate: String

    """
    Date metadata was last updated
    """
    updatedAfter: String

    """
    URL to object's page on metmuseum.org
    """
    url: String

    """
    Geographic fields related to the object's origin and its discovery
    """
    geography: Geography

    """
    When "true" indicates a popular and important artwork in the collection
    """
    isHighlight: Boolean

    """
    Identifying number for each artwork (not always unique)
    """
    accessionNumber: String

    """
    When "true" indicates an artwork in the Public Domain
    """
    isPublicDomain: Boolean

    """
    A list containing the constituents of an object, with both an artist name and their role
    """
    constituents: [Constituent]

    """
    Indicates The Met's curatorial department responsible for the artwork
    """
    department: String

    """
    Describes the physical type of the object
    """
    physicalType: String

    """
    Information about the culture, or people from which an object was created
    """
    culture: String

    """
    Time or time period when an object was created
    """
    period: String

    """
    Dynasty (a succession of rulers of the same line or family) under which an object was created
    """
    dynasty: String

    """
    Reign of a monarch or ruler under which an object was created
    """
    reign: String

    """
    A set of works created as a group or published as a series.
    """
    portfolio: String

    """
    Refers to the materials that were used to create the artwork
    """
    medium: String

    """
    Size of the artwork or object
    """
    dimensions: String

    """
    Text acknowledging the source or origin of the artwork and the year the object was acquired by the museum.
    """
    creditLine: String

    """
    General term describing the artwork type.
    """
    classification: String

    """
    Credit line for artworks still under copyright.
    """
    rightsAndReproduction: String

    """
    URL to object's page on metmuseum.org
    """
    linkResource: String

    """
    Metropolitan Museum of Art, New York, NY
    """
    repository: String
  }

  type Constituent {
    role: String
    name: String
  }

  type Artist {
    """
    Role of the artist related to the type of artwork or object that was created
    """
    role: String

    """
    Describes the extent of creation or describes an attribution qualifier to the information given in the artistRole field
    """
    prefix: String

    """
    Artist name in the correct order for display
    """
    displayName: String

    """
    Nationality and life dates of an artist, also includes birth and death city when known.
    """
    displayBio: String

    """
    Used to record complex information that qualifies the role of a constituent, e.g. extent of participation by the Constituent (verso only, and followers)
    """
    suffix: String

    """
    Used to sort artist names alphabetically. Last Name, First Name, Middle Name, Suffix, and Honorific fields, in that order.
    """
    alphaSort: String

    """
    National, geopolitical, cultural, or ethnic origins or affiliation of the creator or institution that made the artwork
    """
    nationality: String

    """
    Year the artist was born
    """
    beginDate: String

    """
    Year the artist died
    """
    endDate: String
  }

  type Geography {
    """
    Qualifying information that describes the relationship of the place catalogued in the geography fields to the object that is being catalogued
    """
    type: String

    """
    City where the artwork was created
    """
    city: String

    """
    State or province where the artwork was created, may sometimes overlap with County
    """
    state: String

    """
    County where the artwork was created, may sometimes overlap with State
    """
    county: String

    """
    Country where the artwork was created or found
    """
    country: String

    """
    Geographic location more specific than country, but more specific than subregion, where the artwork was created or found (frequently null)
    """
    region: String

    """
    Geographic location more specific than Region, but less specific than Locale, where the artwork was created or found (frequently null)
    """
    subregion: String

    """
    Geographic location more specific than subregion, but more specific than locus, where the artwork was found (frequently null)
    """
    locale: String

    """
    Geographic location that is less specific than locale, but more specific than excavation, where the artwork was found (frequently null)
    """
    locus: String

    """
    The name of an excavation. The excavation field usually includes dates of excavation.
    """
    excavation: String

    """
    River is a natural watercourse, usually freshwater, flowing toward an ocean, a lake, a sea or another river related to the origins of an artwork (frequently null)
    """
    river: String
  }
`;

export const resolvers = {
  Query: {
    allObjects: async (_, args, { dataSources }) =>
      dataSources.metFetcher.getObjectsConnection(args),
    object: (_, { id }, { dataSources }) =>
      dataSources.metFetcher.getObject(id),
  },
  ObjectsConnection: {
    objects: async (connection, _, { dataSources }) => {
      let objects = [];

      for (const id of connection.objectIDs) {
        try {
          objects.push(await dataSources.metFetcher.getObject(id));
        } catch (exception) {
          console.error(`Couldn't fetch ${id}`, exception);
        }
      }

      return objects;
    },
  },
  Object: {
    id: object => object.objectID,
    artist: object => object,
    geography: object => object,
    date: object => object.objectDate,
    beginDate: object => object.objectBeginDate,
    endDate: object => object.objectEndDate,
    updatedAfter: object => object.metadataDate,
    url: object => object.objectURL,
    physicalType: object => object.objectName,
  },
  Artist: {
    role: object => object.artistRole,
    prefix: object => object.artistPrefix,
    displayName: object => object.artistDisplayName,
    displayBio: object => object.artistDisplayBio,
    suffix: object => object.artistSuffix,
    alphaSort: object => object.artistAlphaSort,
    nationality: object => object.artistNationality,
    beginDate: object => object.artistBeginDate,
    endDate: object => object.artistEndDate,
  },
  Geography: {
    type: object => object.geographyType,
  },
};
