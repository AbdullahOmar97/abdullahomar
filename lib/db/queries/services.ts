import { eq, asc } from "drizzle-orm";
import { db } from "../index.ts";
import { services, type Service, type NewService } from "../schema.ts";

export async function getActiveServices(): Promise<Service[]> {
  return await db
    .select()
    .from(services)
    .where(eq(services.active, true))
    .orderBy(asc(services.orderIndex));
}

export async function getServiceById(id: string): Promise<Service | undefined> {
  const [service] = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1);
  return service;
}

export async function upsertService(data: NewService): Promise<Service> {
  const [result] = await db
    .insert(services)
    .values(data)
    .onConflictDoUpdate({
      target: services.id,
      set: {
        titleKey: data.titleKey,
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        descriptionEn: data.descriptionEn,
        descriptionAr: data.descriptionAr,
        detailsEn: data.detailsEn,
        detailsAr: data.detailsAr,
        featuresEn: data.featuresEn,
        featuresAr: data.featuresAr,
        price: data.price,
        imageSrc: data.imageSrc,
        active: data.active,
        orderIndex: data.orderIndex,
      },
    })
    .returning();
  return result;
}

export async function deleteService(id: string): Promise<boolean> {
  const result = await db
    .delete(services)
    .where(eq(services.id, id))
    .returning({ id: services.id });
  return result.length > 0;
}
