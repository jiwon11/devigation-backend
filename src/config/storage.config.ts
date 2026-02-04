import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  supabase: {
    bucket: process.env['SUPABASE_STORAGE_BUCKET'] ?? 'devigation',
    publicUrl: process.env['SUPABASE_STORAGE_PUBLIC_URL'],
  },
  upload: {
    maxFileSize: parseInt(process.env['MAX_FILE_SIZE'] ?? '10485760', 10), // 10MB
    allowedMimeTypes: (
      process.env['ALLOWED_MIME_TYPES'] ??
      'image/jpeg,image/png,image/gif,image/webp,application/pdf'
    ).split(','),
    imageMaxWidth: parseInt(process.env['IMAGE_MAX_WIDTH'] ?? '2048', 10),
    imageMaxHeight: parseInt(process.env['IMAGE_MAX_HEIGHT'] ?? '2048', 10),
    thumbnailWidth: parseInt(process.env['THUMBNAIL_WIDTH'] ?? '300', 10),
    thumbnailHeight: parseInt(process.env['THUMBNAIL_HEIGHT'] ?? '300', 10),
  },
  paths: {
    avatars: 'avatars',
    roadmapThumbnails: 'roadmaps/thumbnails',
    postImages: 'posts/images',
    attachments: 'attachments',
  },
}));