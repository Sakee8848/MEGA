"use client";
import { useState } from 'react';

interface ComposeModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        to?: string;
        subject?: string;
        body?: string;
    };
}

export default function ComposeModal({ isOpen, onClose, initialData }: ComposeModalProps) {
    const [to, setTo] = useState(initialData?.to || '');
    const [subject, setSubject] = useState(initialData?.subject || '');
    const [body, setBody] = useState(initialData?.body || '');
    const [isSending, setIsSending] = useState(false);

    if (!isOpen) return null;

    const handleSend = async (folder: 'sent' | 'drafts') => {
        try {
            setIsSending(true);
            const res = await fetch('http://localhost:8000/emails/compose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject,
                    recipients: [to],
                    body_text: body,
                    folder
                })
            });

            if (res.ok) {
                onClose();
                // Reset state
                setTo('');
                setSubject('');
                setBody('');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-[#1c1c1e] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header / Toolbar */}
                <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex gap-4">
                        <button onClick={onClose} className="text-accent-blue text-sm font-medium hover:opacity-80">Cancel</button>
                    </div>
                    <h2 className="text-white font-semibold text-sm">New Message</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleSend('drafts')}
                            disabled={isSending}
                            className="text-accent-blue text-sm font-medium hover:opacity-80"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => handleSend('sent')}
                            disabled={isSending || !to}
                            className="text-accent-blue text-sm font-bold hover:opacity-80 disabled:opacity-30"
                        >
                            {isSending ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </div>

                {/* Fields */}
                <div className="flex flex-col">
                    <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2">
                        <span className="text-text-tertiary text-xs min-w-[32px]">To:</span>
                        <input
                            type="text"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            placeholder="email@example.com"
                            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/10"
                        />
                    </div>
                    <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2">
                        <span className="text-text-tertiary text-xs min-w-[32px]">Subject:</span>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Topic"
                            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/10"
                        />
                    </div>
                </div>

                {/* Body Editor */}
                <textarea
                    autoFocus
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="flex-1 min-h-[300px] bg-transparent p-4 text-sm text-white outline-none resize-none leading-relaxed placeholder:text-white/5"
                    placeholder="Write your email here..."
                />

                {/* Attachment bar placeholder */}
                <div className="px-4 py-2 border-t border-white/5 bg-white/[0.02] flex items-center gap-4">
                    <button className="text-lg opacity-60 hover:opacity-100 transition-opacity">📎</button>
                    <button className="text-lg opacity-60 hover:opacity-100 transition-opacity">🖼️</button>
                    <button className="text-lg opacity-60 hover:opacity-100 transition-opacity">✏️</button>
                </div>
            </div>
        </div>
    );
}
