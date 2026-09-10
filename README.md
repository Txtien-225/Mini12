# VKU Field Survey

Offline-first campus facility inspection PWA for Mini-Project 1.

## Run locally

```bash
npm install
npm run dev
```

Trong VS Code, chọn cấu hình `VKU Field Survey - Vite` ở thanh Run and Debug. Không chạy trực tiếp file `src/main.ts` bằng Node.js vì Vite cần xử lý TypeScript và CSS trước khi trình duyệt tải ứng dụng.

Build the web bundle with `npm run build`. The app stores the active draft and submitted inspections in IndexedDB. The service worker uses cache-first retrieval for the app shell and requests a `survey-sync` background task when the browser supports Background Sync.

## Sync API

Queued surveys POST sequentially to `/api/surveys`. Set `VITE_SYNC_ENDPOINT` at build time to point at the real server endpoint. A successful response marks the local record `SYNCED`; failed requests remain `PENDING_SYNC`.

## Capacitor Android

After installing dependencies, run `npm run cap:add:android` once, then `npm run cap:sync` and `npm run cap:open:android`. The native path uses `@capacitor/camera`, `@capacitor/geolocation`, and listens to `@capacitor/network`. Camera and location permissions should be configured in the Android project; GPS coordinates are captured opportunistically and never prevent submission.

The supplied report template is intentionally kept separate from this implementation; it is a submission document, not an application source file.
