import { connect } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const submitFormAction = async (formData) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return { success: false, message: "Authentication required" };
    }

    const userEmail = session.user.email;

    const deadline = new Date("2026-08-23T23:59:59+05:30");
    if (new Date() > deadline) {
      return { success: false, message: "The submission deadline has passed" };
    }

    const db = await connect();
    const { Department, RegistrationNumber, Questions, ...formFields } = formData;

    if (!Department) {
      return { success: false, message: "Department is required" };
    }

    const regNoRegex = /^\d{2}[A-Z]{3}\d{4}$/;
    if (RegistrationNumber && !regNoRegex.test(RegistrationNumber)) {
      return {
        success: false,
        message: "Registration number must be 2 numbers, 3 uppercase letters, and 4 numbers (e.g. 25BCE5612)",
      };
    }

    const collection = db.collection("formData");
    const existingSubmissions = await collection.where("Email", "==", userEmail).get();

    const alreadySubmittedDept = existingSubmissions.docs.some(
      (doc) => doc.data()?.Department === Department
    );

    if (alreadySubmittedDept) {
      return {
        success: false,
        message: `You have already submitted an application for ${Department}`,
      };
    }

    if (existingSubmissions.size >= 2) {
      return {
        success: false,
        message: "Remember that you can only submit upto 2 unique applications",
      };
    }

    await collection.add({
      ...formFields,
      RegistrationNumber,
      Department,
      Questions,
      Email: userEmail,
      createdAt: new Date(),
    });

    return {
      success: true,
      message: "Form submitted successfully!",
    };
  } catch (error) {
    console.error("Form submission action error:", error);
    return { success: false, message: error.message || "Error submitting form" };
  }
};