"use client";
import { useState, useEffect } from 'react';

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-md px-4">
            <div
                className="w-full max-w-lg bg-[#2c2c2e]/90 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] rounded-xl overflow-hidden animate-in fade-in zoom-in duration-150"
            >
                <div className="p-4 flex items-center gap-3 bg-white/5">
                    <span className="text-xl opacity-80">🔍</span>
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search commands or agents..."
                        className="flex-1 bg-transparent border-none outline-none text-white text-[15px] placeholder:text-white/30"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="flex gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] text-white/40">ESC</kbd>
                    </div>
                </div>

                <div className="p-2 max-h-[360px] overflow-y-auto">
                    <Section label="Suggested Actions" />
                    <Item icon="🤖" label="Analyze Risk Gaps" sub="AI review of coverage vs benchmarks" />
                    <Item icon="📑" label="Extract Quote Fields" sub="Fast OCR for premium & limits" />
                    <Item icon="📧" label="Draft Renewal Notice" sub="Using Skill: Hard Market Explanation" />

                    <Section label="Navigation" />
                    <Item icon="🏠" label="Go to Main Inbox" sub="Focus Dimension: Time" />
                    <Item icon="🏢" label="Switch to Carrier: Chubb" sub="Entity View" />
                </div>

                <div className="p-3 border-t border-white/5 bg-black/20 flex justify-between items-center text-[11px] text-white/30 px-5">
                    <div className="flex gap-4">
                        <span>↑↓ Navigate</span>
                        <span>↵ Select</span>
                    </div>
                    <div>MEGA Command bar</div>
                </div>
            </div>
        </div>
    );
}

function Section({ label }: { label: string }) {
    return (
        <h3 className="px-3 pt-3 pb-1 text-[10px] font-bold text-white/30 uppercase tracking-widest">
            {label}
        </h3>
    );
}

function Item({ icon, label, sub }: { icon: string, label: string, sub: string }) {
    return (
        <button className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent-blue group text-left transition-all px-4">
            <span className="text-lg w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/20">
                {icon}
            </span>
            <div className="flex-1">
                <div className="text-[13px] font-medium text-white/90 group-hover:text-white">{label}</div>
                <div className="text-[11px] text-white/40 group-hover:text-white/70">{sub}</div>
            </div>
        </button>
    );
}
