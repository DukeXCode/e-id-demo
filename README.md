# Welcome to E-ID-Demo 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Start app
NPM and Node need to be installed in order to run the app.

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

## Start server component

Install dependencies:

`cd central-server
pip install -r requirements.txt`

Run the server:

`uvicorn main:app --reload`

Test the endpoint:

`curl -X POST http://localhost:8000/api/verify
-H "Content-Type: application/json"
-d '{"publicKey":"pk_alice_123","callbackUrl":"https://webhook.site/your-id"}'`

## Start Test-Webshop

Install dependencies:
`cd test-webshop
npm install`

Start the webshop:
`npm run start`

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
