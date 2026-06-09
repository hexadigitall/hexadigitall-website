/**
 * Full-screen layout for lab workspace.
 *
 * Overrides the root layout to remove Header, Footer, and other chrome
 * so the student gets an immersive terminal + topology experience.
 */
export default function LabWorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950">
      {children}
    </div>
  )
}
