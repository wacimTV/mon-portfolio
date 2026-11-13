"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-primary min-h-10 px-5 py-2 text-xs print:hidden"
    >
      🖨️ Imprimer l&apos;affiche comptoir (A5)
    </button>
  );
}

