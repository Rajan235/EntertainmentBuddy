// "use client";

// import { Sidebar } from "@/components/layouts/Sidebar";
// import { Navbar } from "@/components/layouts/Navbar";

// export default function MainLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex h-screen bg-background text-foreground">
//       <Sidebar />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Navbar />
//         <main className="flex-1 overflow-y-auto">
//           <div className="p-4 sm:p-6 lg:p-8">{children}</div>
//         </main>
//       </div>
//     </div>
//   );
// }
"use client";

import { Sidebar } from "@/components/layouts/Sidebar";
import { Navbar } from "@/components/layouts/Navbar";
//import { MobileSidebar } from "@/components/layouts/MobileSidebar"; // We'll create this

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* 1. Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden lg:block w-64 border-r bg-muted/10">
        <Sidebar />
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar contains the Mobile Menu Trigger */}
        <Navbar />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
