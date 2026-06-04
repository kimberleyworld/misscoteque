import { gql } from "graphql-request"
import { datocmsClient } from "./datocms"
import { DatoCMSCollection, DatoCMSCollectionResponse } from "@/types/datocms"

const COLLECTION_QUERY = gql`
  query GetCollection {
    postercollection {
      id
      posters {
        url
        alt
      }
    }
  }
`

export async function getCollection(): Promise<DatoCMSCollection | null> {
  try {
    const response = await datocmsClient.request<DatoCMSCollectionResponse>(COLLECTION_QUERY)
    return response.postercollection || null
  } catch (error) {
    console.warn("Failed to fetch collection:", error)
    return null
  }
}
