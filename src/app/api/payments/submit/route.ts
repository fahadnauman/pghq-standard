import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomId, tenantName, amount, transactionId, screenshotUrl } = body;

    if (!roomId || !tenantName || !amount || !transactionId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert amount to float
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      return NextResponse.json(
        { success: false, error: "Amount must be a valid number" },
        { status: 400 }
      );
    }

    // `roomId` from frontend is actually the roomNumber (e.g., 'R01')
    const roomNumberStr = String(roomId).trim().toUpperCase();
    let dbRoom = await prisma.room.findFirst({
      where: { roomNumber: { equals: roomNumberStr, mode: "insensitive" } }
    });

    if (!dbRoom) {
      // Auto-create fallback room
      let floor = await prisma.floor.findFirst();
      if (!floor) {
        let property = await prisma.property.findFirst();
        if (!property) {
          let user = await prisma.user.findFirst();
          if (!user) {
            user = await prisma.user.create({
              data: {
                name: "Default Admin",
                email: "admin@idealhostel.com",
                passwordHash: "dummyhash",
              }
            });
          }
          property = await prisma.property.create({
            data: {
              ownerId: user.id,
              name: "Ideal Hostel",
              address: "123 Main St",
              city: "Bangalore",
            }
          });
        }
        floor = await prisma.floor.create({ data: { propertyId: property.id, floorNumber: 1, name: "Ground Floor" } });
      }
      dbRoom = await prisma.room.create({ data: { floorId: floor.id, roomNumber: roomNumberStr } });
    }

    const submission = await prisma.paymentSubmission.create({
      data: {
        roomId: dbRoom.id,
        tenantName,
        amount: numericAmount,
        transactionId,
        screenshotUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { success: true, message: "Payment submitted successfully", submission },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Payment Submission Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit payment" },
      { status: 500 }
    );
  }
}
