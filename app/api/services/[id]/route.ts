import { NextResponse } from "next/server";
import { getServiceById } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await getServiceById(id);

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error("Error fetching service detail from DB:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch service detail" },
      { status: 500 }
    );
  }
}
