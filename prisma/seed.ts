import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed for pghq-standard-ipqa...");

  // 1. Create a default owner user if not exists
  const owner = await prisma.user.upsert({
    where: { email: "admin@ideal-hostel.com" },
    update: {},
    create: {
      name: "Ideal Admin",
      email: "admin@ideal-hostel.com",
      passwordHash: "hashed-password-here",
      phone: "+91 98765 00000",
    },
  });
  console.log("Owner ensured:", owner.id);

  // 2. Create the Property
  let property = await prisma.property.findFirst({
    where: { ownerId: owner.id },
  });
  if (!property) {
    property = await prisma.property.create({
      data: {
        ownerId: owner.id,
        name: "Ideal Hostel",
        address: "123 Main St",
        city: "Kerala", // specific region implied by names
      },
    });
    console.log("Created property:", property.id);
  } else {
    console.log("Found property:", property.id);
  }

  // 3. Create Floors
  const floorsData = [
    { number: 0, name: "Basement Floor" },
    { number: 1, name: "First Floor" },
    { number: 2, name: "Second Floor" },
  ];
  
  const floors = await Promise.all(
    floorsData.map((f) =>
      prisma.floor.upsert({
        where: { propertyId_floorNumber: { propertyId: property!.id, floorNumber: f.number } },
        update: {},
        create: {
          propertyId: property!.id,
          floorNumber: f.number,
          name: f.name,
        },
      })
    )
  );
  
  const floorMap = {
    0: floors.find((f) => f.floorNumber === 0)!,
    1: floors.find((f) => f.floorNumber === 1)!,
    2: floors.find((f) => f.floorNumber === 2)!,
  };
  console.log("Floors ensured.");

  // 4. Create Rooms according to specific layout
  const roomDefinitions = [
    // Basement Floor
    { floorNumber: 0, roomNumber: "R01", type: "DOUBLE", beds: 2 },
    { floorNumber: 0, roomNumber: "R02", type: "DOUBLE", beds: 2 },
    { floorNumber: 0, roomNumber: "R03", type: "TRIPLE", beds: 3 },
    { floorNumber: 0, roomNumber: "R04", type: "SINGLE", beds: 1 },
    { floorNumber: 0, roomNumber: "R05", type: "TRIPLE", beds: 3 },
    
    // First Floor
    { floorNumber: 1, roomNumber: "R06", type: "DOUBLE", beds: 2 },
    { floorNumber: 1, roomNumber: "R07", type: "DOUBLE", beds: 2 },
    { floorNumber: 1, roomNumber: "R08", type: "DOUBLE", beds: 2 },
    { floorNumber: 1, roomNumber: "R09", type: "DOUBLE", beds: 2 },
    { floorNumber: 1, roomNumber: "R10", type: "SINGLE", beds: 1 },
    
    // Second Floor
    { floorNumber: 2, roomNumber: "R11", type: "DOUBLE", beds: 2 },
    { floorNumber: 2, roomNumber: "R12", type: "DOUBLE", beds: 2 },
    { floorNumber: 2, roomNumber: "R13", type: "DOUBLE", beds: 2 },
    { floorNumber: 2, roomNumber: "R14", type: "DOUBLE", beds: 2 },
    { floorNumber: 2, roomNumber: "R15", type: "DOUBLE", beds: 2 },
    { floorNumber: 2, roomNumber: "R16", type: "DOUBLE", beds: 2 },
    { floorNumber: 2, roomNumber: "R17", type: "DOUBLE", beds: 2 },
    { floorNumber: 2, roomNumber: "R18", type: "DOUBLE", beds: 2 },
    { floorNumber: 2, roomNumber: "R19", type: "DOUBLE", beds: 2 },
    { floorNumber: 2, roomNumber: "R20", type: "DOUBLE", beds: 2 },
  ];

  for (const def of roomDefinitions) {
    const floor = floorMap[def.floorNumber as keyof typeof floorMap];
    
    await prisma.room.upsert({
      where: { floorId_roomNumber: { floorId: floor.id, roomNumber: def.roomNumber } },
      update: {},
      create: {
        floorId: floor.id,
        roomNumber: def.roomNumber,
        roomType: def.type as any,
        beds: {
          create: Array.from({ length: def.beds }).map((_, i) => ({
            bedNumber: i + 1,
            status: "AVAILABLE",
          })),
        },
      },
    });
    console.log(`Room ensured: ${def.roomNumber}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
