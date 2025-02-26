import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "./firebase"; // `firebase.ts`에서 Firestore 인스턴스 가져오기

// // 🔹 새로운 문서 추가
// export const addDocument = async <T>(collectionName: string, data: T) => {
//   try {
//     const docRef = await addDoc(collection(db, collectionName), data);
//     console.log("Document added with ID:", docRef.id);
//     return docRef.id;
//   } catch (error) {
//     console.error("Error adding document:", error);
//     throw error;
//   }
// };

// 🔹 모든 문서 가져오기
export const getDocuments = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};

// 🔹 특정 문서 가져오기
export const getDocumentById = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

// 🔹 특정 필드로 문서 검색 (예: name="John Doe" 검색)
export const queryDocuments = async (collectionName: string, field: string, value: any) => {
  try {
    const q = query(collection(db, collectionName), where(field, "==", value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error querying documents:", error);
    throw error;
  }
};

// 🔹 문서 업데이트
export const updateDocument = async <T>(collectionName: string, id: string, data: Partial<T>) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
    console.log("Document updated successfully:", id);
    return id;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

// 🔹 문서 삭제
export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    console.log("Document deleted successfully:", id);
    return id;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};
