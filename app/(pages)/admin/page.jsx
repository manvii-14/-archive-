import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import NavBar from "@/components/NavBar";
import { auth } from "@/lib/auth";
import { connect, serializeFirestoreData } from "@/lib/db";
import AdminContent from "@/components/AdminContent";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "admin") {
    return (
      <main>
        <NavBar />
        <div className="p-10 text-center text-white">
          Access Denied! You are not authorized to view this webpage.
        </div>
      </main>
    );
  }

  const db = await connect();
  const snapshot = await db.collection("formData").get();
  const applicants = snapshot.docs.map((doc) => ({
    id: doc.id,
    _id: doc.id,
    ...serializeFirestoreData(doc.data()),
  }));

  return (
    <main>
      <NavBar />
      <AdminContent applicants={applicants} />
    </main>
  );
}