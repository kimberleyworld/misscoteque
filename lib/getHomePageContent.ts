import { gql } from "graphql-request"
import { datocmsClient } from "./datocms"
import { HomePageContent, HomePageResponse } from "@/types/datocms"

const HOME_PAGE_QUERY = gql`
  query GetHomePageContent {
    homepage {
       pageheading
       abouttitle
       aboutcopy
       communitynoticeboarddescription
       submitcommunitynoticetitle
       submitcommunitynoticedescription
    }
  }
`

export async function getHomePageContent(): Promise<HomePageContent> {
  try {
    const response = await datocmsClient.request<HomePageResponse>(HOME_PAGE_QUERY)
    return response.homepage || {
      pageheading: "MISSCOTEQUE.WORLD",
      abouttitle: "",
      aboutcopy: "",
      communitynoticeboarddescription: "",
      submitcommunitynoticetitle: "",
      submitcommunitynoticedescription: "",
    }
  } catch (error) {
    console.warn("Failed to fetch home page content:", error)
    return {
      pageheading: "MISSCOTEQUE.WORLD",
      abouttitle: "WHO WE ARE",
      aboutcopy: "We are misscoteque, a queer collective dedicated to celebrating and preserving the rich tapestry of queer culture through our archive, events, and community initiatives.",
      communitynoticeboarddescription: "Bringing the community closer together, this community notice board keeps everyone informed about who needs help, whats happening and even lost connections. If you want to add a notice use this form.",
      submitcommunitynoticetitle: "LEAN ON THE COMMUNITY",
      submitcommunitynoticedescription: "All notices submitted are manually reviewed by us before being published. this will take a few days.",
    }
  }
}
