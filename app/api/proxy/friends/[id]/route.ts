import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import jwt from "jsonwebtoken";
import axios from "axios";
import { authOptions } from "../../../../../lib/nextAuth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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
    const response = await axios.put(`${backendUrl}/friends/${params.id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error in PUT /proxy/friends/[id]:", error.message);
    return NextResponse.json(
      { message: "Failed to update friend request", error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}

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
    const response = await axios.delete(`${backendUrl}/friends/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Error in DELETE /proxy/friends/[id]:", error.message);
    return NextResponse.json(
      { message: "Failed to delete friend request", error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
