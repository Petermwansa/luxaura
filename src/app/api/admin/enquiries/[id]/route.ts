import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const validStatuses = [
  "PENDING",
  "CONTACTED",
  "VIEWING_SCHEDULED",
  "COMPLETED",
  "CANCELLED",
] as const;

type EnquiryStatus = (typeof validStatuses)[number];

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const status = body.status as EnquiryStatus;

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid enquiry status.",
        },
        {
          status: 400,
        },
      );
    }

    const enquiry =
      await prisma.enquiry.update({
        where: {
          id,
        },

        data: {
          status,
        },

        include: {
          property: {
            select: {
              title: true,
              slug: true,
            },
          },

          agent: {
            select: {
              name: true,
            },
          },
        },
      });

    return NextResponse.json({
      success: true,
      enquiry,
    });
  } catch (error) {
    console.error(
      "UPDATE ENQUIRY ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update enquiry.",
      },
      {
        status: 500,
      },
    );
  }
}