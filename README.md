# *some installations are required to compile

## 1. Install dependancies
```bash
npm install
```

## 2. Run the program on your computer (to preview changes)
```bash
npm run android
```
or
```bash
npm run ios
```
...depending on your platform

## 3. Exporting to your phone
We'll be using EAS (https://docs.expo.dev/build/introduction/) to turn this code into something that can run on your phone
```bash
npm install -g eas-cli
```
```bash
eas login
```
and depending on your phone...
```bash
eas build -p android
```
```bash
eas build -p ios
```


