import PlatformSettingsShell from "@/features/(platform-admin)/settings/shell";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <PlatformSettingsShell>{children}</PlatformSettingsShell>;
}
