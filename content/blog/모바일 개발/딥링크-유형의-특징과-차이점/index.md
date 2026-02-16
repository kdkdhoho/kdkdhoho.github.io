---
title: "딥링크 공부"
description: "네이티브 앱 개발 시 필요한 딥링크에 대해 알아보고 다양한 유형과 특징, 그리고 차이점에 대해 알아본다."
date: 2025-09-25
tags: ["App", "DeepLink"]
draft: true
slug: "post-20250925-6bfc28"
---

# 들어가며

Flutter로 앱을 개발하기 시작하면서 '딥링크'와 '앱링크'라는 용어를 처음 접하게 되었다.  
지금은 이 두 용어에 대해 얕게나마 알고 있는데, 더 깊이 이해하고 적용해보기 위해 정리한다.

# 딥링크란?

## URI 스킴

### Android

```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="pharmpick"/>
</intent-filter>
```

### iOS

```plist
<dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLSchemes</key>
    <array>
        <string>kakaocacab68c7b3fa9abb01dcdefe79c3264</string>
        <string>com.googleusercontent.apps.909965283018-gchpj29g09opb643v21c4fqqrfiprqej</string>
        <string>fb9589744014485692</string>
        <string>pharmpicknaverlogin</string>
        <string>pharmpick</string>
    </array>
</dict>
```

# References

- [토스페이먼츠 기술 블로그 - Android, iOS 웹뷰에서 딥링크 열기](https://www.tosspayments.com/blog/articles/dev-4?utm_source=tossbusiness&utm_medium=blog&utm_campaign=dev-10)
- [토스페이먼츠 기술 블로그 - 딥링크 실전에서 잘 사용하는 방법](https://www.tosspayments.com/blog/articles/dev-10)
