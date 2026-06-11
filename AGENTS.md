# AGENTS.md

## Cursor Cloud specific instructions

This is a React Native 0.76.5 app (`TodosReactNative`). Standard scripts live in `package.json` (`lint`, `test`, `start`, `android`, `ios`).

Environment notes for the cloud VM (headless Linux, no `/dev/kvm`, no macOS):

- The full mobile app cannot be launched in a GUI here: iOS needs macOS, and the Android emulator needs hardware virtualization (`/dev/kvm`), which is unavailable. The Android native build also needs the Android SDK/NDK and Java 17 (the VM ships Java 21); neither is installed by the update script.
- The supported dev workflow is the JS/Metro pipeline:
  - `npm run lint` and `npm test` (jest) run as-is.
  - `npm start` runs the Metro dev server on port 8081. Verify it with `curl http://localhost:8081/status` (expects `packager-status:running`).
  - To confirm the whole app compiles, fetch a bundle from a running Metro server: `curl "http://localhost:8081/index.bundle?platform=android&dev=true&minify=false"` (expects HTTP 200; this transforms `App.tsx` and all app code). The output is a generated artifact — do not commit it (`*.jsbundle` is gitignored).
