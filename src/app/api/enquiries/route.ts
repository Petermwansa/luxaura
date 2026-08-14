import { NextResponse } from "next/server";

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
      propertyTitle,
    } = body;

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
          error: "Missing required fields.",
        },
        { status: 400 }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        {
          error: "Invalid email address.",
        },
        { status: 400 }
      );
    }

    console.log("NEW PROPERTY ENQUIRY", {
      name,
      email,
      phone,
      date,
      message,
      propertyId,
      propertyTitle,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry received successfully.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        error: "Unable to process enquiry.",
      },
      { status: 500 }
    );
  }
}