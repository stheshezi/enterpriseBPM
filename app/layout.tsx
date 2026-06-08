import "./globals.css";

import { Providers } from "@/app/providers";

export const metadata = {
  title: "Enterprise BPM Platform",
  description: "Tenant-aware workflow request platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
