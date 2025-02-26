import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { app } from "./firebase"; // `firebase.ts`에서 Firebase 앱 가져오기

const auth = getAuth(app);

// 🔹 회원가입 (이메일 & 비밀번호)
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("회원가입 성공:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("회원가입 오류:", error);
    throw error;
  }
};

// 🔹 로그인 (이메일 & 비밀번호)
export const logIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("로그인 성공:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("로그인 오류:", error);
    throw error;
  }
};

// 🔹 로그아웃
export const logOut = async () => {
  try {
    await signOut(auth);
    console.log("로그아웃 성공");
  } catch (error) {
    console.error("로그아웃 오류:", error);
  }
};

// 🔹 현재 로그인한 사용자 가져오기
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
};
