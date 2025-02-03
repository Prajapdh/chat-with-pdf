import { db } from "./db";
import { userSubscriptions, userUploads } from "./db/schema";
import { eq } from "drizzle-orm";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const MONTH_IN_MS = DAY_IN_MS * 30;
const MAX_FREE_UPLOADS = 5;

export const checkSubscription = async (userId: string) => {
  if (!userId) {
    return false;
  }

  const _userSubscriptions = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId));

  if (!_userSubscriptions[0]) {
    return false;
  }

  const userSubscription = _userSubscriptions[0];

  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd && userSubscription.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS >
      Date.now();
  
  if (!isValid) {
    // Reset upload count if subscription has ended
    await db
      .update(userUploads)
      .set({ uploadCount: 0, lastResetDate: new Date() })
      .where(eq(userUploads.userId, userId));
  }

  return !!isValid;
};

export const checkUploadLimit = async (userId: string) => {
  const _userUploads = await db
    .select()
    .from(userUploads)
    .where(eq(userUploads.userId, userId));

  let userUpload = _userUploads[0];

  if (!userUpload) {
    // Create a new record if it doesn't exist
    [userUpload] = await db
      .insert(userUploads)
      .values({ userId, uploadCount: 0, lastResetDate: new Date() })
      .returning();
  }

  const isPro = await checkSubscription(userId);

  if (!isPro) {
    const monthsSinceLastReset = (Date.now() - userUpload.lastResetDate.getTime()) / MONTH_IN_MS;

    if (monthsSinceLastReset >= 1) {
      // Reset count if a month has passed
      await db
        .update(userUploads)
        .set({ uploadCount: 0, lastResetDate: new Date() })
        .where(eq(userUploads.userId, userId));
      userUpload.uploadCount = 0;
    }

    const canUpload = userUpload.uploadCount < MAX_FREE_UPLOADS;

    return {
      canUpload,
      uploadsCount: userUpload.uploadCount,
      maxUploads: MAX_FREE_UPLOADS
    };
  }

  return {
    canUpload: true,
    uploadsCount: userUpload.uploadCount,
    maxUploads: Infinity
  };
};

export const incrementUploadCount = async (userId: string) => {
  const _userUploads = await db
    .select()
    .from(userUploads)
    .where(eq(userUploads.userId, userId));

  let userUpload = _userUploads[0];

  if (!userUpload) {
    [userUpload] = await db
      .insert(userUploads)
      .values({ userId, uploadCount: 1, lastResetDate: new Date() })
      .returning();
    console.log("Created new userUpload record");
  } else {
    userUpload = await db
      .update(userUploads)
      .set({ uploadCount: userUpload.uploadCount + 1 })
      .where(eq(userUploads.userId, userId))
      .returning()
      .then(res => res[0]);
    console.log("Updated userUpload record");
  }

  return {
    uploadsCount: userUpload.uploadCount,
    maxUploads: MAX_FREE_UPLOADS
  };
};
