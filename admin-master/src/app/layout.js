import { Inter } from "next/font/google";
import "./globals.css";
import SnackbarProvider from "./SnackbarProvider";
import { DialogProvider } from "./context/DialogProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Online King",
  description: "Online Assesory for Online King",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SnackbarProvider>
      <DialogProvider>
          <body className={inter.className}>{children}</body>
        </DialogProvider>
      </SnackbarProvider>
    </html>
  );
}
