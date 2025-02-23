import React, { useState } from "react";
import { Text, ScrollView } from "./PlatformWrapper";
import TabView from "./TabView";

const HistoryTab = () => (
  <ScrollView style={{
    width: "100%",
    maxHeight: "100%",  // 부모 높이를 초과하지 않도록 제한
    backgroundColor: "#fff0f0",
  }}>
    <div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
      <div>aaaa</div>
    </div>
  </ScrollView>
);


const MacOSLayout = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const tabs = [
    { label: "Result", content: <Text>This is the content of Result Tab</Text> },
    { label: "Query", content: <HistoryTab /> },
  ];

  return (
    <TabView tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
  );
};

export default MacOSLayout;

