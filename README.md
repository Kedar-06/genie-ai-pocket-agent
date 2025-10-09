# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Clerk Setup for Google Login

This project uses **Clerk** for authentication, specifically to enable **Google Login**. To integrate Clerk into your project, follow the steps below:

### 1. Create a New Application on Clerk

- Visit [Clerk](https://clerk.com/) and sign up or log in.
- Create a new application within the Clerk dashboard.

### 2. Install Clerk SDK

- Install the Clerk SDK into your project by running the following command:

```bash
npm install @clerk/clerk-sdk
```
## Firebase Setup

To integrate Firebase with your Expo app, follow these steps:

### 1. Set up Firebase Project

- Go to the [Firebase Console](https://console.firebase.google.com/).
- Create a new project or select an existing one.
- Once inside your project, go to the **Project Settings** and navigate to the **General** tab.
- Add a new **Web App** to get your Firebase config details.

### 2. Install Firebase SDK

Install the necessary Firebase dependencies for your project:

```bash
npm install firebase

