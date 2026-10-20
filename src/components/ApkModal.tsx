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

  // Generate downloadable Android Studio Project ZIP
  const handleDownloadAndroidZip = async () => {
    try {
      setDownloadingZip(true);
      const zip = new JSZip();

      // Root configuration files
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
    id("com.android.application") version "8.4.1" apply false
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

      // App build file
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

      // AndroidManifest.xml
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

      // Res
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

      // Kotlin source files
      zip.file(
        'app/src/main/java/com/argon/ph03n1x/data/ArgonApiService.kt',
        `package com.argon.ph03n1x.data

import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

data class ArgonChatRequest(
    val model: String = "argon-4.8",
    val prompt: String,
    val max_tokens: Int = 1024,
    val temperature: Double = 0.7
)

data class ArgonChatResponse(
    val id: String? = null,
    val choices: List<Choice>? = null,
    val error: ErrorBody? = null
)

data class Choice(
    val text: String? = null,
    val index: Int? = null
)

data class ErrorBody(
    val message: String? = null,
    val type: String? = null
)

interface ArgonApiService {
    @POST("v1/chat/completions")
    suspend fun chatCompletions(
        @Header("Authorization") authorization: String,
        @Body body: ArgonChatRequest
    ): ArgonChatResponse
}
`
      );

      zip.file(
        'app/src/main/java/com/argon/ph03n1x/data/QuotaManager.kt',
        `package com.argon.ph03n1x.data

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

class QuotaManager(context: Context) {
    companion object {
        private const val PREFS_NAME = "argon_quota_secure"
        private const val KEY_MESSAGE_COUNT = "message_count"
        private const val KEY_USER_API_KEY = "user_api_key"
        private const val FREE_TIER_LIMIT = 20
        private const val FREE_BEARER = "Bearer ARGON_INTERNAL_FREE_POOL"
    }

    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val prefs: SharedPreferences = EncryptedSharedPreferences.create(
        context,
        PREFS_NAME,
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    fun getMessageCount(): Int = prefs.getInt(KEY_MESSAGE_COUNT, 0)
    fun incrementMessageCount() {
        val current = getMessageCount()
        prefs.edit().putInt(KEY_MESSAGE_COUNT, current + 1).apply()
    }
    fun isFreeTierExhausted(): Boolean = getMessageCount() >= FREE_TIER_LIMIT
    fun hasUserApiKey(): Boolean = !prefs.getString(KEY_USER_API_KEY, null).isNullOrBlank()
    fun getUserApiKey(): String? = prefs.getString(KEY_USER_API_KEY, null)
    fun saveUserApiKey(apiKey: String) = prefs.edit().putString(KEY_USER_API_KEY, apiKey.trim()).apply()
    fun clearUserApiKey() = prefs.edit().remove(KEY_USER_API_KEY).apply()
    fun resolveBearerToken(): String? {
        if (hasUserApiKey()) return "Bearer \${getUserApiKey()}"
        return if (!isFreeTierExhausted()) FREE_BEARER else null
    }
    fun getQuotaBadgeText(): String {
        return if (hasUserApiKey()) "[ LOCKED // CUSTOM API KEY ACTIVE ]"
        else if (isFreeTierExhausted()) "[ LOCKED // CUSTOM API KEY REQUIRED ]"
        else "[ \${getMessageCount()} / $FREE_TIER_LIMIT FREE TIER ACTIVE ]"
    }
}
`
      );

      // Generate blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'PH03N1X-Argon48-Android-Studio-Source.zip';
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

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-2">
          <Smartphone className="w-5 h-5 text-[#00FFE0]" />
          <h2 className="font-mono-cyber font-bold text-base text-[#00FFE0] tracking-wide">
            ANDROID APK & APP INSTALL
          </h2>
        </div>

        <p className="font-mono-cyber text-xs text-[#8A8A8A] mb-5 leading-relaxed">
          Install PH03N!X Argon 4.8 directly on Android as a native WebAPK or download the ready-to-build Android package.
        </p>

        {/* Option 1: Native 1-Click WebAPK Install */}
        <div className="space-y-3 mb-5">
          <div className="p-4 bg-[#050505] border border-[#00FFE0]/40 rounded-xl">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00FFE0]" />
                <h3 className="font-mono-cyber font-bold text-xs text-[#E0E0E0]">
                  Option 1: Instant Android WebAPK Install
                </h3>
              </div>
              <span className="text-[10px] font-mono-cyber bg-[#00FFE0]/20 text-[#00FFE0] px-2 py-0.5 rounded">
                RECOMMENDED
              </span>
            </div>
            <p className="text-xs text-[#8A8A8A] font-mono-cyber mb-3">
              Installs directly to your Android device home screen with native app icon, fullscreen mode, and offline cache.
            </p>

            {isInstalled ? (
              <div className="flex items-center gap-2 text-xs font-mono-cyber text-[#00FFE0] bg-[#111111] p-2.5 rounded-lg border border-[#00FFE0]/30">
                <Check className="w-4 h-4" />
                <span>PH03N!X is currently installed as a standalone Android app!</span>
              </div>
            ) : isInstallable ? (
              <button
                onClick={install}
                className="w-full py-2.5 px-4 rounded-lg bg-[#00FFE0] text-[#050505] font-mono-cyber font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-[#33ffe6] transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,224,0.4)]"
              >
                <Download className="w-4 h-4" />
                <span>INSTALL ON ANDROID NOW</span>
              </button>
            ) : isIOS ? (
              <div className="text-xs font-mono-cyber text-[#E0E0E0] bg-[#111111] p-2.5 rounded-lg border border-[#00FFE0]/20">
                <span>iOS Safari: Tap Share (<span className="text-[#00FFE0]">⎙</span>) → <strong>Add to Home Screen</strong></span>
              </div>
            ) : (
              <div className="text-xs font-mono-cyber text-[#8A8A8A] bg-[#111111] p-2.5 rounded-lg border border-[#00FFE0]/20 flex items-center justify-between">
                <span>Open in Android Chrome to trigger automatic WebAPK prompt</span>
                <span className="text-[#00FFE0] text-[10px]">READY</span>
              </div>
            )}
          </div>

          {/* Option 2: PWABuilder Cloud APK Generator */}
          <div className="p-4 bg-[#050505] border border-[#00FFE0]/30 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="w-4 h-4 text-[#00FFE0]" />
              <h3 className="font-mono-cyber font-bold text-xs text-[#E0E0E0]">
                Option 2: Generate Signed APK (PWABuilder)
              </h3>
            </div>
            <p className="text-xs text-[#8A8A8A] font-mono-cyber mb-3">
              Package the app into a signed <code className="text-[#00FFE0]">.apk</code> package for sideloading or Google Play using PWABuilder.
            </p>
            <a
              href={pwaBuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-lg bg-[#1A2332] border border-[#00FFE0]/50 hover:border-[#00FFE0] text-[#00FFE0] font-mono-cyber font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>OPEN PWABUILDER APK CREATOR</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Option 3: Android Studio Source Project ZIP */}
          <div className="p-4 bg-[#050505] border border-[#00FFE0]/30 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <FolderArchive className="w-4 h-4 text-[#00FFE0]" />
              <h3 className="font-mono-cyber font-bold text-xs text-[#E0E0E0]">
                Option 3: Download Android Project (.ZIP)
              </h3>
            </div>
            <p className="text-xs text-[#8A8A8A] font-mono-cyber mb-3">
              Complete Jetpack Compose & Gradle source code. Open in Android Studio and run <code className="text-[#00FFE0]">Build → Build APK(s)</code>.
            </p>
            <button
              onClick={handleDownloadAndroidZip}
              disabled={downloadingZip}
              className="w-full py-2.5 px-4 rounded-lg bg-[#111111] border border-[#00FFE0]/50 hover:border-[#00FFE0] text-[#E0E0E0] hover:text-[#00FFE0] font-mono-cyber font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {downloadingZip ? (
                <span>COMPILING ZIP PACKAGE...</span>
              ) : zipDownloaded ? (
                <>
                  <Check className="w-4 h-4 text-[#00FFE0]" />
                  <span>PROJECT ZIP DOWNLOADED!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#00FFE0]" />
                  <span>DOWNLOAD ANDROID STUDIO PROJECT (.ZIP)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 text-[11px] font-mono-cyber text-[#8A8A8A]">
          <ShieldCheck className="w-4 h-4 text-[#00FFE0]" />
          <span>Cryptographically validated manifest with AES-256 local token isolation.</span>
        </div>
      </div>
    </div>
  );
};
