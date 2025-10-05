import { NextResponse } from "next/server"

export async function GET(req: Request, context: { params: { company: string } }) {
  const { company } = context.params  // access from context, not await
  try {
    const res = await fetch(`https://prepleet.onrender.com/questions/${company}`)
    const data = await res.json()
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (err) {
    return new Response("Error fetching data", { status: 500 })
  }
}

