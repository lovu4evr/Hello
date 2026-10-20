import React, { useState } from 'react';
import { ChatMessage } from '../data/types';
import { Bot, User, Download, Smartphone, ShieldCheck, Sparkles, FolderArchive, Check } from 'lucide-react';
import JSZip from 'jszip';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MessageBubbleProps {
  message: ChatMessage;
  onOpenApkModal?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onOpenApkModal }) => {
  const isUser = message.isUser;
  const isApk = message.isApkAction || message.text.includes('APK PACKAGING SYSTEM') || message.text.includes('.apk');
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [zipDownloaded, setZipDownloaded] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setDownloadingZip(true);
      const zip = new JSZip();

      zip.file(
        'settings.gradle.kts',
        `pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }
dependencyResolutionManagement { repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS); repositories { google(); mavenCentral() } }
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
        'app/build.gradle.kts',
        `plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }
android {
    namespace = "com.argon.ph03n1x"
    compileSdk = 34
    defaultConfig { applicationId = "com.argon.ph03n1x"; minSdk = 26; targetSdk = 34; versionCode = 1; versionName = "4.8.0" }
    buildFeatures { compose = true }
    composeOptions { kotlinCompilerExtensionVersion = "1.5.14" }
}
dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.06.00")
    implementation(composeBom)
    implementation("androidx.compose.material3:material3")
}
`
      );

      zip.file(
        'app/src/main/AndroidManifest.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <application android:label="PH03N!X - Argon 4.8">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'PH03N!X-Argon48-Android-Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setZipDownloaded(true);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div
      className={`w-full flex ${
        isUser ? 'justify-end' : 'justify-start'
      } items-start gap-2.5 my-2`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-[#111111] border border-[#00FFE0]/50 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_6px_rgba(0,255,224,0.2)]">
          <Bot className="w-4 h-4 text-[#00FFE0]" />
        </div>
      )}

      <div
        className={`max-w-[90%] sm:max-w-[480px] rounded-[12px] px-3.5 py-2.5 text-[14px] leading-relaxed transition-all shadow-md ${
          isUser
            ? 'bg-[#1A2332] text-[#E0E0E0] rounded-tr-sm border border-slate-700/50'
            : 'bg-[#111111] text-[#E0E0E0] border border-[#00FFE0]/40 rounded-tl-sm shadow-[0_0_12px_rgba(0,255,224,0.06)]'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{message.text}</div>

        {/* Interactive In-Terminal APK Card */}
        {isApk && !isUser && (
          <div className="mt-3 pt-3 border-t border-[#00FFE0]/25 space-y-2.5 font-mono-cyber text-xs">
            <div className="bg-[#050505] p-2.5 rounded-lg border border-[#00FFE0]/30 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-[#00FFE0] font-bold">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  PH03N!X-Argon-4.8.apk
                </span>
                <span className="bg-[#00FFE0]/20 px-1.5 py-0.5 rounded text-[10px]">
                  SDK 34 (Android 14)
                </span>
              </div>
              <div className="text-[10px] text-[#8A8A8A] flex justify-between">
                <span>Package: com.argon.ph03n1x</span>
                <span>Size: 2.7 KB</span>
              </div>
            </div>

            {/* Direct Download Button */}
            <a
              href="/download/apk"
              download="PH03N!X-Argon-4.8.apk"
              className="w-full py-2 px-3 rounded-lg bg-[#00FFE0] text-[#050505] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#33ffe6] transition-all shadow-[0_0_10px_rgba(0,255,224,0.4)] cursor-pointer select-none"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD APK (.apk)</span>
            </a>

            {/* Secondary actions: WebAPK install & Source zip */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {isInstallable ? (
                <button
                  onClick={install}
                  className="py-1.5 px-2 bg-[#1A2332] border border-[#00FFE0]/40 hover:border-[#00FFE0] text-[#00FFE0] rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Install WebAPK</span>
                </button>
              ) : isInstalled ? (
                <div className="py-1.5 px-2 bg-[#1A2332] text-[#00FFE0] rounded flex items-center justify-center gap-1 text-[10px]">
                  <Check className="w-3 h-3" />
                  <span>Installed App</span>
                </div>
              ) : (
                <button
                  onClick={onOpenApkModal}
                  className="py-1.5 px-2 bg-[#1A2332] border border-[#00FFE0]/40 hover:border-[#00FFE0] text-[#00FFE0] rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>APK Options</span>
                </button>
              )}

              <button
                onClick={handleDownloadZip}
                disabled={downloadingZip}
                className="py-1.5 px-2 bg-[#111111] border border-slate-700 hover:border-[#00FFE0] text-[#E0E0E0] rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {zipDownloaded ? (
                  <>
                    <Check className="w-3 h-3 text-[#00FFE0]" />
                    <span>ZIP Saved</span>
                  </>
                ) : (
                  <>
                    <FolderArchive className="w-3 h-3 text-[#00FFE0]" />
                    <span>Project .ZIP</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-[#8A8A8A] pt-0.5">
              <ShieldCheck className="w-3 h-3 text-[#00FFE0]" />
              <span>Signed with Android debug/release keystore. Direct install ready.</span>
            </div>
          </div>
        )}

        {message.timestamp && (
          <div
            className={`text-[10px] mt-1 font-mono-cyber opacity-50 ${
              isUser ? 'text-right text-[#00FFE0]' : 'text-left text-[#8A8A8A]'
            }`}
          >
            {message.timestamp}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-lg bg-[#1A2332] border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
          <User className="w-4 h-4 text-cyan-200" />
        </div>
      )}
    </div>
  );
};
