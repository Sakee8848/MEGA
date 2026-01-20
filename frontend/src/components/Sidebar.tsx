"use client";

const NavItem = ({ id, label, icon, isActive, onClick, count }: any) => (
    <button
        onClick={() => onClick(id)}
        className={`nav-item ${isActive ? 'active' : ''}`}
    >
        <span className="w-5 flex justify-center">{icon}</span>
        <span className="flex-1 truncate">{label}</span>
        {count && (
            <span className={`text-[11px] font-medium px-1.5 rounded-full ${isActive ? 'bg-white/20' : 'text-text-tertiary'}`}>
                {count}
            </span>
        )}
    </button>
);

const SectionHeader = ({ label }: { label: string }) => (
    <h3 className="px-5 py-2 mt-4 text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
        {label}
    </h3>
);

export default function Sidebar({ activeView, onViewChange }: { activeView: string, onViewChange: (v: string) => void }) {
    const clients = ['Client A', 'Global Logistics', 'Tech Corp'];
    const carriers = ['Chubb', 'AIG', 'Liberty Mutual'];
    const projectTypes = [
        { id: 'quote', label: 'Quotations', icon: '💰' },
        { id: 'claim', label: 'Claims', icon: '🚨' },
        { id: 'renewal', label: 'Renewals', icon: '♻️' },
    ];

    return (
        <div className="sidebar flex flex-col pt-4 h-full overflow-y-auto no-scrollbar">
            {/* App Logo/Header Area */}
            <div className="px-5 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-accent-blue flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    M
                </div>
                <span className="font-semibold text-sm tracking-tight opacity-90">MEGA</span>
            </div>

            <SectionHeader label="Favorites" />
            <NavItem
                id="inbox"
                label="All Inboxes"
                icon="📥"
                isActive={activeView === 'inbox'}
                onClick={onViewChange}
                count={4}
            />
            <NavItem
                id="folder:sent"
                label="Sent"
                icon="📤"
                isActive={activeView === 'folder:sent'}
                onClick={onViewChange}
            />
            <NavItem
                id="folder:drafts"
                label="Drafts"
                icon="📝"
                isActive={activeView === 'folder:drafts'}
                onClick={onViewChange}
            />
            <NavItem
                id="folder:trash"
                label="Trash"
                icon="🗑️"
                isActive={activeView === 'folder:trash'}
                onClick={onViewChange}
            />

            <SectionHeader label="Intelligence" />
            {projectTypes.map(type => (
                <NavItem
                    key={type.id}
                    id={`intention:${type.id}`}
                    label={type.label}
                    icon={type.icon}
                    isActive={activeView === `intention:${type.id}`}
                    onClick={onViewChange}
                />
            ))}

            <SectionHeader label="Clients" />
            {clients.map(e => (
                <NavItem
                    key={e}
                    id={`entity:${e}`}
                    label={e}
                    icon="👥"
                    isActive={activeView === `entity:${e}`}
                    onClick={onViewChange}
                />
            ))}

            <SectionHeader label="Carriers" />
            {carriers.map(e => (
                <NavItem
                    key={e}
                    id={`carrier:${e}`}
                    label={e}
                    icon="🏢"
                    isActive={activeView === `carrier:${e}`}
                    onClick={onViewChange}
                />
            ))}

            <div className="mt-auto pb-4">
                <NavItem
                    id="settings"
                    label="Settings"
                    icon="⚙️"
                    isActive={activeView === 'settings'}
                    onClick={onViewChange}
                />
            </div>
        </div>
    );
}
