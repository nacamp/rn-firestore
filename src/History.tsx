import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "./PlatformWrapper";

/** ✅ 히스토리 아이템 타입 정의 */
export interface HistoryItem {
  text: string;
  timestamp: string;
}

interface HistoryProps {
  history: HistoryItem[];
  onDelete: (index: number) => void;
}

/** ✅ `History` 컴포넌트 */
export const History = ({ history, onDelete }: HistoryProps) => {
  return (
    <ScrollView style={styles.container}>
      {history.length > 0 ? (
        history.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => onDelete(index)}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.historyText}>{item.text}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.historyText}>No history</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxHeight: "100%",
    padding: 2,
    minHeight: 0,

    backgroundColor: "inherit",
  },
  card: {
  flexDirection: "column",
  position: "relative",
  alignItems: "flex-start",
  justifyContent: "center",

  padding: 10,
  borderRadius: 8,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: "#949494",

  backgroundColor: "#2C2C2C",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    width: "100%",
    marginBottom: 5,
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#444",
    borderRadius: 12,
    width: 24,
    height: 24,
  },
  closeButtonText: {
    color: "white",
    fontSize: 14,
  },

  timestamp: {
    color: "#aaa",
    fontSize: 12,
  },
  historyText: {
    color: "white",
    fontSize: 14,
    whiteSpace: "pre-wrap"
  },

});


// export default History;
// /*
//         <Text key={index} style={{ ...styles.historyText, whiteSpace: "pre-line" }}>
//           {item}
//         </Text>
// */