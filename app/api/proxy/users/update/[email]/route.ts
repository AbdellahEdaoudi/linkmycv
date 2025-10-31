import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../../lib/nextAuth";
import axios from "axios";
import jwt from "jsonwebtoken";

export async function PUT(req: Request, { params }: { params: { email: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = jwt.sign(
      { email: session.user.email },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: "15m" }
    );

    const backendUrl = process.env.BACKEND_URL;
    const formData = await req.formData();

    console.log("🔹 Sending update to backend:", `${backendUrl}/users/${params.email}`);

    const response = await axios.put(
      `${backendUrl}/users/${params.email}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return NextResponse.json(response.data, { status: response.status });

  } catch (error: any) {
    console.error("❌ Error updating user:", error.response?.data || error.message);
    return NextResponse.json(
      { message: "Failed to update user", error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
