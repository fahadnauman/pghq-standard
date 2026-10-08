import "dotenv/config";
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
  console.log("Starting seed for Naalukettu Hostel...");

  // 1. Create a default owner user if not exists
  const owner = await prisma.user.upsert({
    where: { email: "admin@naalukettu.com" },
    update: {},
    create: {
      name: "Naalukettu Admin",
      email: "admin@naalukettu.com",
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
        name: "Naalukettu Hostel",
        address: "123 Main St",
        city: "Kerala",
      },
    });
    console.log("Created property:", property.id);
  } else {
    console.log("Found property:", property.id);
  }

  // 3. Clear existing rooms
  console.log("Clearing existing rooms...");
  await prisma.room.deleteMany({
    where: { floor: { propertyId: property.id } },
  });

  // 4. Create Floors
  const floorsData = [
    { number: 0, name: "Ground Floor" },
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

  // 5. Create Rooms according to specific layout
  const roomDefinitions = [
    // Ground Floor
    { floorNumber: 0, roomNumber: "g01", type: "TRIPLE", beds: 3, hasAC: true, baseRent: 7050 },
    { floorNumber: 0, roomNumber: "g02", type: "TRIPLE", beds: 3, hasAC: true, baseRent: 7050 },
    { floorNumber: 0, roomNumber: "g03", type: "DOUBLE", beds: 2, hasAC: false, baseRent: 5500 },
    
    // First Floor
    { floorNumber: 1, roomNumber: "101", type: "TRIPLE", beds: 3, hasAC: false, baseRent: 4800 },
    { floorNumber: 1, roomNumber: "102", type: "TRIPLE", beds: 3, hasAC: false, baseRent: 4800 },
    { floorNumber: 1, roomNumber: "103", type: "TRIPLE", beds: 3, hasAC: false, baseRent: 4800 },
    { floorNumber: 1, roomNumber: "104", type: "TRIPLE", beds: 3, hasAC: false, baseRent: 4800 },
    { floorNumber: 1, roomNumber: "105", type: "TRIPLE", beds: 3, hasAC: false, baseRent: 4800 },
    
    // Second Floor
    { floorNumber: 2, roomNumber: "201", type: "TRIPLE", beds: 3, hasAC: false, baseRent: 4800 },
    { floorNumber: 2, roomNumber: "202", type: "TRIPLE", beds: 3, hasAC: false, baseRent: 4800 },
    { floorNumber: 2, roomNumber: "203", type: "TRIPLE", beds: 3, hasAC: false, baseRent: 4800 },
    { floorNumber: 2, roomNumber: "204", type: "TRIPLE", beds: 3, hasAC: false, baseRent: 4800 },
    { floorNumber: 2, roomNumber: "205", type: "TRIPLE", beds: 3, hasAC: false, baseRent: 4800 },
    { floorNumber: 2, roomNumber: "206", type: "TRIPLE", beds: 3, hasAC: false, baseRent: 4800 },
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
        hasAC: def.hasAC,
        baseRent: def.baseRent,
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
