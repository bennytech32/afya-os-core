export function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="print-container">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          nav, button, footer, .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          .print-area { width: 100%; border: none !important; box-shadow: none !important; }
        }
      `}} />
      <div className="print-area font-serif text-black p-4">
        {children}
      </div>
    </div>
  )
}