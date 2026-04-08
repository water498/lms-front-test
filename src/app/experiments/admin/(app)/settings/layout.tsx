import SettingsShell from "@/features/(admin)/settings/shell";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <SettingsShell>{children}</SettingsShell>;
}
