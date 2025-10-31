// app/api/proxy/links/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authOptions } from "../../../../lib/nextAuth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const token = jwt.sign(
  { email: session.user.email },
  process.env.NEXTAUTH_SECRET as string,
  { expiresIn: '15m' }
   );


  try {
    const data = await req.json();
    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.post(`${backendUrl}/links`, data, { headers: { Authorization: `Bearer ${token}` } });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error adding link:", error.response?.data || error.message);
    return NextResponse.json({ message: "Failed to add link", error: error.response?.data || error.message }, { status: error.response?.status || 500 });
  }
}
