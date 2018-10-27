<p align="center">
  <a href="https://github.com/metmuseum/" target="_blank" rel="noreferrer"><img src="https://avatars1.githubusercontent.com/u/13870646?s=200" alt="The MET - Logo" /></a>
</p>

<p align="center">
  A <strong>GraphQL API</strong> wrapping the <strong>Metropolitan Museum of Art Collection API</strong>.
</p>

## Usage

Visit https://metmuseum-graphql.now.sh/ and run the following query in the playground:

```graphql
query exploreTheMetCollection {
  allObjects(limit: 10) {
    total
    objects {
      id
      title
      artistDisplayName
    }
  }
}
```

I invite you to explore the schema via the tab on the right side of the UI and build awesome things with this API 🤩

You can query it like any other GraphQL API, with your favorite GraphQL client or a simple HTTP request: https://metmuseum-graphql.now.sh

The most basic usage would be:

```sh
# ask for the artworks total
curl http://metmuseum-graphql.now.sh -X POST -d "{\"query\": \"{ allObjects { total } }\"}" -H "Content-Type: application/json"
```

## Dev

```sh
# Install the dependencies
npm install

# Run the Node server
npm run dev
```

## Aknowledgements

Thanks for the MET team for building an awesome API allowing us to discover more than 470,000 artworks. Find out more at https://metmuseum.github.io.