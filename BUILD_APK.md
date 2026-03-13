# Building Android APK for Translation Tool

## Prerequisites
To build the Android APK, you need:
- Node.js and npm/pnpm installed
- Java Development Kit (JDK) 17 or higher
- Android Studio with Android SDK
- Gradle (usually comes with Android Studio)

## Setup Instructions

### 1. Install Dependencies
```bash
cd /workspace/app-a866ydqes8ht
pnpm install
```

### 2. Build the Web Application
```bash
pnpm run build
```

### 3. Sync Capacitor
```bash
npx cap sync android
```

### 4. Open in Android Studio
```bash
npx cap open android
```

### 5. Build APK in Android Studio
1. In Android Studio, go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for the build to complete
3. The APK will be located at: `android/app/build/outputs/apk/debug/app-debug.apk`

## Alternative: Build APK via Command Line

If you have Android SDK and Gradle properly configured:

```bash
cd android
./gradlew assembleDebug
```

The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

## For Production Release

### 1. Generate Signing Key
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing in android/app/build.gradle
Add signing configuration:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('my-release-key.keystore')
            storePassword 'your-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. Build Release APK
```bash
cd android
./gradlew assembleRelease
```

The release APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Current Project Status

✅ Capacitor has been configured
✅ Android platform has been added
✅ Configuration files are ready

⚠️ **Note**: The actual APK build requires Android SDK and cannot be completed in this environment. You need to:
1. Clone this repository to your local machine
2. Install Android Studio and Android SDK
3. Follow the build instructions above

## Testing the App

### On Physical Device
1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Run: `npx cap run android`

### On Emulator
1. Create an Android Virtual Device (AVD) in Android Studio
2. Start the emulator
3. Run: `npx cap run android`

## App Features
- Email-based authentication
- Real-time translation with 20+ languages
- Translation history with filters
- Dark mode support
- Feedback system
- Admin panel
- Fully responsive mobile design

## Support
For issues or questions, refer to:
- Capacitor Documentation: https://capacitorjs.com/docs
- Android Developer Guide: https://developer.android.com/studio/build
