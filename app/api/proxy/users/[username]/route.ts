import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/nextAuth";
import jwt from "jsonwebtoken";


export async function GET(req: Request, { params }: { params: { username: string } }) {
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
    const resp = await fetch(`${backendUrl}/users/username/${params.username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "error" }, { status: 500 });
  }
}
