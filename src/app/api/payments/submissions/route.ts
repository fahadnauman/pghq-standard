import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = status ? { status: status as any } : {};
    
    const submissions = await prisma.paymentSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { room: true }
    });

    return NextResponse.json(
      { success: true, submissions },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Fetch Payment Submissions Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
