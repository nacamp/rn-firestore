import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "./PlatformWrapper";

interface TabItem {
  label: string;
  content: React.ReactNode; // ✅ 콘텐츠를 React 노드로 받음
}

interface TabViewProps {
  tabs: TabItem[];
  activeTab: number;
  setActiveTab: (tabIndex: number) => void;
}

const TabView = ({ tabs, activeTab, setActiveTab }: TabViewProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveTab(index)}
              style={{
                ...styles.tabButton,
                ...(isActive && styles.activeTab),
              }}
            >
              <Text style={{ ...styles.tabText, ...(isActive && styles.activeText) }} block>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.tabContent}>{tabs[activeTab].content}</View>
    </View>
  );
}

// ✅ React Native 스타일 적용 (StyleSheet 사용)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    padding: 16,
    minHeight: 0,  // 스크로링 가능하도록 최소 높이 설정
  },
  tabHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.3s ease-in-out, border-bottom-color 0.3s ease-in-out",
    // background: "none",
    // outline: "none",
    border: "none",
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: "#ddd",
    color: "#555"
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomStyle: "solid",
    borderBottomColor: "#007bff",
    color: "#007bff"
  },
  tabText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  activeText: {
    color: "#007bff",
  },
  tabContent: {
    marginTop: 8,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 4,
    alignItems: "flex-start",
    //justifyContent: "center",
    flex: 1,
    minHeight: 0, // 스크로링 가능하도록 최소 높이 설정
  },
  contentText: {
    fontSize: 16,
    color: "#333",
  },
});


export default TabView;