import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import jwt from 'jsonwebtoken';
import { authOptions } from "../../../../lib/nextAuth";


export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = jwt.sign(
    { email: session.user.email },
    process.env.NEXTAUTH_SECRET as string,
    { expiresIn: '15m' }
  );

  try {
    const backendUrl = process.env.BACKEND_URL;
    const response = await axios.get(`${backendUrl}/alldata/${session?.user?.email}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
