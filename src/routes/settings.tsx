import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  CreditCard,
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
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  Star,
  Target,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

import { MenuCard, MenuRow, MenuSwitchRow } from "@/components/zyra/features/MenuCard";
import { Screen } from "@/components/zyra/TabBar";

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
              <p className="text-xs opacity-90">Unlock unlimited scans & insights</p>
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
            <MenuRow icon={Download} title="Export Data" />
            <MenuRow icon={Delete} title="Reset Progress" />
          </MenuCard>

          <MenuCard>
            <MenuRow icon={HelpCircle} title="FAQ" />
            <MenuRow icon={Star} title="Rate Us" />
            <MenuRow icon={Mail} title="Support" />
          </MenuCard>

          <MenuCard>
            <MenuRow icon={RotateCcw} title="Restore Purchase" />
            <MenuRow icon={CreditCard} title="Manage Subscriptions" />
            <Link to="/purchase-history" className="block">
              <MenuRow icon={ReceiptText} title="Purchase History" />
            </Link>
          </MenuCard>

          <MenuCard>
            <Link to="/privacy-settings" className="block">
              <MenuRow icon={ShieldCheck} title="Privacy Policy" />
            </Link>
            <MenuRow icon={FileText} title="Terms of Use" />
          </MenuCard>

          <MenuCard>
            <MenuRow icon={User} title="Not signed in" trailing={<span />} />
          </MenuCard>
        </div>
      </div>
    </Screen>
  );
}
