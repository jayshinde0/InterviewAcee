// app/api/prepleet/companies/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://prepleet.onrender.com/getcompanylist");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}
