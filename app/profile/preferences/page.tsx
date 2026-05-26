"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ThemeContext } from "@/app/providers";
import { PageContainer, PageHeader } from "@/components/layout";
import { Card, Select } from "@/components/ui";

export default function PreferencesPage() {
  const router = useRouter();
  useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login?callbackUrl=/profile/preferences");
    },
  });
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.theme === "dark";

  return (
    <PageContainer>
      <PageHeader title="Preferences" description="User-specific UI preferences for the workspace." />
      <div className="stack">
        <Card title="Theme" description="Choose the interface mode used on this device.">
          <label className="preference-row">
            <span>
              <strong>Dark mode</strong>
              <small>Applies immediately and is remembered locally.</small>
            </span>
            <input
              type="checkbox"
              checked={isDark}
              onChange={(event) => themeContext?.setTheme(event.target.checked ? "dark" : "light")}
            />
          </label>
        </Card>
        <Card title="Regional display">
          <Select label="Language" options={[{ label: "English", value: "en" }]} defaultValue="en" />
          <Select label="Date Format" options={[{ label: "YYYY-MM-DD", value: "yyyy-mm-dd" }, { label: "DD/MM/YYYY", value: "dd-mm-yyyy" }]} defaultValue="yyyy-mm-dd" />
        </Card>
        <Card title="Dashboard Layout">
          <div className="component-state">Dashboard layout personalization will be enabled after metrics are connected.</div>
        </Card>
      </div>
    </PageContainer>
  );
}
