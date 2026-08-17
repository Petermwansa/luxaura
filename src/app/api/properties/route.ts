import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: {
        agent: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("GET /api/properties:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch properties.",
      },
      {
        status: 500,
      }
    );
  }
}