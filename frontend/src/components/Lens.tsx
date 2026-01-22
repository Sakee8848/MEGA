"use client";

interface Email {
    id: string;
    sender: string;
    subject: string;
    preview: string;
    tags: string[];
    is_quote: boolean;
    received_at: string;
}

const ToolButton = ({ icon, label }: { icon: string, label?: string }) => (
    <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors text-text-secondary hover:text-primary">
        <span className="text-base">{icon}</span>
        {label && <span className="text-[12px] font-medium">{label}</span>}
    </button>
);

export default function Lens({ email }: { email: Email | null }) {
    if (!email) {
        return (
            <div className="content-pane flex items-center justify-center text-text-tertiary">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl opacity-20">✉️</span>
                    <p className="text-sm">No Message Selected</p>
                </div>
            </div>
        );
    }

    return (
        <div className="content-pane">
            {/* Toolbar */}
            <div className="toolbar justify-between">
                <div className="flex gap-1">
                    <ToolButton icon="🗑️" />
                    <ToolButton icon="📁" />
                    <ToolButton icon="🏷️" />
                </div>
                <div className="flex gap-1">
                    <ToolButton icon="↩️" label="Reply" />
                    <ToolButton icon="↪️" label="Forward" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
                {/* Subject Header */}
                <h1 className="text-2xl font-bold mb-8 tracking-tight text-primary">
                    {email.subject}
                </h1>

                {/* Sender Info Area */}
                <div className="flex items-start gap-4 mb-10 pb-6 border-b border-subtle">
                    <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue font-bold shadow-inner">
                        {email.sender[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-[15px]">{email.sender.split('@')[0]}</span>
                                <span className="text-text-tertiary text-[13px]">&lt;{email.sender}&gt;</span>
                            </div>
                            <span className="text-text-tertiary text-[12px]">
                                {new Date(email.received_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <div className="text-[13px] text-text-tertiary">
                            To: <span className="text-text-secondary">me@broker.com</span>
                        </div>
                    </div>
                </div>

                {/* AI Intent Card - Refined Layout */}
                {email.is_quote && (
                    <div className="mb-10 p-6 rounded-2xl border border-accent-blue/20 bg-accent-blue/[0.03] backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                            <span className="text-3xl">✨</span>
                        </div>

                        <div className="flex items-center gap-2 text-accent-blue text-[11px] font-bold uppercase tracking-widest mb-4">
                            Quotation Analysis
                        </div>

                        <div className="grid grid-cols-2 gap-8 relative z-10">
                            <div className="flex flex-col gap-1">
                                <div className="text-[12px] text-text-tertiary">Premium</div>
                                <div className="text-2xl font-bold tracking-tight text-primary leading-none">$50,000</div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-[12px] text-text-tertiary">Deductible</div>
                                <div className="text-2xl font-bold tracking-tight text-primary leading-none">$5,000</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Email Body Text */}
                <div className="prose-clean text-[15px] leading-[1.6] text-text-primary whitespace-pre-wrap font-normal mb-20">
                    {email.preview}
                    <br /><br />
                    This is a simulated preview of the email content. In a production environment, this would render the full HTML or plaintext content retrieved from the backend service.
                    <br /><br />
                    Best regards,<br />
                    {email.sender.split('@')[0]}
                </div>

                {/* AI Agent Interaction - Floating Dock Style */}
                <div className="fixed bottom-8 left-[calc(var(--sidebar-width)+var(--list-width)+40px)] right-10 flex justify-center z-20">
                    <div className="w-full max-w-3xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent-blue flex items-center justify-center text-white text-xs shrink-0 shadow-lg animate-pulse">
                            AI
                        </div>
                        <input
                            type="text"
                            placeholder="Ask the MEGA Agent to draft a reply or analyze this risk..."
                            className="flex-1 bg-transparent border-none outline-none text-[14px] px-2 text-text-primary"
                        />
                        <div className="flex gap-1 pr-1">
                            <button className="px-3 py-1.5 rounded-lg bg-accent-blue text-white text-[12px] font-semibold hover:scale-105 transition-transform">
                                Draft
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
