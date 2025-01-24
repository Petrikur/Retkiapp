import { getAuth } from "firebase-admin/auth";
import connectToDatabase from "./mongodb";
import User from "@/app/models/User";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function syncUserToDB(firebaseUser: any) {
  await connectToDatabase();
  const { uid, email, displayName, photoURL } = firebaseUser;

  try {
    let user = await User.findOne({ firebaseId: uid });

    if (!user) {
      console.log("User does not exist, creating a new user in MongoDB...");
      user = await User.create({
        firebaseId: uid,
        name: displayName || "Anonymous",
        email,
        image: photoURL,
        role: "user",
      });
    }

    // Sync Firebase custom claims with MongoDB role
    const auth = getAuth();
    const currentClaims = (await auth.getUser(uid)).customClaims;
    const roleInDB = user.role;

    if (!currentClaims || currentClaims.role !== roleInDB) {
      await auth.setCustomUserClaims(uid, { role: roleInDB });
    }

    return user;
  } catch (error) {
    console.error("Error in syncUserToDB:", error);
    throw new Error("Failed to sync user with the database");
  }
}
