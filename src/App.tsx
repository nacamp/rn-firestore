import React, { useState, useEffect } from "react";
import { IS_WEB, View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from "./PlatformWrapper"; // ✅ 웹 & 네이티브 공통 컴포넌트
import TabView from "./TabView";
import { queryDocuments } from "./firestoreUtils";
import { logIn, signUp, logOut, getCurrentUser } from "./auth";
import LoginModal from "./LoginModal";
import { db } from "./firebase";
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from "firebase/firestore";

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

const ResultTab = ({ queryHistory }: { queryHistory: string[] }) => (
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

const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;


async function evalQuery(userQuery: string) {
  try {
    (globalThis as any).db = db;
    (globalThis as any).query = query;
    (globalThis as any).collection = collection;
    (globalThis as any).where = where;
    (globalThis as any).limit = limit;
    (globalThis as any).orderBy = orderBy;
    (globalThis as any).getDocs = getDocs;
    const result = await eval(userQuery); // 🔥 eval 실행
    console.log("Query Result:", result);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    return { error: error };
  }
}

const MacOSLayout = () => {
  const [inputText, setInputText] = useState("");
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [resultHistory, setResultHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [user, setUser] = useState<null | { uid: string; email: string }>(null);
  const [isLoginOpen, setLoginOpen] = useState(false);


  const tabs = [
    { label: "Result", content: <HistoryTab queryHistory={resultHistory} /> },
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
    if (inputText.trim().length > 0) {
      console.log("Run 버튼 클릭");
      const runQuery = new AsyncFunction("db", "query", "collection", "where", "limit", "orderBy", "getDocs", inputText);
      setQueryHistory((prevHistory) => [inputText, ...prevHistory]); // 새로운 입력값을 히스토리 앞에 추가
      // setResultHistory((prevHistory) => [inputText, ...prevHistory]); // 새로운 입력값을 히스토리 앞에 추가
      runQuery(db, query, collection, where, limit, orderBy, getDocs)
        .then((result: any) => {
          setResultHistory((prevHistory) => [JSON.stringify(result, null, 2), ...prevHistory]); // 새로운 입력값을 히스토리 앞에 추가
        })
        .catch((error: any) => {
          setResultHistory((prevHistory) => [JSON.stringify(error.message, null, 2), ...prevHistory]); // 새로운 입력값을 히스토리 앞에 추가
        });
      setActiveTab(0);
    }
  };

  const handleLogout = async () => {
    await logOut();
    setUser(null);
  };

  // const dummyCollection = Array(5).fill("dummy collection");
  const dummyCollection = ["user", "post", "comment", "like", "follow"];
  const handleItemClick = (item: string) => {
    // const q =`
    //   const q = query(collection(db, "${item}")
    //     //,where("key", "==", value)
    //     ,limit(1)
    //   );
    //   const querySnapshot = await getDocs(q);
    //   return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // `;

    const q = `
      const q = query(collection(db, "${item}")
        //,where("key", "==", value)
        ,limit(1)
      );
      return getDocs(q)
        .then(querySnapshot => querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        .catch(error => ({ error: error.message }));
    `;
    setInputText(q);
    console.log(`${item} clicked`);
  };

  return (

    <View style={styles.container}>
      <LoginModal visible={isLoginOpen} onClose={() => setLoginOpen(false)} onLoginSuccess={setUser} />
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
              <TouchableOpacity style={{ alignItems: "flex-start", background: 'inherit', border: 'none' }} key={index} onPress={() => handleItemClick(`${item}`)}>
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
              <TouchableOpacity style={styles.button} onPress={() => setLoginOpen(true)}>
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
    ...IS_WEB
      ? { border: "1px #949494 solid" }
      : { borderWidth: 1, borderColor: "#949494", borderStyle: "solid" },

    backgroundColor: '#1E1E1E',
    color: 'white'
  },
  leftColumn: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",

    height: "100%",
    ...IS_WEB
      ? { border: "1px solid #949494" }
      : { borderWidth: 1, borderColor: "#949494", borderStyle: "solid" },

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

    ...IS_WEB
      ? { border: "1px solid #949494" }
      : { borderWidth: 1, borderColor: "#949494", borderStyle: "solid" },
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