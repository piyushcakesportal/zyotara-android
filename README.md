# DashaVaani MVP

DashaVaani is an Android-first, Hindi and English astrology guidance app for career and relationship questions. The same Expo/React Native codebase also supports iOS and web.

## What is complete

- Hindi and English onboarding
- Birth profile with exact, approximate and unknown birth-time options
- Career and relationship question flows
- Review and generation screens
- Structured prediction result
- Two-question daily limit
- Saved history
- Relevant / Not relevant feedback
- Share result
- Edit birth profile
- Delete one result, all history or all personal data
- Secure native storage for birth profile and individual readings
- Android and iOS configuration
- Custom DashaVaani icon
- Replaceable backend API adapter
- Clear demo-mode notice until the live calculation service is connected

## Important limitation

The app runs fully in **demo mode** until a real Vedic astrology backend is connected. Demo answers are clearly labelled and must not be presented as real astrological calculations.

The mobile app must never contain the VedicAstroAPI key or an AI-provider key. Those keys belong on a private backend.

## Run the app on your phone

1. Install Node.js 22 or newer.
2. Install the **Expo Go** app on the phone.
3. Open a terminal in this project.
4. Run:

```bash
npm install
npx expo start
```

5. Scan the QR code using Expo Go.

Android, iOS and web are supported from the same source.

## Validate the project

```bash
npm run typecheck
npm run doctor
npx expo export --platform web
```

## Connect the real prediction backend

1. Deploy a secure backend implementing [backend/API_CONTRACT.md](backend/API_CONTRACT.md).
2. Copy `.env.example` to `.env`.
3. Set:

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-secure-api.example
```

4. Restart Expo.

When the URL is configured, the app sends a `POST` request to:

```text
/v1/predictions
```

If the URL is empty, DashaVaani remains in labelled demo mode.

## Create an Android APK

An Expo account is required for the cloud build:

```bash
npm install --global eas-cli
eas login
eas build --platform android --profile preview
```

The `preview` profile creates an installable APK. The `production` profile is used later for the Play Store build.

## Before a public store launch

- Connect and validate the real astrology calculation provider.
- Connect the controlled AI explanation layer.
- Replace the draft support email and policy website links.
- Publish the privacy policy and terms on a public URL.
- Verify the final Android package and iOS bundle identifiers.
- Complete closed testing required by the Play Console account.
- Test the Hindi layouts on small and large Android devices.
- Obtain explicit consent before transmitting birth details to external providers.

## Package identifiers

Temporary development identifiers:

- Android: `com.dashavaani.app`
- iOS: `com.dashavaani.app`

These can be changed before the first store submission. After an app is submitted, changing its package or bundle identifier creates a different app.

