import { EntrySkeletonType, Asset, Entry } from "contentful";

export interface GlobalSettingsSkeleton extends EntrySkeletonType {
  contentTypeId: "globalSettings";
  fields: {
    songTitle: string;
    songArtist: string;
    songFile?: Asset; // optional for safety
    nextEvent?: Entry<EventSkeleton>;
  };
}

export interface EventSkeleton extends EntrySkeletonType {
  contentTypeId: "event";
  fields: {
    title?: string;
    date?: string;
    time?: string;
    description?: string;
    ticketUrl?: string;
    status?: "draft" | "upcoming" | "past";
  };
}
