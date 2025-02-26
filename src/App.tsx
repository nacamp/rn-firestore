import React, { useState, useEffect } from "react";
import { Platform } from "react-native";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from "./PlatformWrapper"; // ✅ 웹 & 네이티브 공통 컴포넌트
import TabView from "./TabView";
import { queryDocuments } from "./firestoreUtils";
import { logIn, signUp, logOut, getCurrentUser } from "./auth";


const HistoryTab = ({ queryHistory }: { queryHistory: string[] }) => (
  <ScrollView style={{
    width: "100%",
    maxHeight: "100%",
    backgroundColor: "inherit",
  }}
  // contentContainerStyle={{
  //   backgroundColor: "inherit",
  // }}
  >
    {queryHistory.length > 0 ? (
      queryHistory.map((item, index) => (
        <Text key={index} style={{ ...styles.historyText, whiteSpace: "pre-line" }}>
          {item}
        </Text>
      ))
    ) : (
      <Text style={styles.historyText}>No history</Text>
    )}
  </ScrollView>
);


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const MacOSLayout = () => {
  const [inputText, setInputText] = useState("");
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [user, setUser] = useState<null | { uid: string; email: string }>(null);

  const tabs = [
    { label: "Result", content: <Text style={styles.contentText}>This is the content of Result Tab</Text> },
    { label: "Query", content: <HistoryTab queryHistory={queryHistory} /> },
  ];

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser({ uid: currentUser.uid, email: currentUser.email || "" });
      } else {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  const handleRun = async () => {

    console.log("Run 버튼 클릭");
    const queriedUsers = await queryDocuments("user", "name", "이현");
    console.log("Queried users:", queriedUsers);

    console.log(firebaseConfig.apiKey);
    if (inputText.trim().length > 0) {
      setQueryHistory((prevHistory) => [inputText, ...prevHistory]); // 새로운 입력값을 히스토리 앞에 추가
      setActiveTab(1);
    }
  };

  const handleLogin = async () => {
    var email = import.meta.env.VITE_FIREBASE_EMAIL as string
    var password =  import.meta.env.VITE_FIREBASE_PASSWORD as string
    try {
      const user = await logIn(email, password);
      setUser({ uid: user.uid, email: user.email || "" });
      console.log("로그인된 사용자:", user);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  const handleLogout = async () => {
    await logOut();
    setUser(null);
  };

  const dummyCollection = Array(5).fill("dummy collection");
  const handleItemClick = (item: string) => {
    console.log(`${item} clicked`);
  };

  return (

    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <Text>collection list</Text>
        <ScrollView style={{
          width: "100%",
          maxHeight: "100%",
          backgroundColor: "inherit",
          // justifyContent: "flex-start", // contentContainerStyle 에서만 사용가능
        }}
          contentContainerStyle={{
            background: 'inherit',
            alignItems: "flex-start",
          }}
        >
          {dummyCollection.length > 0 ? (
            dummyCollection.map((item, index) => (
              <TouchableOpacity style={{ alignItems: "flex-start", background: 'inherit', border: 'none' }} key={index} onPress={() => handleItemClick(`${index}-${item}`)}>
                <Text style={{ ...styles.historyText }}>
                  {index}-{item}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.historyText}>No history</Text>
          )}
        </ScrollView>
      </View>

      <View style={styles.rightColumn}>
        <View style={styles.topRow}>
          <TextInput
            style={styles.input}
            placeholder="여기에 입력하세요..."
            value={inputText}
            multiline={true}
            onChangeText={setInputText}
          />
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={handleRun}>
              <Text style={styles.buttonText}>Run</Text>
            </TouchableOpacity>

            {!user ? (
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            )}
            {["버튼2", "버튼3", "버튼4"].map((label, index) => (
              <TouchableOpacity key={index} style={styles.button}>
                <Text style={styles.buttonText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.bottomRow}>
          <TabView tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",

    height: "100%",
    minHeight: 0,
    ...Platform.select({
      web: { border: "1px #949494 solid" },
      default: { borderWidth: 1, borderColor: "#949494", borderStyle: "solid" }, // Android/iOS에서 적용
    }),

    backgroundColor: '#1E1E1E',
    color: 'white'
  },
  leftColumn: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",

    height: "100%",
    ...Platform.select({
      web: { border: "1px #949494 solid" },
      default: { borderWidth: 1, borderColor: "#949494", borderStyle: "solid" }, // Android/iOS에서 적용
    }),

    background: 'inherit',
  },
  rightColumn: {
    flex: 3,
    flexDirection: "column",

    minHeight: 0,

    background: 'inherit'
  },
  topRow: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",

    padding: 0,

    background: 'inherit'
  },
  input: {
    flex: 3,

    height: "100%",
    width: "100%",
    border: "none",

    background: '#2C2C2C',
    color: 'white',
  },
  buttonGroup: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",

    width: "100%",
    margin: 0,

    background: 'inherit',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    ...Platform.select({
      web: { border: "1px #949494 solid" },
      default: { borderWidth: 1, borderColor: "#949494", borderStyle: "solid" }, // Android/iOS에서 적용
    }),
    borderRadius: 8,
    paddingVertical: 5,
    marginVertical: 0,
    marginHorizontal: 2,
    minWidth: 70,
    padding: 8,

    background: '#2C2C2C',
    color: 'white',
    overflow: 'hidden',
  },
  bottomRow: {
    flex: 2,

    flexDirection: "column",

    background: 'inherit'
  },
  historyText: {
    alignItems: "flex-start",

    paddingVertical: 5,

    fontSize: 16,
    color: "white"
  },

});

export default MacOSLayout;