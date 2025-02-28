import React, { useState, useEffect } from "react";
import { IS_WEB, View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from "./PlatformWrapper";
import TabView from "./TabView";
import { logOut, getCurrentUser } from "./auth";
import LoginModal from "./LoginModal";
import {History,HistoryItem} from "./History";
import {executeFirestoreQuery  } from "./firestoreService";

type HistoryType = "query" | "result";

const App = () => {
  const [inputText, setInputText] = useState("");
  const [queryHistory, setQueryHistory] = useState<HistoryItem[]>([]);
  const [resultHistory, setResultHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [user, setUser] = useState<null | { uid: string; email: string }>(null);
  const [isLoginOpen, setLoginOpen] = useState(false);

  const tabs = [
    { label: "Result", content: <History history={resultHistory} onDelete={(index) => handleDelete(index, "result")} /> },
    { label: "Query", content: <History history={queryHistory} onDelete={(index) => handleDelete(index, "query")} /> },
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
      // setQueryHistory((prevHistory) => [{ text: inputText, timestamp: new Date().toLocaleString() }, ...prevHistory]);
      // setResultHistory((prevHistory) => [{ text: inputText, timestamp: new Date().toLocaleString() }, ...prevHistory]);
      // const runQuery = new AsyncFunction("db", "query", "collection", "where", "limit", "orderBy", "getDocs", inputText);
      // setQueryHistory((prevHistory) => [{ text: inputText, timestamp: new Date().toLocaleString() }, ...prevHistory]);
      executeFirestoreQuery(inputText)
        .then((result: any) => {
          setResultHistory((prevHistory) => [{ text: JSON.stringify(result, null, 2), timestamp: new Date().toLocaleString() }, ...prevHistory]);
        })
        .catch((error: any) => {
          setResultHistory((prevHistory) => [{ text: JSON.stringify(error.message, null, 2), timestamp: new Date().toLocaleString() }, ...prevHistory]);
        });
      setActiveTab(0);
    }
  };

  const handleLogout = async () => {
    await logOut();
    setUser(null);
  };

  const handleDelete = (index: number, type: HistoryType) => {
    if (type === "query") {
      setQueryHistory((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "result") {
      setResultHistory((prev) => prev.filter((_, i) => i !== index));
    }
    console.log("Delete 버튼 클릭", type, index);
  };

  // const collectionList = Array(5).fill("dummy collection");
  const collectionList = ["user", "getCategoriesWithContents", "sample"];
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
          {collectionList.length > 0 ? (
            collectionList.map((item, index) => (
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
    minHeight: 0,

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

export default App;