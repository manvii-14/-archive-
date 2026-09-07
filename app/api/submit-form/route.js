import { connect } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return new Response(
        JSON.stringify({ message: "Authentication required" }),
        { status: 401 }
      );
    }

    const user = session.user;
    const userEmail = user.email;

    const deadline = new Date("2026-08-23T23:59:59+05:30");
    if (new Date() > deadline)
      return new Response(
        JSON.stringify({
          message: "The submission deadline has passed",
        }),
        { status: 403 }
      );

    const db = await connect();
    const data = await req.json();

    const { Department, Questions, ...formFields } = data;

    if (!Department) {
      return new Response(
        JSON.stringify({ message: "Department is required" }),
        { status: 400 }
      );
    }

    const regNoRegex = /^\d{2}[A-Z]{3}\d{4}$/;
    if (formFields.RegistrationNumber && !regNoRegex.test(formFields.RegistrationNumber)) {
      return new Response(
        JSON.stringify({
          message: "Registration number must be 2 numbers, 3 uppercase letters, and 4 numbers (e.g. 25BCE5612)",
        }),
        { status: 400 }
      );
    }

    const collection = db.collection("formData");

    // Wrapped in a transaction so the "read existing count" + "write new doc"
    // steps are atomic. Previously these were two separate operations, so two
    // concurrent submissions (the client fires both department applications
    // in parallel) could both pass the "< 2 applications" check before either
    // write landed, letting a user slip past the intended cap.
    const result = await db.runTransaction(async (tx) => {
      const existingSnap = await tx.get(
        collection.where("Email", "==", userEmail)
      );

      const alreadySubmittedDept = existingSnap.docs.some(
        (doc) => doc.data()?.Department === Department
      );

      if (alreadySubmittedDept) {
        return {
          ok: false,
          status: 400,
          message: `You have already submitted an application for ${Department}`,
        };
      }

      if (existingSnap.size >= 2) {
        return {
          ok: false,
          status: 400,
          message: "Remember that you can only submit upto 2 unique applications",
        };
      }

      const newDocRef = collection.doc();
      tx.set(newDocRef, {
        ...formFields,
        Department,
        Questions,
        Email: userEmail,
        createdAt: new Date(),
      });

      return { ok: true };
    });

    if (!result.ok) {
      return new Response(
        JSON.stringify({ message: result.message }),
        { status: result.status }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Form submitted successfully!",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Form submission error:", error);
    return new Response(JSON.stringify({ message: "Error submitting form" }), {
      status: 500,
    });
  }
}