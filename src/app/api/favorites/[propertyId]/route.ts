import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

interface RouteProps {
  params: Promise<{
    propertyId: string;
  }>;
}

export async function DELETE(
  request: Request,
  { params }: RouteProps,
) {
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

    const { propertyId } = await params;

    const favorite =
      await prisma.favorite.findUnique({
        where: {
          userId_propertyId: {
            userId: user.id,
            propertyId,
          },
        },
      });

    if (!favorite) {
      return NextResponse.json(
        {
          error: "Favorite not found",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Failed to remove favorite:",
      error,
    );

    return NextResponse.json(
      {
        error: "Failed to remove favorite",
      },
      {
        status: 500,
      },
    );
  }
}