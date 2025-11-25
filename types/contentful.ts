import { EntrySkeletonType, Asset } from "contentful";

export interface GlobalSettingsSkeleton extends EntrySkeletonType {
  contentTypeId: "globalSettings";
  fields: {
    songTitle: string;
    songArtist: string;
    songFile?: Asset; // optional for safety
  };
}
