"use client";
import { useState, useEffect } from 'react';

interface Email {
    id: string;
    sender: string;
    subject: string;
    preview: string;
    received_at: string;
    tags: string[];
    is_quote: boolean;
    is_claim: boolean;
}

export default function EmailList({ viewMode, onSelect }: { viewMode: string, onSelect: (e: Email) => void }) {
    const [emails, setEmails] = useState<Email[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEmails() {
            try {
                setLoading(true);
                let url = 'http://localhost:8000/emails/mirror';

                if (viewMode === 'inbox') {
                    url += '?view_type=time';
                } else if (viewMode.startsWith('entity:')) {
                    const entity = viewMode.split(':')[1];
                    url += `?view_type=entity&entity_filter=${encodeURIComponent(entity)}`;
                } else if (viewMode.startsWith('carrier:')) {
                    const carrier = viewMode.split(':')[1];
                    url += `?view_type=entity&entity_filter=${encodeURIComponent(carrier)}`;
                } else if (viewMode.startsWith('intention:')) {
                    const intent = viewMode.split(':')[1];
                    url += `?view_type=intention&entity_filter=${encodeURIComponent(intent)}`;
                } else if (viewMode === 'mirror') {
                    url += '?view_type=intention&entity_filter=quote';
                }

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setEmails(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchEmails();
    }, [viewMode]);

    const handleSelect = (email: Email) => {
        setSelectedId(email.id);
        onSelect(email);
    };

    const getTitle = () => {
        if (viewMode === 'inbox') return 'All Inboxes';
        if (viewMode.startsWith('entity:')) return viewMode.split(':')[1];
        if (viewMode.startsWith('carrier:')) return viewMode.split(':')[1];
        if (viewMode.startsWith('intention:')) {
            const type = viewMode.split(':')[1];
            return type.charAt(0).toUpperCase() + type.slice(1) + 's';
        }
        return 'Entity Mirror';
    };

    return (
        <div className="list-pane h-full">
            {/* Toolbar / Header */}
            <div className="toolbar flex flex-col items-start justify-center gap-1 h-[72px]">
                <h2 className="text-[17px] font-bold tracking-tight">{getTitle()}</h2>
                <div className="text-[11px] text-text-tertiary font-medium">
                    {loading ? 'Refreshing...' : `${emails.length} Messages`}
                </div>
            </div>

            {/* Filter / Search Bar area */}
            <div className="px-3 py-2 border-b border-subtle flex gap-2">
                <div className="flex-1 bg-white/5 rounded-md px-2 py-1 flex items-center gap-2 border border-subtle">
                    <span className="text-xs">🔍</span>
                    <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-xs w-full text-primary" />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="p-10 text-center text-text-secondary text-xs">Loading items...</div>
                ) : emails.map((email) => (
                    <div
                        key={email.id}
                        onClick={() => handleSelect(email)}
                        className={`message-item ${selectedId === email.id ? 'selected' : ''}`}
                    >
                        <div className="unread-dot" />

                        <div className="flex justify-between items-baseline mb-0.5 ml-1">
                            <span className={`text-[14px] truncate flex-1 font-semibold ${selectedId === email.id ? 'text-primary' : ''}`}>
                                {email.sender.split('@')[0]}
                            </span>
                            <span className="text-[12px] text-text-tertiary ml-2">
                                {new Date(email.received_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                        </div>

                        <div className={`text-[13px] truncate ml-1 mb-0.5 ${selectedId === email.id ? 'text-primary' : 'text-primary'}`}>
                            {email.subject}
                        </div>

                        <div className="text-[13px] text-text-secondary overflow-hidden text-ellipsis line-clamp-2 ml-1 leading-snug">
                            {email.preview}
                        </div>

                        {/* Mirror Badges */}
                        <div className="flex gap-1.5 mt-2 ml-1">
                            {email.is_quote && (
                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-accent-blue/10 text-accent-blue border border-accent-blue/30">
                                    Quote
                                </span>
                            )}
                            {email.is_claim && (
                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-red-500/10 text-red-400 border border-red-500/30">
                                    Claim
                                </span>
                            )}
                        </div>
                    </div>
                ))}
                {!loading && emails.length === 0 && (
                    <div className="p-10 text-center text-text-tertiary text-xs">No matches found for this view.</div>
                )}
            </div>
        </div>
    );
}
