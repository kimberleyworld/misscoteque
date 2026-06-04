import { gql } from "graphql-request"
import { datocmsClient } from "./datocms"

const HOME_PAGE_QUERY = gql`
  query GetHomePageContent {
    homepage {
      pageheading
    }
  }
`

export interface HomePageContent {
  pageheading: string
}

interface HomePageResponse {
  homepage: HomePageContent
}

export async function getHomePageContent(): Promise<HomePageContent> {
  try {
    const response = await datocmsClient.request<HomePageResponse>(HOME_PAGE_QUERY)
    return response.homepage || {
      pageheading: "MISSCOTEQUE.WORLD",
    }
  } catch (error) {
    console.warn("Failed to fetch home page content:", error)
    return {
      pageheading: "MISSCOTEQUE.WORLD test",
    }
  }
}
