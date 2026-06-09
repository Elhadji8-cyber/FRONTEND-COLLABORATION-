"use client";

import { useState } from "react";
import { AppShell } from "../component/layout/app-shell";
import { PYWHeader } from "../component/pyw/pyw_header";
// Sidebar removed to let main content take full width
import { PYWOverviewWithProjectPicker } from "../component/pyw/pyw_overview";

export default function PYWPage() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <AppShell active="pyw">
            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 min-h-screen">
                <PYWHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                <div className="grid gap-8 items-stretch">
                    <PYWOverviewWithProjectPicker searchTerm={searchTerm} />
                </div>
            </div>
        </AppShell>
    );
}
