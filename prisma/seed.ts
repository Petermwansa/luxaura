import { PrismaClient, PropertyType, ListingType } from "@prisma/client";
import { properties } from "../src/data/properties";

const prisma = new PrismaClient();

function mapPropertyType(type: string): PropertyType {
  switch (type) {
    case "Apartment":
      return PropertyType.APARTMENT;

    case "Villa":
      return PropertyType.VILLA;

    case "House":
      return PropertyType.HOUSE;

    case "Commercial":
      return PropertyType.COMMERCIAL;

    case "Land":
      return PropertyType.LAND;

    default:
      throw new Error(`Unknown property type: ${type}`);
  }
}

function mapListingType(listingType: string): ListingType {
  switch (listingType) {
    case "For Sale":
      return ListingType.SALE;

    case "For Rent":
      return ListingType.RENT;

    default:
      throw new Error(
        `Unknown listing type: ${listingType}`
      );
  }
}

async function main() {
  console.log("🌱 Starting Luxora database seed...\n");

  // --------------------------------------------------
  // 1. Clear existing data
  // --------------------------------------------------

  console.log("🧹 Clearing existing data...");

  await prisma.favorite.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.property.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Existing data cleared.\n");

  // --------------------------------------------------
  // 2. Create unique agents
  // --------------------------------------------------

  console.log("👤 Creating agents...");

  const uniqueAgents = new Map<
    string,
    (typeof properties)[number]["agent"]
  >();

  for (const property of properties) {
    if (property.agent) {
      uniqueAgents.set(
        property.agent.email,
        property.agent
      );
    }
  }

  const agents = new Map<string, string>();

  for (const agent of uniqueAgents.values()) {
    const createdAgent = await prisma.agent.create({
      data: {
        name: agent.name,
        role: agent.role,
        phone: agent.phone,
        email: agent.email,
        image: agent.image,
      },
    });

    agents.set(agent.email, createdAgent.id);

    console.log(`   ✓ ${agent.name}`);
  }

  console.log(
    `\n✅ ${agents.size} agents created.\n`
  );

  // --------------------------------------------------
  // 3. Create properties
  // --------------------------------------------------

  console.log("🏠 Creating properties...\n");

  for (const property of properties) {
    const agentId = property.agent
      ? agents.get(property.agent.email)
      : undefined;

    if (property.agent && !agentId) {
      throw new Error(
        `Could not find agent for property: ${property.title}`
      );
    }

    const createdProperty =
      await prisma.property.create({
        data: {
          // Frontend property ID becomes the URL slug
          slug: property.id,

          title: property.title,

          location: property.location,

          type: mapPropertyType(property.type),

          listingType: mapListingType(
            property.listingType
          ),

          price: property.price,

          currency: property.currency,

          bedrooms: property.bedrooms,

          bathrooms: property.bathrooms,

          area: property.area,

          yearBuilt: property.yearBuilt,

          description: property.description,

          images: property.images,

          features: property.features,

          featured: property.featured ?? false,

          agentId: agentId ?? null,
        },
      });

    console.log(
      `   ✓ ${createdProperty.title}`
    );
  }

  console.log(
    `\n✅ ${properties.length} properties created.`
  );

  console.log("\n🎉 Luxora database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("\n❌ Database seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });