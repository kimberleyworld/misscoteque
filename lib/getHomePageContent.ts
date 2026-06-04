import { gql } from "graphql-request"
import { datocmsClient } from "./datocms"

const HOME_PAGE_QUERY = gql`
  query GetHomePageContent {
    siteConfig {
      pageHeading
    }
  }
`

export interface HomePageContent {
  pageHeading: string
}

interface HomePageResponse {
  siteConfig: HomePageContent
}

export async function getHomePageContent(): Promise<HomePageContent> {
  try {
    const response = await datocmsClient.request<HomePageResponse>(HOME_PAGE_QUERY)
    return response.siteConfig || {
      pageHeading: "MISSCOTEQUE.WORLD",
    }
  } catch (error) {
    console.warn("Failed to fetch home page content:", error)
    return {
      pageHeading: "MISSCOTEQUE.WORLD",
    }
  }
}
