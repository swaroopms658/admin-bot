import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Agent Admin Console",
    description: "Manage your AI Agent",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased bg-neutral-900 text-white">
                {children}
            </body>
        </html>
    );
}
