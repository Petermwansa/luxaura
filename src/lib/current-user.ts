import {
  auth,
  currentUser,
} from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  try {
    /*
     * Get the currently authenticated Clerk user.
     */
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    /*
     * Get the full Clerk user.
     */
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    /*
     * Get the user's primary email.
     */
    const email =
      clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      console.error(
        "Clerk user does not have an email address.",
      );

      return null;
    }

    /*
     * Use Clerk's name information.
     */
    const name =
      clerkUser.fullName ||
      clerkUser.firstName ||
      "Luxora User";

    const image = clerkUser.imageUrl || null;

    /*
     * ------------------------------------------------
     * 1. Find user using Clerk ID
     * ------------------------------------------------
     */
    let user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (user) {
      /*
       * User exists.
       *
       * Synchronize Clerk-managed fields.
       *
       * IMPORTANT:
       * We do NOT update phone here.
       * The phone number is managed by our profile page.
       */
      if (
        user.email !== email ||
        user.name !== name ||
        user.image !== image
      ) {
        user = await prisma.user.update({
          where: {
            id: user.id,
          },

          data: {
            email,
            name,
            image,
          },
        });
      }

      return user;
    }

    /*
     * ------------------------------------------------
     * 2. No user with this Clerk ID
     *
     * Check whether the email already exists.
     * ------------------------------------------------
     */
    user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      /*
       * A database user already exists with this
       * email.
       *
       * Instead of creating another user and causing
       * the User_email_key unique constraint error,
       * attach the current Clerk ID to the existing
       * database user.
       */
      user = await prisma.user.update({
        where: {
          id: user.id,
        },

        data: {
          clerkId: userId,
          name,
          image,
        },
      });

      return user;
    }

    /*
     * ------------------------------------------------
     * 3. User doesn't exist at all.
     *
     * Create a new database user.
     * ------------------------------------------------
     */
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        name,
        email,
        image,
      },
    });

    return user;
  } catch (error) {
    console.error(
      "Failed to get current user:",
      error,
    );

    return null;
  }
}