import { GraphQLClient } from "graphql-request"

const DATOCMS_API_TOKEN = process.env.DATOCMS_API_TOKEN
const DATOCMS_API_URL = "https://graphql.datocms.com"

// DATOCMS_API_TOKEN is required for DatoCMS features

export const datocmsClient = new GraphQLClient(DATOCMS_API_URL, {
  headers: {
    Authorization: `Bearer ${DATOCMS_API_TOKEN || ""}`,
  },
})
