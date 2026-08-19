import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

/*
 * GET PROFILE
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json({
      success: true,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
        image: user.image ?? "",
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch profile:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch profile.",
      },
      {
        status: 500,
      },
    );
  }
}

/*
 * UPDATE PROFILE
 */
export async function PATCH(
  request: Request,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const {
      name,
      phone,
    } = body;

    /*
     * Validate name
     */
    if (!name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Name is required.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Update user
     */
    const updatedUser =
      await prisma.user.update({
        where: {
          id: user.id,
        },

        data: {
          name: name.trim(),
          phone: phone?.trim() || null,
        },
      });

    return NextResponse.json({
      success: true,

      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone ?? "",
        image: updatedUser.image ?? "",
      },
    });
  } catch (error) {
    console.error(
      "Failed to update profile:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update profile.",
      },
      {
        status: 500,
      },
    );
  }
}