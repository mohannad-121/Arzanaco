import { Sparkles } from 'lucide-react';
import type { FormEventHandler } from 'react';

type AiQuestionInputProps = {
  id: string;
  value: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  sendLabel: string;
};

export function AiQuestionInput({ id, value, placeholder, disabled = false, onChange, onSubmit, sendLabel }: AiQuestionInputProps) {
  return <form className="arzana-ai-input group" onSubmit={onSubmit}>
    <span className="arzana-ai-input__underline" aria-hidden="true" />
    <span className="arzana-ai-input__ripple" aria-hidden="true" />
    <span className="arzana-ai-input__fade" aria-hidden="true" />
    <span className="arzana-ai-input__dots" aria-hidden="true"><span /><span /><span /><span /></span>
    <label className="sr-only" htmlFor={id}>{placeholder}</label>
    <input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} maxLength={900} disabled={disabled} className="relative z-10 min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-[#252525] outline-none placeholder:text-[#797979] disabled:cursor-not-allowed" />
    <button type="submit" disabled={disabled || !value.trim()} aria-label={sendLabel} className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#991b3f] transition duration-300 hover:scale-[1.06] hover:bg-[#f7e9ee] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f102d] disabled:cursor-not-allowed disabled:opacity-45"><Sparkles className="h-5 w-5" aria-hidden="true" /></button>
  </form>;
}
