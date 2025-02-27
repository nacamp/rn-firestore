import React from "react";
import {
    Platform,
    View as RNView,
    Modal as RNModal,
    StyleSheet as RNStyleSheet,
} from "react-native";
import { View, TouchableOpacity, Text, StyleSheet } from "./PlatformWrapper"; // ✅ 기존 래핑된 컴포넌트 활용

const isWeb = Platform.OS === "web";

interface ModalProps {
    visible: boolean;
    onClose?: () => void;
    children: React.ReactNode;
    showCloseButton?: boolean;
}

/** ✅ Web & Native 공통 Modal */
export function Modal({ visible, onClose, children, showCloseButton = true }: ModalProps) {
    if (isWeb) {
        if (!visible) return null; // ✅ 웹에서는 `visible=false`일 때 아무것도 렌더링 안 함

        return (
            <div style={styles.overlay}>
                <div style={styles.modal}>
                    {children}
                    {showCloseButton && onClose && (
                        <div>
                            <button style={styles.closeButton} onClick={onClose}>
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <RNModal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
            <RNView style={styles.overlay}>
                <RNView style={styles.modal}>
                    {children}
                    {showCloseButton && onClose && (
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    )}
                </RNView>
            </RNView>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        display: isWeb ? "flex" : undefined,
        justifyContent: "center",
        alignItems: "center",
        position: isWeb ? "fixed" : "absolute",
        top: 0,
        left: 0,

        width: "100%",
        height: "100%",
        
        backgroundColor: "rgba(0, 0, 0, 0.5)",

    },
    modal: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        padding: 20,
        borderRadius: 10,
        // width: 300,
        // height: 200, // ✅ 팝업 크기 조정
        boxShadow: isWeb ? "0px 4px 8px rgba(0,0,0,0.2)" : undefined,
        elevation: isWeb ? undefined : 10,

        background: "#1E1E1E",
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        borderRadius: 5,

        background: '#2C2C2C',
        ...Platform.select({
            web: { border: "1px #949494 solid" },
            default: { borderWidth: 1, borderColor: "#949494", borderStyle: "solid" },
          }),

        textAlign: "center",
        cursor: isWeb ? "pointer" : undefined,
    },
});

export default Modal;