'use client'

type HikingLayoutProps = {
  sidebar: React.ReactNode
  map: React.ReactNode
}

export function HikingLayout({ sidebar, map }: HikingLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <aside className="w-full md:w-[300px] md:flex-shrink-0 border-b md:border-b-0 md:border-r border-border overflow-y-auto bg-background">
        {sidebar}
      </aside>
      <main className="flex-1 relative min-h-[260px]">{map}</main>
    </div>
  )
}
