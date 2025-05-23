import React from "react";
import {
  Platform,
  View as RNView,
  ScrollView as RNScrollView,
  TouchableOpacity as RNTouchableOpacity,
  Text as RNText,
  TextInput as RNTextInput,
  StyleSheet as RNStyleSheet,
} from "react-native";


export const IS_WEB = Platform.OS === "web"; // ✅ export된 전역 상수
const isWeb = IS_WEB; // ✅ 내부에서는 소문자로 사용

/** ✅ View 래핑 */
export const View = ({ children, style }: { children: React.ReactNode; style?: any }) => {
  return isWeb ? <div style={{ display: "flex", ...style }}>{children}</div> : <RNView style={style}>{children}</RNView>;
};

/** ✅ ScrollView 래핑 */
export const ScrollView = ({ children, style, contentContainerStyle }: { children: React.ReactNode; style?: any; contentContainerStyle?: any }) => {
  return isWeb ? (
    <div style={{ overflowY: "auto", ...style }}>
      <div style={{ display: "flex", flexDirection: "column", ...contentContainerStyle }}>{children}</div>
    </div>
  ) : (
    <RNScrollView style={style} contentContainerStyle={contentContainerStyle}>
      {children}
    </RNScrollView>
  );
};

/** ✅ TouchableOpacity 래핑 */
// background: "none", border: "none",
export const TouchableOpacity = ({ children, style, onPress }: { children: React.ReactNode; style?: any; onPress?: () => void }) => {
  return isWeb ? (
    <button style={{ cursor: "pointer", ...style }} onClick={onPress}>
      {children}
    </button>
  ) : (
    <RNTouchableOpacity style={style} onPress={onPress}>
      {children}
    </RNTouchableOpacity>
  );
};

/** ✅ Text 래핑 (웹에서는 <span>, 줄바꿈이 필요한 경우 <p>) */
export const Text = ({ children, style, block = false }: { children: React.ReactNode; style?: any; block?: boolean }) => {
  return isWeb
    ? block
      ? <p style={{ margin: 0, ...style }}>{children}</p>  // ✅ 웹에서 블록 요소 (줄바꿈 적용)
      : <span style={{ display: "inline", ...style }}>{children}</span>  // ✅ 기본 인라인 요소
    : <RNText style={style}>{children}</RNText>;
};

/** ✅ TextInput 래핑 (웹에서는 <input>, multiline이면 <textarea>) */
export const TextInput = ({ style, multiline = false, onChangeText, ...props }: any) => {
  return isWeb ? (
    multiline ? (
      <textarea
        style={{ border: "0px solid #999", padding: "1px", width: "100%", height: "100%", resize: "vertical", ...style, }}
        onChange={(e) => onChangeText?.(e.target.value)} // ✅ 네이티브와 동일한 onChangeText 지원
        {...props}
      />
    ) : (
      /** ✅ 기본적으로 `<input>` 사용 */
      <input
        style={{ border: "0px solid #999", padding: "1px", ...style, }}
        onChange={(e) => onChangeText?.(e.target.value)} // ✅ onChangeText 사용 가능하게 변환
        {...props}
      />
    )
  ) : (
    <RNTextInput style={style} multiline={multiline} onChangeText={onChangeText} {...props} />
  );
};


/** ✅ StyleSheet 래핑 */
export const StyleSheet = {
  create: (styles: any) => (isWeb ? styles : RNStyleSheet.create(styles)),
};
