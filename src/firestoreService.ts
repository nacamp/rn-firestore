import { db } from "./firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";

const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

/** ✅ Firestore 쿼리 실행을 위한 eval 함수 */
async function evalQuery(userQuery: string) {
  try {
    (globalThis as any).db = db;
    (globalThis as any).query = query;
    (globalThis as any).collection = collection;
    (globalThis as any).where = where;
    (globalThis as any).limit = limit;
    (globalThis as any).orderBy = orderBy;
    (globalThis as any).getDocs = getDocs;
    const result = await eval(userQuery); // 🔥 eval 실행
    console.log("Query Result:", result);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    return { error: error };
  }
}

function executeFirestoreQuery(input: string) {
  const runQuery = new AsyncFunction("db", "query", "collection", "where", "limit", "orderBy", "getDocs", input);
  return runQuery(db, query, collection, where, limit, orderBy, getDocs)
}
export { executeFirestoreQuery };
