import React, { useState } from 'react';
import { X, Smartphone, Download, ExternalLink, ShieldCheck, Check, Sparkles, FolderArchive } from 'lucide-react';
import JSZip from 'jszip';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkModalProps {
  onDismiss: () => void;
}

export const ApkModal: React.FC<ApkModalProps> = ({ onDismiss }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [zipDownloaded, setZipDownloaded] = useState(false);

  const handleDownloadAndroidZip = async () => {
    try {
      setDownloadingZip(true);
      const zip = new JSZip();

      // Root files
      zip.file(
        'settings.gradle.kts',
        `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "PH03N1X"
include(":app")
`
      );

      zip.file(
        'build.gradle.kts',
        `plugins {
    id("com.android.application") version "8.5.0" apply false
    id("org.jetbrains.kotlin.android") version "1.9.24" apply false
}
`
      );

      zip.file(
        'gradle.properties',
        `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
`
      );

      // App build.gradle.kts
      zip.file(
        'app/build.gradle.kts',
        `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.argon.ph03n1x"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.argon.ph03n1x"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "4.8.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            isShrinkResources = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            isMinifyEnabled = false
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.14"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.06.00")
    implementation(composeBom)
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.3")
    implementation("androidx.activity:activity-compose:1.9.0")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.3")
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
    implementation("androidx.security:security-crypto:1.1.0-alpha06")
}
`
      );

      // Manifest + resources
      zip.file(
        'app/src/main/AndroidManifest.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <application
        android:allowBackup="false"
        android:label="PH03N!X - Argon 4.8"
        android:supportsRtl="true"
        android:theme="@style/Theme.Ph03n1x">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`
      );

      zip.file(
        'app/src/main/res/values/strings.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">PH03N!X - Argon 4.8</string>
</resources>
`
      );

      zip.file(
        'app/src/main/res/values/themes.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.Ph03n1x" parent="android:Theme.Material.NoActionBar">
        <item name="android:statusBarColor">#050505</item>
        <item name="android:navigationBarColor">#050505</item>
        <item name="android:windowBackground">#050505</item>
    </style>
</resources>
`
      );

      // Minimal note file
      zip.file(
        'README.txt',
        `PH03N!X - Argon 4.8 Android Project

1. Open this folder in Android Studio
2. Let Gradle sync
3. Build → Build Bundle(s) / APK(s) → Build APK(s)

The full source code (MainActivity, QuotaManager, Repository, etc.) 
should be added from the original AE repository or generated separately.
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'PH03N1X-Argon48-Android-Studio-Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setZipDownloaded(true);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const pwaBuilderUrl = `https://www.pwabuilder.com/?url=${encodeURIComponent(appUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#111111] border border-[#00FFE0] rounded-[16px] p-6 shadow-[0_0_35px_rgba(0,255,224,0.3)] relative text-left"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-[#8A8A8A] hover:text-[#00FFE0] transition-colors p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <Smartphone className="w-5 h-5 text-[#00FFE0]" />
          <h2 className="font-mono-cyber font-bold text-base text-[#00FFE0] tracking-wide">
            ANDROID APK & APP INSTALL
          </h2>
        </div>

        <p className="font-mono-cyber text-xs text-[#8A8A8A] mb-5 leading-relaxed">
          Install PH03N!X Argon 4.8 on Android using any of the methods below.
        </p>

        <div className="space-y-3 mb-5">
          {/* Option 1 - WebAPK */}
          <div className="p-4 bg-[#050505] border border-[#00FFE0]/40 rounded-xl">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00FFE0]" />
                <h3 className="font-mono-cyber font-bold text-xs text-[#E0E0E0]">
                  Option 1: Instant WebAPK Install
                </h3>
              </div>
              <span className="text-[10px] font-mono-cyber bg-[#00FFE0]/20 text-[#00FFE0] px-2 py-0.5 rounded">
                RECOMMENDED
              </span>
            </div>
            <p className="text-xs text-[#8A8A8A] font-mono-cyber mb-3">
              Installs directly to home screen with native icon and fullscreen mode.
            </p>

            {isInstalled ? (
              <div className="flex items-center gap-2 text-xs font-mono-cyber text-[#00FFE0] bg-[#111111] p-2.5 rounded-lg border border-[#00FFE0]/30">
                <Check className="w-4 h-4" />
                <span>Already installed as a standalone app</span>
              </div>
            ) : isInstallable ? (
              <button
                onClick={install}
                className="w-full py-2.5 px-4 rounded-lg bg-[#00FFE0] text-[#050505] font-mono-cyber font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-[#33ffe6] transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>INSTALL ON ANDROID NOW</span>
              </button>
            ) : isIOS ? (
              <div className="text-xs font-mono-cyber text-[#E0E0E0] bg-[#111111] p-2.5 rounded-lg border border-[#00FFE0]/20">
                iOS: Tap Share → <strong>Add to Home Screen</strong>
              </div>
            ) : (
              <div className="text-xs font-mono-cyber text-[#8A8A8A] bg-[#111111] p-2.5 rounded-lg border border-[#00FFE0]/20">
                Open in Android Chrome to see the install prompt
              </div>
            )}
          </div>

          {/* Option 2 - PWABuilder */}
          <div className="p-4 bg-[#050505] border border-[#00FFE0]/30 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="w-4 h-4 text-[#00FFE0]" />
              <h3 className="font-mono-cyber font-bold text-xs text-[#E0E0E0]">
                Option 2: Generate Real Signed APK
              </h3>
            </div>
            <p className="text-xs text-[#8A8A8A] font-mono-cyber mb-3">
              Use PWABuilder to create a proper signed .apk for sideloading or Play Store.
            </p>
            <a
              href={pwaBuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-lg bg-[#1A2332] border border-[#00FFE0]/50 hover:border-[#00FFE0] text-[#00FFE0] font-mono-cyber font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>OPEN PWABUILDER</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Option 3 - Source ZIP */}
          <div className="p-4 bg-[#050505] border border-[#00FFE0]/30 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <FolderArchive className="w-4 h-4 text-[#00FFE0]" />
              <h3 className="font-mono-cyber font-bold text-xs text-[#E0E0E0]">
                Option 3: Android Studio Project (.ZIP)
              </h3>
            </div>
            <p className="text-xs text-[#8A8A8A] font-mono-cyber mb-3">
              Download a starter project structure. Open in Android Studio and build your own APK.
            </p>
            <button
              onClick={handleDownloadAndroidZip}
              disabled={downloadingZip}
              className="w-full py-2.5 px-4 rounded-lg bg-[#111111] border border-[#00FFE0]/50 hover:border-[#00FFE0] text-[#E0E0E0] hover:text-[#00FFE0] font-mono-cyber font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {downloadingZip ? (
                <span>GENERATING ZIP...</span>
              ) : zipDownloaded ? (
                <>
                  <Check className="w-4 h-4 text-[#00FFE0]" />
                  <span>ZIP DOWNLOADED</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#00FFE0]" />
                  <span>DOWNLOAD ANDROID PROJECT</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono-cyber text-[#8A8A8A]">
          <ShieldCheck className="w-4 h-4 text-[#00FFE0]" />
          <span>No broken placeholder APKs. Only real install methods.</span>
        </div>
      </div>
    </div>
  );
};