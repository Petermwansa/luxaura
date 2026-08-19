import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";


export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const enquiries = await prisma.enquiry.findMany({
      where: {
        userId: user.id,
      },

      include: {
        property: {
          include: {
            agent: true,
          },
        },
        agent: true,
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
    console.error(
      "Failed to fetch enquiries:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch enquiries.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    /*
     * Get the currently authenticated user.
     *
     * This allows us to associate the enquiry
     * with their account.
     */
    const user = await getCurrentUser();

    const body = await request.json();

    const {
      name,
      email,
      phone,
      date,
      message,
      propertyId,
    } = body;

    /*
     * Basic validation
     */
    if (
      !name ||
      !email ||
      !phone ||
      !date ||
      !message ||
      !propertyId
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required.",
        },
        { status: 400 },
      );
    }

    /*
     * Find the property using its DATABASE ID.
     */
    const property = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
      include: {
        agent: true,
      },
    });

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          error: "Property not found.",
        },
        { status: 404 },
      );
    }

    /*
     * Validate the preferred date.
     */
    const enquiryDate = new Date(date);

    if (Number.isNaN(enquiryDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid preferred date.",
        },
        { status: 400 },
      );
    }

    /*
     * Create the enquiry.
     */
    const enquiry = await prisma.enquiry.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),

        date: enquiryDate,

        message: message.trim(),

        /*
         * Connect enquiry to property.
         */
        propertyId: property.id,

        /*
         * Connect enquiry to the logged-in user
         * if they are authenticated.
         */
        userId: user?.id ?? undefined,

        /*
         * Connect enquiry to the property's
         * assigned agent, if one exists.
         */
        agentId: property.agentId ?? undefined,

        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully.",

        enquiry: {
          id: enquiry.id,
          status: enquiry.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("ENQUIRY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while submitting your enquiry.",
      },
      { status: 500 },
    );
  }
}

