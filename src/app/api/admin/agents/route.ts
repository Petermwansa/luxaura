import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authorization = await requireAdmin();

if (!authorization.authorized) {
  return NextResponse.json(
    {
      error: authorization.error,
    },
    {
      status: authorization.status,
    },
  );
}

  try {
    const agents = await prisma.agent.findMany({
      include: {
        _count: {
          select: {
            properties: true,
            enquiries: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(agents);
  } catch (error) {
    console.error("GET ADMIN AGENTS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch agents",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  const authorization = await requireAdmin();

if (!authorization.authorized) {
  return NextResponse.json(
    {
      error: authorization.error,
    },
    {
      status: authorization.status,
    },
  );
}
  try {
    const body = await request.json();

    const {
      name,
      role,
      phone,
      email,
      image,
    } = body;

    if (!name || !role || !phone || !email) {
      return NextResponse.json(
        {
          error: "Name, role, phone and email are required",
        },
        {
          status: 400,
        },
      );
    }

    const existingAgent = await prisma.agent.findFirst({
      where: {
        email,
      },
    });

    if (existingAgent) {
      return NextResponse.json(
        {
          error: "An agent with this email already exists",
        },
        {
          status: 409,
        },
      );
    }

    const agent = await prisma.agent.create({
      data: {
        name,
        role,
        phone,
        email,
        image: image || null,
      },
    });

    return NextResponse.json(agent, {
      status: 201,
    });
  } catch (error) {
    console.error("CREATE AGENT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create agent",
      },
      {
        status: 500,
      },
    );
  }
}