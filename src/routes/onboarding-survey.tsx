import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Check } from "lucide-react";
import { useState } from "react";

import { surveyQuestions } from "@/components/zyra/onboarding/surveyData";
import { Screen } from "@/components/zyra/TabBar";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/onboarding-survey")({
  head: () => ({
    meta: [
      { title: "ZyraFit — Quick Survey" },
      { name: "description", content: "A few quick questions to personalize your ZyraFit plan." },
      { property: "og:title", content: "ZyraFit — Quick Survey" },
      { property: "og:description", content: "A few quick questions to personalize your ZyraFit plan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OnboardingSurveyScreen,
});

function OnboardingSurveyScreen() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const total = surveyQuestions.length;
  const question = surveyQuestions[index] ?? surveyQuestions[0]!;
  const isLast = index === total - 1;

  const answer = answers[question.id];
  const isAnswered =
    question.type === "single" ? typeof answer === "string" : Array.isArray(answer) && answer.length > 0;
  const canContinue = question.required ? isAnswered : true;

  const finish = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        onboarding_answers: answers,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      });
    }
    navigate({ to: "/ready-to-start" });
  };

  const goNext = () => {
    if (isLast) {
      finish();
      return;
    }
    setIndex((i) => i + 1);
  };

  const goBack = () => {
    if (index === 0) return;
    setIndex((i) => i - 1);
  };

  const skip = () => {
    setAnswers((a) => {
      const next = { ...a };
      delete next[question.id];
      return next;
    });
    goNext();
  };

  const selectSingle = (value: string) => {
    setAnswers((a) => ({ ...a, [question.id]: value }));
    setTimeout(() => goNext(), 220);
  };

  const toggleMulti = (value: string) => {
    setAnswers((a) => {
      const current = Array.isArray(a[question.id]) ? (a[question.id] as string[]) : [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...a, [question.id]: next };
    });
  };

  const selectedMulti = Array.isArray(answer) ? answer : [];

  return (
    <Screen>
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col bg-background text-foreground">
      <div className="flex items-center gap-3 px-4 pb-2 pt-4">
        <button
          type="button"
          onClick={goBack}
          className="flex h-11 w-11 items-center justify-center"
          aria-label="Back"
        >
          {index > 0 ? <ChevronLeft className="h-5 w-5 text-muted-foreground" /> : null}
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        <span className="w-10 text-right text-sm font-semibold text-muted-foreground">
          {index + 1}/{total}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-4">
        {question.emoji ? <p className="mb-3 text-[26px]">{question.emoji}</p> : null}
        <h1 className="text-[22px] font-bold leading-tight">{question.title}</h1>
        {question.subtitle ? (
          <p className="mt-2 text-[14.5px] leading-6 text-muted-foreground">{question.subtitle}</p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3">
          {question.options.map((option) => {
            const selected =
              question.type === "single" ? answer === option.value : selectedMulti.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  question.type === "single" ? selectSingle(option.value) : toggleMulti(option.value)
                }
                className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left text-[15px] font-medium transition-colors ${
                  selected ? "border-primary bg-primary/10" : "border-border bg-card"
                }`}
              >
                {option.label}
                {question.type === "multi" ? (
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                      selected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {selected ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 pb-8 pt-2">
        <button
          type="button"
          disabled={!canContinue}
          onClick={goNext}
          className="h-14 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground disabled:bg-muted disabled:text-muted-foreground"
        >
          {isLast ? "Done" : "Continue"}
        </button>
        {!question.required ? (
          <button type="button" onClick={skip} className="mt-2 w-full py-2 text-sm font-medium text-muted-foreground">
            Skip
          </button>
        ) : (
          <div className="h-[44px]" />
        )}
      </div>
    </div>
  </Screen>
  );
}
