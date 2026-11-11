"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { apiClient } from "../../../../lib/api-client";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Suspense } from "react";

const CreatePollForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      question: "",
      description: "",
      options: [{ text: "" }, { text: "" }], // Start with 2 empty options
      visibility: "PUBLIC",
      votingMode: "ANYONE",
    },
  });

  // useFieldArray allows us to add/remove options dynamically
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const onSubmit = async (data) => {
    setServerError("");

    // Convert options from [{text: "A"}, {text: "B"}] to ["A", "B"] for the backend
    const payload = {
      ...data,
      options: data.options.map((opt) => opt.text),
    };

    try {
      await apiClient.post("/polls", payload);
      router.push("/dashboard"); // Redirect back to dashboard on success
    } catch (error) {
      if (error.response && error.response.data) {
        setServerError(error.response.data.message || "Failed to create poll");
      } else {
        setServerError("Network error.");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Back Button */}
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create a New Poll</CardTitle>
          <CardDescription>Ask a question and provide options for people to vote on.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* 1. Question */}
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                placeholder="e.g. What is your favorite framework?"
                {...register("question", { required: "Question is required" })}
              />
              {errors.question && <p className="text-xs text-red-500">{errors.question.message}</p>}
            </div>

            {/* 2. Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Add some context to your poll"
                {...register("description")}
              />
            </div>

            {/* 3. Dynamic Options */}
            <div className="space-y-3">
              <Label>Options</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      {...register(`options.${index}.text`, { required: "Option cannot be empty" })}
                    />
                    {errors.options?.[index]?.text && (
                      <p className="text-xs text-red-500 mt-1">{errors.options[index].text.message}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 2} // Must have at least 2 options
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => append({ text: "" })}
                className="w-full border-dashed border-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>

            {/* 4. Settings (Visibility & Voting Mode) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Visibility</Label>
                <select
                  {...register("visibility")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="PUBLIC">Public (Anyone can find it)</option>
                  <option value="UNLISTED">Unlisted (Only people with link)</option>
                  <option value="PRIVATE">Private (Only you)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Voting Mode</Label>
                <select
                  {...register("votingMode")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="ANYONE">Anyone (No login required)</option>
                  <option value="LOGIN_REQUIRED">Login Required</option>
                </select>
              </div>
            </div>

            {/* Errors & Submit */}
            {serverError && (
              <div className="text-sm font-medium text-red-500 p-3 bg-red-500/10 rounded-md">
                {serverError}
              </div>
            )}

            <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Poll"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

const CreatePollPage = () => {
  return (
    <Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <CreatePollForm />
    </Suspense>
  );
}

export default CreatePollPage;