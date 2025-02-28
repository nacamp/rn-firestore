import React from "react";
// import {
//     View,
//     TouchableOpacity,
//     Text,
//     StyleSheet,
//     TouchableWithoutFeedback,
// } from "react-native";

import { IS_WEB, View, TouchableOpacity, Text, StyleSheet } from "./PlatformWrapper";

interface ModalProps {
    visible: boolean;
    onClose?: () => void;
    children: React.ReactNode;
    showCloseButton?: boolean;
}

/** ✅ Web & Native 공통 Modal */
export function Modal({ visible, onClose, children, showCloseButton = true }: ModalProps) {
    if (!visible) return null; // ✅ macOS에서는 기본 Modal을 사용할 수 없으므로 View로 대체

    return (
        <View style={styles.overlay}>
            <View style={styles.modal}>
                {children}
                {showCloseButton && onClose && (
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    {/* <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}> */}
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        display: IS_WEB ? "flex" : undefined,
        justifyContent: "center",
        alignItems: "center",
        position: IS_WEB ? "fixed" : "absolute",
        top: 0,
        left: 0,

        width: "100%",
        height: "100%",
        
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        ...(!IS_WEB && { zIndex: 100 }),
        
        //zIndex: 100, // ✅ 모달이 항상 위에 표시되도록 설정
    },
    modal: {
        alignItems: "center",
        justifyContent: "center",

        padding: 20,
        borderRadius: 10,
        boxShadow: IS_WEB ? "0px 4px 8px rgba(0,0,0,0.2)" : undefined,
        elevation: IS_WEB ? undefined : 10,


        backgroundColor: "#1E1E1E",
        //zIndex: 200, // ✅ 모달 창이 항상 앞에 표시되도록 설정
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        borderRadius: 5,

        ...IS_WEB
        ? { border: "1px solid #949494" }
        : { borderWidth: 1, borderColor: "#949494", borderStyle: "solid" },

        backgroundColor: "#2C2C2C",
    },
    closeText: {
        color: "white",
    }
});

export default Modal;
