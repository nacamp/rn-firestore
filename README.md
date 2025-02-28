# result
```
firesote를 macos desktop으로 만들 계획이었으나
1.firestore를 admin 권한으로 접근이 불가능
컬랙션마다 사용자에게 접근권한을 부여해야 함

2.native에서 async eval이슈
macos native에서 await 관련코드가 
const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
eval
로 처리가 안됨

결과물을 접근가능한 컬랙션에서 조회하고 결과 와 쿼리 히스토리를 볼 수 있음
```
# setup
## web
```bash
npm create vite@latest firestore --template react-ts
cd firestore
npm install
npm install react-native-web --force #native랑 같은 코드를 만들려고

npm run dev
```
vite.config.ts
```js
  resolve: {
    alias: {
      "react-native": "react-native-web",
    },
  },

npm install firebase --force
``` 

## react native
### Package Manager
ruby -v 이 3.1 이상이 아니면
```bash
brew install ruby
brew --prefix ruby
echo 'export PATH=/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

cocoapods
```bash
sudo gem install cocoapods
sudo gem update --system 3.6.3
pod --version
1.16.2
```

### 파일변경 감지
```bash
brew install watchman
```

### 프로젝트 생성
```bash
npm view react-native@0.75.x version
npx @react-native-community/cli init rnFirestore --version 0.75.5
cd rnFirestore
npx react-native-macos-init
# 0.75.5은 아래 작업필요 없음
cd macos
pod install
```
참고 0.76 버젼을 설치하니 TextInput에서 crash 발생

### xcode
``` bash
cd ~/src/react/rnFirestore/macos
open rnFirestore.xcworkspace 

# 배포 빌드
Product -> Archive
# 빌드된 app 추출
Window->Organizer
Distribute app -> custom ->  copy app
# 설정: 실행, 빌드, 아카이브
Product -> Scheme -> Edit Scheme
```

### 실행
```bash
# 두개의 창에서 
cd ~/src/react/rnFirestore
npx react-native start 
npx react-native run-macos
# watchman watch-list
```
### package
```bash
npm install @react-native-firebase/app
npm install @react-native-firebase/auth
npm install @react-native-firebase/firestore
cd macos && pod install

https://www.npmjs.com/package/react-native-dotenv
npm install react-native-dotenv
npm install --save @types/react-native-dotenv
env.d.ts
babel.config.ts
plugins: [['module:react-native-dotenv']],
```

## native mac
```bash
npm create vite@latest firestore --template react-ts
cd firestore
npm install
npm install react-native-web --force

npm run dev
```

# Reference
## General
```
Yoga
https://www.yogalayout.dev/


flex-grow, flex-shrink
https://velog.io/@dlwoxhd/CSS-%ED%94%8C%EB%A0%89%EC%8A%A4%EB%B0%95%EC%8A%A4flex-flex-grow%EC%99%80-flex-shrink-%EC%86%8D%EC%84%B1

flex
https://studiomeal.com/archives/197

css
https://codingeverybody.kr/category/css/

css -> react native
https://csstox.surge.sh/


case: 스크롤이 안먹을때 minHeight
https://nayah.tistory.com/133

```
## native

- https://reactnative.dev
- https://github.com/Microsoft/react-native-macos
- https://microsoft.github.io/react-native-windows/docs/rnm-getting-started

- Different CSS vs React Native Style
- https://medium.com/@damiankolenda7/different-css-vs-react-native-style-f976b6fa9615

color
- https://www.w3.org/TR/css-color-3/#svg-color
- https://reactnative.dev/docs/colors

- samples
- https://github.com/ReactNativeNews/React-Native-Apps
- https://reactnative.directory/popular

- cocoapods
- https://zeddios.tistory.com/25
- https://cocoapods.org/

