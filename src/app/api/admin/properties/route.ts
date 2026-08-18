import { NextRequest, NextResponse } from "next/server";
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
    const properties = await prisma.property.findMany({
      include: {
        agent: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("GET ADMIN PROPERTIES ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch properties",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
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
    const body = await request.json();

    const {
      title,
      slug,
      location,
      type,
      listingType,
      price,
      currency,
      bedrooms,
      bathrooms,
      area,
      yearBuilt,
      description,
      images,
      features,
      featured,
      agentId,
    } = body;

    if (
      !title ||
      !slug ||
      !location ||
      !type ||
      !listingType ||
      price === undefined ||
      bedrooms === undefined ||
      bathrooms === undefined ||
      area === undefined ||
      !description
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        {
          status: 400,
        },
      );
    }

    const existingProperty = await prisma.property.findUnique({
      where: {
        slug,
      },
    });

    if (existingProperty) {
      return NextResponse.json(
        {
          error: "A property with this slug already exists",
        },
        {
          status: 409,
        },
      );
    }

    const property = await prisma.property.create({
      data: {
        title,
        slug,
        location,
        type,
        listingType,
        price: Number(price),
        currency: currency || "ZMW",
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area: Number(area),
        yearBuilt:
          yearBuilt !== undefined &&
          yearBuilt !== null &&
          yearBuilt !== ""
            ? Number(yearBuilt)
            : null,
        description,
        images: Array.isArray(images) ? images : [],
        features: Array.isArray(features) ? features : [],
        featured: Boolean(featured),
        agentId: agentId || null,
      },
      include: {
        agent: true,
      },
    });

    return NextResponse.json(property, {
      status: 201,
    });
  } catch (error) {
    console.error("CREATE PROPERTY ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create property",
      },
      {
        status: 500,
      },
    );
  }
}
