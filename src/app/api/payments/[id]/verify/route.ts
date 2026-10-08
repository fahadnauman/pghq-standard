import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentSubmissionStatus } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body; // Expected: "APPROVED" | "REJECTED"

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing status" },
        { status: 400 }
      );
    }

    const submission = await prisma.paymentSubmission.findUnique({
      where: { id },
      include: { room: { include: { beds: { include: { tenant: true } } } } },
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, error: "Payment submission not found" },
        { status: 404 }
      );
    }

    // Start a transaction: Update submission status
    const updatedSubmission = await prisma.$transaction(async (tx) => {
      const updated = await tx.paymentSubmission.update({
        where: { id },
        data: { status: status as PaymentSubmissionStatus },
      });

      // If approved, ideally we want to find the exact tenant to mark as PAID.
      // Since submission tracks tenantName loosely, we can try to find the tenant occupying a bed in that room
      // and update their paymentStatus. 
      if (status === "APPROVED") {
        const tenants = submission.room.beds
          .map((b: any) => b.tenant)
          .filter(Boolean);

        // Find tenant by matching name roughly, or just assume if single tenant.
        // For simplicity, we update any tenant in the room whose name matches, or the first one if only one.
        let targetTenant = tenants.find((t: any) => t?.name.toLowerCase() === submission.tenantName.toLowerCase());
        if (!targetTenant && tenants.length === 1) {
          targetTenant = tenants[0];
        }

        if (targetTenant) {
          await tx.tenant.update({
            where: { id: targetTenant.id },
            data: { paymentStatus: "PAID" },
          });
        }
      }

      return updated;
    });

    return NextResponse.json(
      { success: true, message: `Payment ${status.toLowerCase()} successfully`, submission: updatedSubmission },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
