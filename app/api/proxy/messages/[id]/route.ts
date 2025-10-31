// app/api/proxy/messages/[id]/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/nextAuth";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import axios from "axios";

// ✅ UPDATE message
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const token = jwt.sign(
    { email: session.user.email },
    process.env.NEXTAUTH_SECRET as string,
    { expiresIn: "15m" }
  );

  try {
    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.put(`${backendUrl}/messages/${params.id}`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error updating message:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// ✅ DELETE message
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = jwt.sign(
    { email: session.user.email },
    process.env.NEXTAUTH_SECRET as string,
    { expiresIn: "15m" }
  );

  try {
    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.delete(`${backendUrl}/messages/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error deleting message:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
