"use client";

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import EmailList from '@/components/EmailList';
import Lens from '@/components/Lens';
import CommandPalette from '@/components/CommandPalette';
import ComposeModal from '@/components/ComposeModal';

export default function Home() {
    const [activeView, setActiveView] = useState('inbox');
    const [selectedEmail, setSelectedEmail] = useState<any>(null);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [composeData, setComposeData] = useState<any>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

    const handleReply = (email: any) => {
        setComposeData({
            to: email.sender,
            subject: `Re: ${email.subject}`,
            body: `\n\n--- On ${new Date(email.received_at).toLocaleString()}, ${email.sender} wrote ---\n\n${email.preview}`
        });
        setIsComposeOpen(true);
    };

    const handleForward = (email: any) => {
        setComposeData({
            to: '',
            subject: `Fwd: ${email.subject}`,
            body: `\n\n--- Forwarded Message ---\nFrom: ${email.sender}\nDate: ${new Date(email.received_at).toLocaleString()}\nSubject: ${email.subject}\n\n${email.preview}`
        });
        setIsComposeOpen(true);
    };

    const handleDelete = async (email: any) => {
        try {
            await fetch(`http://localhost:8000/emails/${email.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_deleted: true, folder: 'trash' })
            });
            setSelectedEmail(null);
            triggerRefresh();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="pane-container bg-app">
            {/* Command Palette is fixed overlay */}
            <CommandPalette />

            {/* Compose Modal */}
            <ComposeModal
                isOpen={isComposeOpen}
                onClose={() => {
                    setIsComposeOpen(false);
                    setComposeData(null);
                    triggerRefresh();
                }}
                initialData={composeData}
            />

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
                key={`${activeView}-${refreshTrigger}`} // Refresh list on view change or refresh trigger
                viewMode={activeView}
                onSelect={setSelectedEmail}
            />

            {/* Pane 3: Content / Lens */}
            <Lens
                email={selectedEmail}
                onReply={handleReply}
                onForward={handleForward}
                onDelete={handleDelete}
            />

            {/* New Message Floating Button (Visual for Apple Style) */}
            <button
                onClick={() => {
                    setComposeData(null);
                    setIsComposeOpen(true);
                }}
                className="fixed bottom-8 right-8 w-14 h-14 bg-accent-blue rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:scale-110 active:scale-95 transition-all z-50"
            >
                ✍️
            </button>
        </div>
    );
}
