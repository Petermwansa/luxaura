import { NextResponse } from "next/server";
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
    const enquiries = await prisma.enquiry.findMany({
      include: {
        property: {
          select: {
            id: true,
            slug: true,
            title: true,
            location: true,
            price: true,
            currency: true,
            images: true,
          },
        },

        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      enquiries,
    });
  } catch (error) {
    console.error("ADMIN ENQUIRIES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load enquiries.",
      },
      {
        status: 500,
      },
    );
  }
}
