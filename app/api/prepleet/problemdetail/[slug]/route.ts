import { NextResponse } from "next/server"

export async function GET(req: Request, context: { params: { slug: string } }) {
  const { slug } = context.params  // access from context, not await
  try {
    const res = await fetch(`https://prepleet.onrender.com/prepleet/problem/${slug}`)
    const data = await res.json()
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (err) {
    return new Response("Error fetching data", { status: 500 })
  }
}

