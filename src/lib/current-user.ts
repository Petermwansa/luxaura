import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email =
    clerkUser.primaryEmailAddress?.emailAddress;

  if (!email) {
    return null;
  }

  const name =
    clerkUser.fullName ||
    clerkUser.firstName ||
    "Luxora User";

  const user = await prisma.user.upsert({
    where: {
      clerkId: userId,
    },

    update: {
      name,
      email,
      image: clerkUser.imageUrl,
    },

    create: {
      clerkId: userId,
      name,
      email,
      image: clerkUser.imageUrl,
    },
  });

  return user;
}