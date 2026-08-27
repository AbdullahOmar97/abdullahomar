import { NextResponse } from "next/server";
import { getAllExperiences, getAllEducation, getAllSkills } from "@/lib/db";

export async function GET() {
  try {
    const [experiences, educationList, skillsList] = await Promise.all([
      getAllExperiences(),
      getAllEducation(),
      getAllSkills(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        experiences,
        education: educationList,
        skills: skillsList,
      },
    });
  } catch (error) {
    console.error("Error fetching profile data from DB:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}
