# Video assets excluded from GitHub-light package

The original MP4 files were removed to keep the repository small enough for GitHub upload.
The app uses SmartVideo fallbacks, so it can still build and run without these files.

To restore full cinematic media, copy the files from `app-media-assets.zip` back into:

`public/videos/`

Recommended production setup:
- Keep code in GitHub.
- Store heavy MP4 assets in Vercel Blob, Cloudflare R2, S3, or Git LFS.
- Avoid committing generated videos directly unless using Git LFS.
