export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  ROADMAP_THUMBNAILS: 'roadmap-thumbnails',
  POST_IMAGES: 'post-images',
  ATTACHMENTS: 'attachments',
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];