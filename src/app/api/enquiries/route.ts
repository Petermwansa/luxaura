import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      date,
      message,
      propertyId,
    } = body;

    // Basic validation
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

    // Find the property using its slug
    const property = await prisma.property.findUnique({
      where: {
        slug: propertyId,
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

    // Create enquiry
    const enquiry = await prisma.enquiry.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        date: new Date(date),
        message: message.trim(),

        propertyId: property.id,

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
        error: "Something went wrong while submitting your enquiry.",
      },
      { status: 500 },
    );
  }
}