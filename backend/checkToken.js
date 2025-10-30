import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZjRiNWU1Y2YyYzYwMjU4N2RhMzY2NiIsImVtYWlsIjoiMTIzNDU2QHFxLmNvbSIsImlhdCI6MTc2MTgwNjU5OSwiZXhwIjoxNzYyNDExMzk5fQ.oF-aoq1LTXCFDhw0y9hRnQWH1WeaifPprcgjQo070oE"; // ← 这里换成刚复制的 token
const secret = process.env.JWT_SECRET;

try {
  const decoded = jwt.verify(token, secret);
  console.log("✅ token 有效，对应用户：", decoded);
} catch (e) {
  console.error("❌ token 无效：", e.message);
}