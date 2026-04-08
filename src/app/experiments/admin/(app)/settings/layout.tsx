import SettingsShell from "@/features/(admin)/settings-layout/feature";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <SettingsShell>{children}</SettingsShell>;
}
