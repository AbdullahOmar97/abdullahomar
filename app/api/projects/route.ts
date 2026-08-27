import { NextResponse } from "next/server";
import { getPublishedProjects } from "@/lib/db";

export async function GET() {
  try {
    const projectList = await getPublishedProjects();
    return NextResponse.json({ success: true, data: projectList });
  } catch (error) {
    console.error("Error fetching projects from DB:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
