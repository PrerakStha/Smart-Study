const OPTIONS = [
  ['summary', 'Summary'],
  ['quiz', 'Quiz'],
  ['flashcards', 'Flashcards'],
];

// FR8: generate a summary, a quiz, flashcards, or any combination
export default function GenerationOptions({ value, onChange, disabled }) {
  const toggle = (key) => onChange({ ...value, [key]: !value[key] });

  return (
    <div className="flex flex-wrap gap-3">
      {OPTIONS.map(([key, label]) => {
        const checked = value[key];
        return (
          <button
            key={key}
            type="button"
            role="checkbox"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => toggle(key)}
            className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition disabled:opacity-60 ${
              checked
                ? 'border-brand/60 bg-brand/15 text-white'
                : 'border-line bg-card text-zinc-400 hover:text-white'
            }`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded border ${
                checked ? 'border-brand bg-brand' : 'border-zinc-600'
              }`}
            >
              {checked && (
                <svg className="h-3 w-3 text-surface" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            {label}
          </button>
        );
      })}
    </div>
  );
}