import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import jwt from "jsonwebtoken";
import axios from "axios";
import { authOptions } from "../../../../../../lib/nextAuth";

export async function GET(req: Request, { params }: { params: { username: string, Ln: string } }) {
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
    const response = await axios.get(`${backendUrl}/users/${params.username}/${params.Ln}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (err: any) {
    console.error("Error fetching user details:", err.message);
    return NextResponse.json({ message: err.message || "error" }, { status: 500 });
  }
}
