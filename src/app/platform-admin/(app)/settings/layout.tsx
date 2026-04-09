import PlatformSettingsShell from "@/features/(platform-admin)/settings-layout/feature";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <PlatformSettingsShell>{children}</PlatformSettingsShell>;
}
