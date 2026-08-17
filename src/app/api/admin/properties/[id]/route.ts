import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteProps,
) {
  try {
    const { id } = await params;

    const property = await prisma.property.findUnique({
      where: {
        id,
      },
      include: {
        agent: true,
      },
    });

    if (!property) {
      return NextResponse.json(
        {
          error: "Property not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("GET PROPERTY ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch property",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteProps,
) {
  try {
    const { id } = await params;

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

    const existingProperty = await prisma.property.findUnique({
      where: {
        id,
      },
    });

    if (!existingProperty) {
      return NextResponse.json(
        {
          error: "Property not found",
        },
        {
          status: 404,
        },
      );
    }

    if (slug && slug !== existingProperty.slug) {
      const slugExists = await prisma.property.findUnique({
        where: {
          slug,
        },
      });

      if (slugExists) {
        return NextResponse.json(
          {
            error: "A property with this slug already exists",
          },
          {
            status: 409,
          },
        );
      }
    }

    const property = await prisma.property.update({
      where: {
        id,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(location !== undefined && { location }),
        ...(type !== undefined && { type }),
        ...(listingType !== undefined && { listingType }),
        ...(price !== undefined && { price: Number(price) }),
        ...(currency !== undefined && { currency }),
        ...(bedrooms !== undefined && {
          bedrooms: Number(bedrooms),
        }),
        ...(bathrooms !== undefined && {
          bathrooms: Number(bathrooms),
        }),
        ...(area !== undefined && {
          area: Number(area),
        }),
        ...(yearBuilt !== undefined && {
          yearBuilt:
            yearBuilt === "" || yearBuilt === null
              ? null
              : Number(yearBuilt),
        }),
        ...(description !== undefined && {
          description,
        }),
        ...(images !== undefined && {
          images: Array.isArray(images) ? images : [],
        }),
        ...(features !== undefined && {
          features: Array.isArray(features) ? features : [],
        }),
        ...(featured !== undefined && {
          featured: Boolean(featured),
        }),
        ...(agentId !== undefined && {
          agentId: agentId || null,
        }),
      },
      include: {
        agent: true,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("UPDATE PROPERTY ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update property",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteProps,
) {
  try {
    const { id } = await params;

    const property = await prisma.property.findUnique({
      where: {
        id,
      },
    });

    if (!property) {
      return NextResponse.json(
        {
          error: "Property not found",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.property.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PROPERTY ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete property",
      },
      {
        status: 500,
      },
    );
  }
}