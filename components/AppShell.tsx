import Link from "next/link";
import { ClipboardCheck, FileCheck2, LayoutDashboard, Layers3 } from "lucide-react";
export default function AppShell({children}:{children:React.ReactNode}){
 return <div className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-mark">✓</div>Label Compliance</div><nav className="nav"><Link href="/"><LayoutDashboard size={16}/>Dashboard</Link><Link href="/review/new"><FileCheck2 size={16}/>New Review</Link><Link href="/applications"><ClipboardCheck size={16}/>Applications</Link></nav><div className="sidebar-note">Prototype environment<br/>Results require agent review.</div></aside><main className="main"><header className="topbar"><span className="topbar-title">TTB Label Compliance Assistant</span><div className="avatar">JM</div></header>{children}</main></div>
}
