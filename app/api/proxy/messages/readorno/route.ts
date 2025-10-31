import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import jwt from "jsonwebtoken";
import axios from "axios";
import { authOptions } from "../../../../../lib/nextAuth";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  console.log("📩 Body received from frontend:", body);

  const token = jwt.sign(
    { email: session.user.email },
    process.env.NEXTAUTH_SECRET as string,
    { expiresIn: "15m" }
  );
  console.log("🔑 Token generated:", token);

  try {
    const backendUrl = process.env.BACKEND_URL;
    console.log("🌍 Backend URL:", backendUrl);

    const response = await axios.put(
      `${backendUrl}/messages/msg/readorno`,
      body,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Error in PUT /proxy/messages/readorno:", error.message);
    console.error("🔍 Full error response:", error.response?.data);

    return NextResponse.json(
      {
        message: "Failed to update message read status",
        error: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
