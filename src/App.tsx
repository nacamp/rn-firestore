import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from "./PlatformWrapper"; // ✅ 웹 & 네이티브 공통 컴포넌트
import TabView from "./TabView"; // ✅ 웹 & 네이티브 공통 컴포넌트


const HistoryTab = ({ queryHistory }: { queryHistory: string[] }) => (
  <ScrollView style={{
    width: "100%",
    maxHeight: "100%",
    backgroundColor: "#fff0f0",
  }}
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


const MacOSLayout = () => {
  const [inputText, setInputText] = useState("");
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabs = [
    { label: "Result", content: <Text style={styles.contentText}>This is the content of Result Tab</Text> },
    { label: "Query", content: <HistoryTab queryHistory={queryHistory} /> },
  ];

  const handleRun = () => {
    console.log("Run 버튼 클릭");
    if (inputText.trim().length > 0) {
      setQueryHistory((prevHistory) => [inputText, ...prevHistory]); // 새로운 입력값을 히스토리 앞에 추가
      setActiveTab(1);
    }
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
          backgroundColor: "#fff0f0",
          // justifyContent: "flex-start", // contentContainerStyle 에서만 사용가능
        }}
        contentContainerStyle={{
          alignItems: "flex-start", 
        }}
        >
          {dummyCollection.length > 0 ? (
            dummyCollection.map((item, index) => (
              <TouchableOpacity style={{ ...styles.historyText }} key={index} onPress={() => handleItemClick(`${index}-${item}`)}>
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
  container: { flex: 1, flexDirection: "row", height: "100%", minHeight: 0 },
  leftColumn: { flex: 1, flexDirection: "column",  justifyContent: "flex-start", height: "100%", backgroundColor: "#ddd" },
  rightColumn: { flex: 3, flexDirection: "column", minHeight: 0 },

  topRow: { flex: 1, flexDirection: "column", backgroundColor: "#ccc", alignItems: "center", padding: 0 },
  input: {
    flex: 3,
    height: "100%",
    width: "100%",
    border: "none",
  },
  buttonGroup: { flex: 1, flexDirection: "row", width: "100%", justifyContent: "space-between", margin: 0 },
  button: { flex: 1, backgroundColor: "#888", paddingVertical: 5, marginVertical: 0, marginHorizontal: 2, alignItems: "center" },


  bottomRow: { flex: 2, backgroundColor: "#bbb", minHeight: 0 },
  // HistoryTab
  historyText: { alignItems: "flex-start", fontSize: 16, paddingVertical: 5, color: "#000" },

});

export default MacOSLayout;

