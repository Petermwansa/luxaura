import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: NextRequest, { params }: RouteProps) {
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
    const { id } = await params;

    const agent = await prisma.agent.findUnique({
      where: {
        id,
      },
      include: {
        properties: true,
        _count: {
          select: {
            enquiries: true,
          },
        },
      },
    });

    if (!agent) {
      return NextResponse.json(
        {
          error: "Agent not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error("GET AGENT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch agent",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteProps) {
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
    const { id } = await params;

    const body = await request.json();

    const { name, role, phone, email, image } = body;

    const existingAgent = await prisma.agent.findUnique({
      where: {
        id,
      },
    });

    if (!existingAgent) {
      return NextResponse.json(
        {
          error: "Agent not found",
        },
        {
          status: 404,
        },
      );
    }

    if (email && email !== existingAgent.email) {
      const emailExists = await prisma.agent.findFirst({
        where: {
          email,
        },
      });

      if (emailExists) {
        return NextResponse.json(
          {
            error: "An agent with this email already exists",
          },
          {
            status: 409,
          },
        );
      }
    }

    const agent = await prisma.agent.update({
      where: {
        id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(image !== undefined && {
          image: image || null,
        }),
      },
    });

    return NextResponse.json(agent);
  } catch (error) {
    console.error("UPDATE AGENT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update agent",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteProps) {
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
    const { id } = await params;

    const agent = await prisma.agent.findUnique({
      where: {
        id,
      },
    });

    if (!agent) {
      return NextResponse.json(
        {
          error: "Agent not found",
        },
        {
          status: 404,
        },
      );
    }

    const assignedProperties = await prisma.property.count({
      where: {
        agentId: id,
      },
    });

    if (assignedProperties > 0) {
      return NextResponse.json(
        {
          error:
            "This agent cannot be deleted because they are assigned to properties. Reassign the properties first.",
        },
        {
          status: 409,
        },
      );
    }

    await prisma.agent.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Agent deleted successfully",
    });
  } catch (error) {
    console.error("DELETE AGENT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete agent",
      },
      {
        status: 500,
      },
    );
  }
}
