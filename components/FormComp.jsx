import React, { useEffect, useMemo, useState } from "react";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { QuestionnaireData } from "@/constants";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useSubmissions } from "@/components/SubmissionsProvider";
import { Info, Sparkles } from "lucide-react";

const normaliseQuestion = (question) => (
  typeof question === "string"
    ? { name: question, type: "generic", placeholder: "2-3 sentences" }
    : question
);

const FormComp = ({ dept1, dept2, isLoading, setIsLoading }) => {
  const { data: session, isPending, error } = authClient.useSession();
  
  const user = session?.user;
  const isSignedIn = !!user;
  const isLoaded = !isPending;

  const [isFormOpen, setIsFormOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formScrollOffset, setFormScrollOffset] = useState(0);

  const router = useRouter();
  const { submittedDepartments: contextSubmitted, markDepartmentsSubmitted } = useSubmissions();
  const [submittedDepartments, setSubmittedDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDraftReady, setIsDraftReady] = useState(false);

  const departmentNames = useMemo(
    () => [dept1, dept2].filter(Boolean).map((department) => typeof department === "string" ? department : department.name),
    [dept1, dept2]
  );
  
  const draftKey = user?.email && departmentNames.length
    ? `recruitment-draft:${user.email}:${[...departmentNames].sort().join("|")}`
    : null;

  const pendingSubmissionKey = departmentNames.length
    ? `recruitment-pending-submission:${[...departmentNames].sort().join("|")}`
    : null;

  useEffect(() => {
    const handleScroll = () => {
      setFormScrollOffset(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      checkApplicationCount(user.email);
    }
  }, [user]);

  async function checkApplicationCount(userEmail) {
    const checkResponse = await fetch(
      `/api/check-applications?email=${userEmail}`
    );
    const { count } = await checkResponse.json();

    if (count >= 2) {
      setErrorMessage(
        "Remember that you can only submit up to 2 unique applications."
      );
      setIsSubmitting(false);
      return;
    }
  }

  const normalizeDeptName = (str) => (str ? str.trim().toLowerCase().replace(/\s*\/\s*/g, "/") : "");

  const questionData = useMemo(
    () => [...new Set(departmentNames.flatMap((department) =>
      (QuestionnaireData.find((item) => normalizeDeptName(item.department) === normalizeDeptName(department))?.questions ?? [])
        .map(normaliseQuestion)
        .map((question) => question.name)
    ))],
    [departmentNames]
  );

  const schemaObj = {
    Name: z.string().min(1, "Name is required"),
    RegistrationNumber: z
      .string()
      .min(1, "Registration number is required")
      .regex(
        /^\d{2}[A-Z]{3}\d{4}$/,
        "Must be 2 numbers, 3 uppercase letters, and 4 numbers (e.g. 25BCE5612)"
      ),
    Email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    Phone: z
      .string()
      .min(1, "Phone is required")
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    Gender: z.string().min(1, "Gender is required"),
    "Year of Study": z.string().optional(),
  };

  questionData.forEach((qd) => {
    schemaObj[qd] = z.string().optional();
  });

  const formSchema = z.object(schemaObj);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      RegistrationNumber: "",
      Email: "",
      Phone: "",
      Gender: "",
    },
  });

  useEffect(() => {
    if (!isLoaded || !user || !draftKey) return;

    const email = user.email;
    let isActive = true;
    setIsDraftReady(false);

    try {
      const savedDraft = JSON.parse(localStorage.getItem(draftKey) || "{}");
      form.reset({ ...form.getValues(), ...savedDraft.values, Email: email });
    } catch {
      form.setValue("Email", email);
    }

    async function initialiseForm() {
      const savedDraft = JSON.parse(localStorage.getItem(draftKey) || "{}");
      let remoteSubmitted = contextSubmitted || [];

      if (!remoteSubmitted.length) {
        const cacheKey = `submitted_depts_${email}`;
        const cached = typeof window !== "undefined" ? sessionStorage.getItem(cacheKey) : null;

        if (cached) {
          try {
            remoteSubmitted = JSON.parse(cached);
          } catch {}
        } else {
          try {
            const response = await fetch(`/api/check-applications?email=${encodeURIComponent(email)}`);
            const result = await response.json();
            if (result?.submittedDepartments) {
              remoteSubmitted = result.submittedDepartments;
              if (typeof window !== "undefined") {
                sessionStorage.setItem(cacheKey, JSON.stringify(remoteSubmitted));
              }
            }
          } catch (err) {
            console.error("Failed to check applications:", err);
          }
        }
      }

      if (!isActive) return;
      const completed = [...new Set([...(savedDraft.submittedDepartments || []), ...remoteSubmitted])];
      setSubmittedDepartments(completed);
      if (departmentNames.length > 0 && departmentNames.every((dept) => completed.includes(dept))) {
        setErrorMessage(`You have already submitted an application for ${departmentNames.join(" and ")}.`);
      }
      localStorage.setItem(draftKey, JSON.stringify({ values: form.getValues(), submittedDepartments: completed }));
      setLoading(false);
      setIsDraftReady(true);
    }

    initialiseForm().catch(() => {
      if (isActive) {
        setLoading(false);
        setIsDraftReady(true);
      }
    });

    return () => { isActive = false; };
  }, [contextSubmitted, departmentNames, draftKey, form, isLoaded, user]);

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    if (!isDraftReady || !draftKey) return;
    localStorage.setItem(draftKey, JSON.stringify({ values: watchedValues, submittedDepartments }));
  }, [draftKey, isDraftReady, submittedDepartments, watchedValues]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !pendingSubmissionKey || typeof window === "undefined") return;

    const raw = localStorage.getItem(pendingSubmissionKey);
    if (!raw) return;

    localStorage.removeItem(pendingSubmissionKey);

    let pending;
    try {
      pending = JSON.parse(raw);
    } catch {
      return;
    }
    if (!pending?.values) return;

    const restoredValues = { ...pending.values, Email: user.email };
    form.reset(restoredValues);
    toast.success("Signed in! Submitting your application...");
    submitApplication(restoredValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, pendingSubmissionKey]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-4 flex flex-col items-center">
          <span className="block h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading secure form...</p>
        </div>
      </div>
    );
  }

  const submitApplication = async (values) => {
    setIsSubmitting(true);
    setErrorMessage("");

    const pendingDepartments = departmentNames.filter((department) => !submittedDepartments.includes(department));

    if (!pendingDepartments.length) {
      toast.success("Your applications have already been submitted.");
      setIsSubmitting(false);
      router.push("/departments");
      return;
    }

    const basicDetails = {
      Name: values.Name,
      RegistrationNumber: values.RegistrationNumber,
      Email: values.Email,
      Phone: values.Phone,
      "Year of Study": values["Year of Study"],
    };

    const submitDepartment = async (department) => {
      const questions = (QuestionnaireData.find((item) => item.department === department)?.questions ?? [])
        .map(normaliseQuestion);

      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...basicDetails,
          Department: department,
          Questions: questions.reduce((answers, question) => ({ ...answers, [question.name]: values[question.name] || "" }), {}),
        }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Could not submit ${department}.`);
      }
      return { department, success: true };
    };

    try {
      const results = await Promise.allSettled(pendingDepartments.map(submitDepartment));
      const successful = results
        .filter((result) => result.status === "fulfilled" && result.value.success)
        .map((result) => result.value.department);
      const failed = results.flatMap((result, index) =>
        result.status === "rejected" ? [pendingDepartments[index]] : []
      );
      const completed = [...new Set([...submittedDepartments, ...successful])];

      setSubmittedDepartments(completed);
      markDepartmentsSubmitted(completed);
      if (draftKey) localStorage.setItem(draftKey, JSON.stringify({ values, submittedDepartments: completed }));
      if (typeof window !== "undefined" && values?.Email) {
        sessionStorage.setItem(`submitted_depts_${values.Email}`, JSON.stringify(completed));
      }
      successful.forEach((department) => toast.success(`Application submitted for ${department}.`));

      if (failed.length) {
        setErrorMessage(`Submitted ${successful.length ? successful.join(", ") : "no applications"}. Please retry ${failed.join(", ")}.`);
      } else {
        router.push("/departments");
      }
    } catch {
      setErrorMessage("Your applications could not be submitted. Your saved answers will be kept for retrying.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFormSubmit = async (values) => {
    if (!isSignedIn) {
      setIsSubmitting(true);
      try {
        if (pendingSubmissionKey && typeof window !== "undefined") {
          localStorage.setItem(pendingSubmissionKey, JSON.stringify({ values, savedAt: Date.now() }));
        }
        
        // NEW FIX: Catch the response to check for silent errors from Better Auth
        const res = await authClient.signIn.social({
          provider: "google",
          callbackURL: typeof window !== "undefined" ? window.location.pathname : "/",
        });

        // If Better Auth returns an error object, stop loading and show it
        if (res?.error) {
          console.error("Better Auth Error:", res.error);
          toast.error(res.error.message || "Failed to connect to Google.");
          setIsSubmitting(false);
        }
        
      } catch (err) {
        console.error("Sign in error:", err);
        toast.error("Could not start sign in. Please try again.");
        setIsSubmitting(false);
      }
      return;
    }

    await submitApplication(values);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-muted-foreground">Checking your application status...</p>
      </div>
    );
  }

  if (!isFormOpen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Recruitment Closed</h2>
        <p className="text-muted-foreground">The recruitment period has ended.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground flex items-center justify-center gap-3">
          Application Form <Sparkles className="w-8 h-8 text-primary" />
        </h1>
        <p className="text-lg text-muted-foreground">
          Applying to: <span className="text-primary font-semibold">{departmentNames.join(", ")}</span>
        </p>
      </div>

      {errorMessage && !isSubmitting && (
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex items-center justify-between">
          <p className="text-destructive font-medium">{errorMessage}</p>
          <Button variant="outline" onClick={() => router.push("/departments")}>
            Go Back
          </Button>
        </div>
      )}

      {/* Main Glass Form Card */}
      <div className="glass-card relative shadow-2xl rounded-3xl p-6 sm:p-10 overflow-hidden">
        
        {/* Subtle background glow effect */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        {!isSignedIn && (
          <div className="mb-8 flex items-start gap-3 bg-primary/10 border border-primary/20 p-4 rounded-2xl">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/75 leading-relaxed">
              Fill out the form below first — we&apos;ll ask you to sign in with Google only when you hit submit, and your answers will carry over automatically.
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-10 relative z-10">
            
            {/* About You Section */}
            <section className="space-y-6">
              <div className="border-b border-border pb-3">
                <h2 className="text-xl font-semibold text-foreground/90">Personal Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Full Name</FormLabel>
                      <FormControl>
                        <Input className="bg-background/40 border-border focus-visible:ring-primary/50 text-foreground" {...field} placeholder="Jane Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="RegistrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Registration Number</FormLabel>
                      <FormControl>
                        <Input className="bg-background/40 border-border focus-visible:ring-primary/50 text-foreground uppercase" {...field} placeholder="e.g. 25BCE5612" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background/40 border-border focus-visible:ring-primary/50 text-foreground"
                          {...field}
                          readOnly={isSignedIn}
                          placeholder={isSignedIn ? undefined : "name@example.com"}
                          type="email"
                        />
                      </FormControl>
                      {!isSignedIn && (
                        <p className="text-[11px] text-muted-foreground pt-1">
                          You&apos;ll sign in with Google to confirm this address upon submission.
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Phone (WhatsApp)</FormLabel>
                      <FormControl>
                        <Input className="bg-background/40 border-border focus-visible:ring-primary/50 text-foreground" {...field} placeholder="+919876543210" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Gender</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-border bg-background/40 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                          {...field} 
                          value={field.value || ""}
                        >
                          <option value="" disabled className="text-black bg-white">Select Gender</option>
                          <option value="Male" className="text-black bg-white">Male</option>
                          <option value="Female" className="text-black bg-white">Female</option>
                          <option value="Other" className="text-black bg-white">Other</option>
                          <option value="Prefer not to say" className="text-black bg-white">Prefer not to say</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <FormField
                  control={form.control}
                  name="Why do you want to join Organization Name?"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80 text-base">Why do you want to join our organization?</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="bg-background/40 border-border focus-visible:ring-primary/50 text-foreground min-h-[120px] resize-y" 
                          {...field} 
                          placeholder="Tell us about your motivation in 2-3 sentences..." 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Elegant Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Department Specific Questions */}
            {renderDepartmentQuestions(departmentNames[0], QuestionnaireData, form)}
            {departmentNames[1] && renderDepartmentQuestions(departmentNames[1], QuestionnaireData, form)}

            {/* Submit Button */}
            <div className="pt-8 pb-4 flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-base font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

const renderDepartmentQuestions = (department, QuestionnaireData, form) => {
  const questions = (
    QuestionnaireData.find(qd => qd.department === department)?.questions ?? []
  )
    .map(normaliseQuestion)
    .filter((question) => question.name !== "Why do you want to join Organization Name?" && question.name !== "Why do you want to join DWASFW?");

  if (!questions.length) return null;

  return (
    <section className="space-y-6">
      <div className="border-b border-white/10 pb-3">
        <h2 className="text-xl font-semibold text-white/90">{department} Assessment</h2>
      </div>
      
      <div className="space-y-6">
        {questions.map((question) => {
          const isCompact = question.type === "short-text";

          return (
            <FormField
              key={question.name}
              control={form.control}
              name={question.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80 text-base leading-relaxed">{question.name}</FormLabel>
                  <FormControl>
                    {isCompact ? (
                      <Input
                        className="bg-white/5 border-white/10 focus-visible:ring-primary/50 text-white"
                        {...field}
                        placeholder={question.placeholder || "Your answer..."}
                      />
                    ) : (
                      <Textarea
                        className="bg-white/5 border-white/10 focus-visible:ring-primary/50 text-white min-h-[120px] resize-y"
                        {...field}
                        placeholder={question.placeholder || "2-3 sentences"}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
      </div>
    </section>
  );
};

export default FormComp;