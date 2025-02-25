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

    background: 'inherit',
  },
  tabHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
    background: 'inherit',
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 10,

    background: '#1E1E1E',
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
    color: "#444444",
  },
  activeText: {
    color: "white",
  },
  tabContent: {
    flex: 1,
    alignItems: "flex-start",

    border: '1px #949494 solid',
    borderRadius: 4,
    marginTop: 8,
    padding: 16,
    minHeight: 0, // 스크로링 가능하도록 최소 높이 설정

    background: 'inherit',
  },
  contentText: {
    background: 'inherit',
    fontSize: 16,
    color: "white",
  },
});


export default TabView;