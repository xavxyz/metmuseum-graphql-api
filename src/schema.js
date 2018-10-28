import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    # Returns any objects with updated data after this date
    allObjects(updatedAfter: String, limit: Int, offset: Int): ObjectsConnection

    # A record for an object, containing all open access data about that object, including its image (if the image is available under Open Access)
    object(id: ID!): Object
  }

  type ObjectsConnection {
    total: Int
    objects: [Object]
  }

  type Object {
    # Identifying number for each artwork (unique, can be used as key field)
    id: ID

    # When "true" indicates a popular and important artwork in the collection
    isHighlight: Boolean

    # Identifying number for each artwork (not always unique)
    accessionNumber: String

    # When "true" indicates an artwork in the Public Domain
    isPublicDomain: Boolean

    # URL to the primary image of an object in JPEG format
    primaryImage: String

    # A list containing URLs to the additional images of an object in JPEG format
    additionalImages: [String]

    # A list containing the constituents of an object, with both an artist name and their role
    constituents: [Constituent]

    # Indicates The Met's curatorial department responsible for the artwork
    department: String

    # Describes the physical type of the object
    objectName: String

    # Title, identifying phrase, or name given to a work of art
    title: String

    # Information about the culture, or people from which an object was created
    culture: String

    # Time or time period when an object was created
    period: String

    # Dynasty (a succession of rulers of the same line or family) under which an object was created
    dynasty: String

    # Reign of a monarch or ruler under which an object was created
    reign: String

    # A set of works created as a group or published as a series.
    portfolio: String

    # Role of the artist related to the type of artwork or object that was created
    artistRole: String

    # Describes the extent of creation or describes an attribution qualifier to the information given in the artistRole field
    artistPrefix: String

    # Artist name in the correct order for display
    artistDisplayName: String

    # Nationality and life dates of an artist, also includes birth and death city when known.
    artistDisplayBio: String

    # Used to record complex information that qualifies the role of a constituent, e.g. extent of participation by the Constituent (verso only, and followers)
    artistSuffix: String

    # Used to sort artist names alphabetically. Last Name, First Name, Middle Name, Suffix, and Honorific fields, in that order.
    artistAlphaSort: String

    # National, geopolitical, cultural, or ethnic origins or affiliation of the creator or institution that made the artwork
    artistNationality: String

    # Year the artist was born
    artistBeginDate: String

    # Year the artist died
    artistEndDate: String

    # Year, a span of years, or a phrase that describes the specific or approximate date when an artwork was designed or created
    objectDate: String

    # Machine readable date indicating the year the artwork was started to be created
    objectBeginDate: String

    # Machine readable date indicating the year the artwork was completed (may be the same year or different year than the objectBeginDate)
    objectEndDate: String

    # Refers to the materials that were used to create the artwork
    medium: String

    # Size of the artwork or object
    dimensions: String

    # Text acknowledging the source or origin of the artwork and the year the object was acquired by the museum.
    creditLine: String

    # Qualifying information that describes the relationship of the place catalogued in the geography fields to the object that is being catalogued
    geographyType: String

    # City where the artwork was created
    city: String

    # State or province where the artwork was created, may sometimes overlap with County
    state: String

    # County where the artwork was created, may sometimes overlap with State
    county: String

    # Country where the artwork was created or found
    country: String

    # Geographic location more specific than country, but more specific than subregion, where the artwork was created or found (frequently null)
    region: String

    # Geographic location more specific than Region, but less specific than Locale, where the artwork was created or found (frequently null)
    subregion: String

    # Geographic location more specific than subregion, but more specific than locus, where the artwork was found (frequently null)
    locale: String

    # Geographic location that is less specific than locale, but more specific than excavation, where the artwork was found (frequently null)
    locus: String

    # The name of an excavation. The excavation field usually includes dates of excavation.
    excavation: String

    # River is a natural watercourse, usually freshwater, flowing toward an ocean, a lake, a sea or another river related to the origins of an artwork (frequently null)
    river: String

    # General term describing the artwork type.
    classification: String

    # Credit line for artworks still under copyright.
    rightsAndReproduction: String

    # URL to object's page on metmuseum.org
    linkResource: String

    # Date metadata was last updated
    metadataDate: String

    # Metropolitan Museum of Art, New York, NY
    repository: String

    # URL to object's page on metmuseum.org
    objectURL: String
  }

  type Constituent {
    role: String
    name: String
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
  },
};
