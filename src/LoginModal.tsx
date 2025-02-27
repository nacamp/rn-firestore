import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { logIn, signUp, logOut, getCurrentUser } from "./auth";
import { IS_WEB, View, Text, TouchableOpacity, TextInput, StyleSheet } from "./PlatformWrapper"; // ✅ 웹 & 네이티브 공통 컴포넌트
import Modal from "./Modal"; // ✅ 기존 Modal.tsx 사용

interface LoginModalProps {
    visible: boolean;
    onClose: () => void;
    onLoginSuccess: (user: { uid: string; email: string }) => void;
}

export function LoginModal({ visible, onClose, onLoginSuccess}: LoginModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
          const user = await logIn(email, password); // ✅ 입력받은 이메일과 비밀번호로 로그인 요청
          onLoginSuccess({ uid: user.uid, email: user.email || "" }); // ✅ 성공 시 상위 컴포넌트에 전달
          onClose(); // ✅ 로그인 성공 후 모달 닫기
        } catch (error) {
          console.error("로그인 실패:", error);
        }
      };

    return (
        <Modal visible={visible} onClose={onClose} showCloseButton={false}>
            <View style={styles.container}>
                <Text style={styles.title}>로그인</Text>

                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    //   placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                //   keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    //   placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                //   secureTextEntry
                />

                {/* ✅ 버튼들 */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={{ ...styles.button, ...styles.loginButton }} onPress={handleLogin}>
                        <Text style={styles.buttonText}>로그인</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...styles.button, ...styles.cancelButton }} onPress={onClose}>
                        <Text style={styles.buttonText}>취소</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",

        width: 300,
        padding: 20,
    },
    title: {
        marginBottom: 20,

        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 10,

        color: "black",
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",

        width: "100%",
        marginTop: 10,
    },
    button: {
        flex: 1,
        alignItems: "center",

        padding: 10,
        marginHorizontal: 5,
        ...IS_WEB
            ? { border: "1px #949494 solid" }
            : { borderWidth: 1, borderColor: "#949494", borderStyle: "solid" },
        //borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: "#303030",
    },
    loginButton: {
        background: "inherit",
        // backgroundColor: "#007BFF",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default LoginModal;
