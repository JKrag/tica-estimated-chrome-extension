# Chrome Web Store API Credentials Setup

This script will guide you through setting up credentials for automated publishing.

## Prerequisites

1. A Chrome Web Store developer account
2. The extension must be uploaded manually FIRST (to get an Extension ID)

## Step 1: Create Google Cloud Project & OAuth Credentials

1. Go to: <https://console.cloud.google.com/apis/credentials>
2. In the top bar, click the current project selector (it often says **Select a project**).
3. In the project picker modal, click **New Project**.
4. Name it something like `chrome-webstore-upload`, then click **Create**.
5. Wait a few seconds, then make sure this new project is selected in the top bar.
6. Open OAuth setup: <https://console.cloud.google.com/auth/overview>.
7. Click **Get started** (or open **OAuth consent screen** directly if already initialized).
8. Fill required app fields (app name, support email, contact email) and continue.
9. For audience, choose **External** unless your Google Workspace policy requires otherwise.
10. Save/continue through remaining OAuth setup screens.
11. Go back to Credentials: <https://console.cloud.google.com/apis/credentials>.
12. Click **Create Credentials** → **OAuth client ID**.
13. Choose **Desktop app**, give it a name, and click **Create**.
14. Copy and save both values: **Client ID** and **Client secret**.

Notes:

- If you already have a suitable Cloud project, you can select it instead of creating a new one.
- The exact button text in Google Cloud changes often, but the project picker in the top bar is always where project creation/selection starts.
- If OAuth client creation is blocked, finish any pending OAuth consent screen setup first.

## Step 2: Enable Chrome Web Store API

1. Go to: <https://console.cloud.google.com/apis/library/chromewebstore.googleapis.com>
2. Click **Enable**

## Step 3: Get Refresh Token

1. Run: `npx chrome-webstore-upload-keys`
2. Enter your Client ID and Client Secret when prompted
3. Complete the browser OAuth flow
4. Copy the Refresh Token from the output

## Step 4: Store Credentials

Create a `.env` file (**DO NOT COMMIT THIS**):

```env
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
REFRESH_TOKEN=your_refresh_token
EXTENSION_ID=your_extension_id
```

If your extension is already published, `EXTENSION_ID` is the ID in your Web Store URL.

Example from your listing URL:

```text
https://chromewebstore.google.com/detail/tica-estimated-standings/olfkdnhkdfekmclcmpkcmgnmdjebjooc
EXTENSION_ID=olfkdnhkdfekmclcmpkcmgnmdjebjooc
```

Or export them in your shell:

```sh
export CLIENT_ID=your_client_id
export CLIENT_SECRET=your_client_secret
export REFRESH_TOKEN=your_refresh_token
export EXTENSION_ID=your_extension_id
```

## Step 5: Test the Setup

1. Run: `npm run package`
2. Run: `npm run upload` (this will upload without publishing)

## More Info

- Official Chrome docs: <https://developer.chrome.com/docs/webstore/using-api>
- Token helper guide: <https://github.com/fregante/chrome-webstore-upload-keys>

