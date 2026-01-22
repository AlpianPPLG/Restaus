import React from 'react';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black font-sans text-slate-900 dark:text-slate-50">
      {/* Full width container, no mobile constraints */}
      <main className="w-full min-h-screen">
        {children}
      </main>
    </div>
  );
}
