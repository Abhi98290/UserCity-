# Google Places API Setup Guide

## Step 1: Get Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Places API
   - Maps SDK for Android
   - Maps SDK for iOS (if using iOS)
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

## Step 2: Add API Key to Your App

Open `src/Screens/LocationPickerScreen.js` and replace:

```javascript
key: 'YOUR_GOOGLE_API_KEY',
```

With your actual API key:

```javascript
key: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
```

## Step 3: Restrict API Key (Optional but Recommended)

In Google Cloud Console:
1. Click on your API key
2. Under "Application restrictions" → Select "Android apps"
3. Add your package name: `com.usercity`
4. Add SHA-1 certificate fingerprint (get from Android Studio or keystore)

## Step 4: Test

1. Run your app
2. Go to Taxi/Porter booking
3. Click on pickup/drop location
4. Start typing an address
5. You should see autocomplete suggestions!

## Important Notes:

- Free tier: 40,000 requests/month
- After that: $0.017 per request
- Set up billing alerts in Google Cloud Console
- For production, always restrict your API key

## Troubleshooting:

If autocomplete doesn't work:
1. Check if Places API is enabled
2. Verify API key is correct
3. Check billing is enabled (required even for free tier)
4. Wait 5-10 minutes after enabling APIs
