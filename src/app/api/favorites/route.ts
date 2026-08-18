import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: user.id,
      },

      include: {
        property: {
          include: {
            agent: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Failed to fetch favorites:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch favorites",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const { propertyId } = body;

    if (!propertyId) {
      return NextResponse.json(
        {
          error: "Property ID is required",
        },
        {
          status: 400,
        },
      );
    }

    const property = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
    });

    if (!property) {
      return NextResponse.json(
        {
          error: "Property not found",
        },
        {
          status: 404,
        },
      );
    }

    const favorite =
      await prisma.favorite.upsert({
        where: {
          userId_propertyId: {
            userId: user.id,
            propertyId,
          },
        },

        update: {},

        create: {
          userId: user.id,
          propertyId,
        },
      });

    return NextResponse.json(
      favorite,
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Failed to save favorite:", error);

    return NextResponse.json(
      {
        error: "Failed to save favorite",
      },
      {
        status: 500,
      },
    );
  }
}