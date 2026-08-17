import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalProperties,
      featuredProperties,
      totalEnquiries,
      pendingEnquiries,
      totalAgents,
    ] = await Promise.all([
      prisma.property.count(),

      prisma.property.count({
        where: {
          featured: true,
        },
      }),

      prisma.enquiry.count(),

      prisma.enquiry.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.agent.count(),
    ]);

    return NextResponse.json({
      success: true,

      stats: {
        totalProperties,
        featuredProperties,
        totalEnquiries,
        pendingEnquiries,
        totalAgents,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN DASHBOARD ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load dashboard statistics.",
      },
      {
        status: 500,
      },
    );
  }
}