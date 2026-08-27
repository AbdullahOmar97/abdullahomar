import { NextResponse } from "next/server";
import { getActiveServices } from "@/lib/db";

export async function GET() {
  try {
    const servicesList = await getActiveServices();
    return NextResponse.json({ success: true, data: servicesList });
  } catch (error) {
    console.error("Error fetching services from DB:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
