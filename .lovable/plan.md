# Bulk workout video library

## What will be added
- Add a **Videos** area to the existing Workout screen without changing the current activity and quick-start sections.
- Let the owner select a whole folder containing up to 1,000 MP4, MOV, M4V, or WebM files.
- Upload files in a controlled queue with overall progress, success/failure counts, and retry-friendly error messages.
- Show uploaded videos in a searchable, paginated library so loading 1,000 items stays fast.
- Open videos in an in-app player and allow the uploader to remove their own videos.

## Access and storage
- Require sign-in before uploading, so nobody can add files anonymously.
- Keep each account's videos private and available after refreshing or returning later.
- Store video files in Lovable Cloud storage and metadata in its database.

## Technical details
- Upload directly from the browser to private storage in small concurrent batches; video bytes will not pass through the app server.
- Store title, file path, size, type, and upload date with per-user access rules.
- Generate temporary playback links when videos are opened.
- Preserve the current ZyraFit mobile layout and Workout navigation position.
