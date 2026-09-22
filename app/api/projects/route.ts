import { NextResponse } from "next/server";
import { getPublishedProjects } from "@/lib/db";
import { resolveStorageUrl } from "@/lib/storage";


export async function GET() {
  try {
    const projectList = await getPublishedProjects();
    const formatted = projectList.map((project) => ({
      ...project,
      imageUrl: resolveStorageUrl(project.imageUrl),
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Error fetching projects from DB:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
