# *some installations are required to compile
(https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) \n
Installing node.js and npm gets us most of the way there
*there may be some nuances related to Apple devices that might require something like homebrew to get those things installed\n
*visual studio, and android studio aren't really required for this; visual studio code (the lighter version of visual studio) can get the job done\n
*the export feature might not work on Apple devices, lmk if another through app approach would be more convenient\n
(this could be another fun coding adventure for a current crew member)

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


