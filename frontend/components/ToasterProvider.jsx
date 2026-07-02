"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          padding: '8px 16px',
          fontSize: '14px',
          maxWidth: '300px',
        },
      }}
    />
  );
}
