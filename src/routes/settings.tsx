import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  Crown,
  Database,
  Delete,
  Download,
  FileText,
  Globe,
  HelpCircle,
  Mail,
  Moon,
  Palette,
  ShieldCheck,
  Star,
  Target,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MenuCard, MenuRow, MenuSwitchRow } from "@/components/zyra/features/MenuCard";
import { Screen } from "@/components/zyra/TabBar";
import { supabase } from "@/integrations/supabase/client";
import { authedFetch } from "@/lib/auth-fetch";
import { clearLocalData, exportLocalData } from "@/lib/local-data";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ZyraFit" },
      { name: "description", content: "App preferences, reminders, data, and account settings." },
      { property: "og:title", content: "Settings — ZyraFit" },
      {
        property: "og:description",
        content: "App preferences, reminders, data, and account settings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsScreen,
});

function AccountRows() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    const apply = (session: { user: { email?: string | null } } | null) => {
      if (!active) return;
      setSignedIn(Boolean(session));
      setEmail(session?.user.email ?? null);
      setLoaded(true);
    };
    void supabase.auth.getSession().then(({ data }) => apply(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => apply(session));
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else toast.success("Signed out");
  };

  const deleteAccount = async () => {
    setBusy(true);
    try {
      const res = await authedFetch("/api/delete-account", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) return void toast.error(data.error ?? "Could not delete your account. Please try again.");
      clearLocalData();
      await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
      setConfirmDelete(false);
      toast.success("Your account and data were deleted");
      void navigate({ to: "/" });
    } catch {
      toast.error("Could not delete your account. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const action = (label: string) => <span className="text-sm font-medium text-primary">{label}</span>;

  if (!loaded) return <MenuRow icon={User} title="Account" trailing={<span />} />;
  if (!signedIn) {
    return (
      <Link to="/auth" className="block">
        <MenuRow icon={User} title="Not signed in" trailing={action("Sign in")} />
      </Link>
    );
  }
  return (
    <>
      <MenuRow icon={User} title={email ?? "Signed in"} trailing={action("Sign out")} onClick={() => void signOut()} />
      <MenuRow
        icon={Trash2}
        title="Delete account"
        trailing={<span className="text-sm font-medium text-destructive">Delete</span>}
        onClick={() => setConfirmDelete(true)}
      />
      <AlertDialog open={confirmDelete} onOpenChange={(open) => !busy && setConfirmDelete(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes your account, your quiz answers, your workout routines and the invitations tied
              to your email, and clears ZyraFit data stored on this device. It cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              onClick={(event) => {
                event.preventDefault();
                void deleteAccount();
              }}
            >
              {busy ? "Deleting…" : "Delete everything"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function DataRows() {
  const [confirmReset, setConfirmReset] = useState(false);

  const exportData = () => {
    const url = URL.createObjectURL(new Blob([exportLocalData()], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "zyrafit-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <MenuRow icon={Download} title="Export Data" onClick={exportData} />
      <MenuRow icon={Delete} title="Reset Progress" onClick={() => setConfirmReset(true)} />
      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This clears your food log, goals, water tracking and favorites on this device. Your account is not
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clearLocalData();
                toast.success("Progress reset");
                window.location.reload();
              }}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function SettingsScreen() {
  const [metric, setMetric] = useState(true);
  const [mealReminders, setMealReminders] = useState(false);
  const [waterReminders, setWaterReminders] = useState(true);

  return (
    <Screen>
      <div className="flex min-h-svh flex-col">
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <Link
            to="/profile"
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"
          >
            <X className="h-5 w-5 text-foreground" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
          <div className="w-9" />
        </header>

        <div className="flex flex-col gap-4 px-0 pb-10 pt-1">
          <Link
            to="/pricing"
            className="mx-4 flex items-center gap-3 rounded-2xl bg-primary px-4 py-3.5 text-primary-foreground"
          >
            <Crown className="h-5 w-5" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Go Pro</p>
              <p className="text-xs opacity-90">Premium features are coming soon</p>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Link>

          <MenuCard>
            <MenuRow icon={Globe} title="Language" trailing={<span className="text-sm text-muted-foreground">English</span>} />
            <MenuRow icon={Moon} title="Dark Mode" />
            <MenuRow
              icon={Palette}
              title="Color Theme"
              trailing={
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  Blue <ChevronRight className="h-4 w-4" />
                </span>
              }
            />
            <MenuRow icon={Bell} title="Notifications" />
          </MenuCard>

          <MenuCard
            header={
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground/85">
                <Target className="h-4 w-4 text-muted-foreground" />
                Nutrition
              </span>
            }
          >
            <MenuRow icon={Target} title="Goals & Profile" />
            <MenuSwitchRow
              icon={ChevronRight}
              title={`Units: ${metric ? "Metric" : "Imperial"}`}
              checked={metric}
              onChange={setMetric}
            />
          </MenuCard>

          <MenuCard
            header={
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground/85">
                <Bell className="h-4 w-4 text-muted-foreground" />
                Reminders
              </span>
            }
          >
            <MenuSwitchRow
              icon={Bell}
              title="Meal Reminders"
              checked={mealReminders}
              onChange={setMealReminders}
            />
            <MenuSwitchRow
              icon={Bell}
              title="Water Reminders"
              checked={waterReminders}
              onChange={setWaterReminders}
            />
          </MenuCard>

          <MenuCard
            header={
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground/85">
                <Database className="h-4 w-4 text-muted-foreground" />
                Data
              </span>
            }
          >
            <DataRows />
          </MenuCard>

          <MenuCard>
            <MenuRow icon={HelpCircle} title="FAQ" />
            <MenuRow icon={Star} title="Rate Us" />
            <a href="mailto:zyrafitsupport@gmail.com?subject=ZyraFit%20support" className="block">
              <MenuRow icon={Mail} title="Support" />
            </a>
          </MenuCard>

          <MenuCard>
            <Link to="/privacy" className="block">
              <MenuRow icon={ShieldCheck} title="Privacy Policy" />
            </Link>
            <Link to="/terms" className="block">
              <MenuRow icon={FileText} title="Terms of Use" />
            </Link>
          </MenuCard>

          <MenuCard>
            <AccountRows />
          </MenuCard>
        </div>
      </div>
    </Screen>
  );
}
