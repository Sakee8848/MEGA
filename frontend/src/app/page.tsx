"use client";

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import EmailList from '@/components/EmailList';
import Lens from '@/components/Lens';
import CommandPalette from '@/components/CommandPalette';

export default function Home() {
    const [activeView, setActiveView] = useState('inbox');
    const [selectedEmail, setSelectedEmail] = useState<any>(null);

    return (
        <div className="pane-container bg-app">
            {/* Command Palette is fixed overlay */}
            <CommandPalette />

            {/* Pane 1: Navigation Sidebar */}
            <Sidebar
                activeView={activeView}
                onViewChange={(v) => {
                    setActiveView(v);
                    setSelectedEmail(null); // Clear selection on view change
                }}
            />

            {/* Pane 2: Message List */}
            <EmailList
                viewMode={activeView}
                onSelect={setSelectedEmail}
            />

            {/* Pane 3: Content / Lens */}
            <Lens email={selectedEmail} />
        </div>
    );
}
