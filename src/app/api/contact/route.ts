import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      message,
    } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Name, email and message are required.",
        },
        { status: 400 },
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a valid email address.",
        },
        { status: 400 },
      );
    }

    console.log("CONTACT MESSAGE:", {
      name,
      email,
      phone,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message received successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "CONTACT API ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while sending your message.",
      },
      { status: 500 },
    );
  }
}