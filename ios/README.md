# HypeMode for iOS

A native shell around the web app that adds what the web can't do:

- **Apple Health** – reads heart rate, sleep, steps, HRV, SpO₂, weight and workouts; writes meals, water, caffeine, workouts and weight.
- **Live heart rate** – over Bluetooth (Heart Rate service 0x180D), with battery level when the band supports it.
- **Widgets** – home and lock screen: recovery, energy and sleep.
- **Smart wake** – local notifications based on sleep cycles.

The app loads the live site, so web updates reach it instantly. Web ↔ native bridge: `window.webkit.messageHandlers.hm`.

| File | Purpose |
|---|---|
| `HypeMode/WebView.swift` | WKWebView, JS bridge, permissions, notifications |
| `HypeMode/Health.swift` | HealthKit read/write |
| `HypeMode/HRM.swift` | Bluetooth heart rate and battery |
| `HypeModeWidget/` | WidgetKit extension |

## Install on your own device (free)

1. Open `HypeModeApp/HypeMode.xcodeproj` in Xcode.
2. For both targets, set **Signing → Team** to your Apple ID.
3. Select your device and press ▶.
4. On the device, trust the developer certificate in Settings → General → VPN & Device Management.

Free signing lasts 7 days; press ▶ again to reinstall.
