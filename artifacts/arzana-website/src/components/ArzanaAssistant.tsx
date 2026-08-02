import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { Link, useLocation } from 'wouter';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Bot, ExternalLink, LoaderCircle, RotateCcw, Sparkles, UserRound, X } from 'lucide-react';
import { AiQuestionInput } from './AiQuestionInput';
import { useLanguage } from '../contexts/LanguageContext';

type Action = { label: string; url: string; type: 'link' };
type Message = { role: 'user' | 'assistant'; content: string; actions?: Action[] };
type AssistantContextValue = { openAssistant: () => void };
const AssistantContext = createContext<AssistantContextValue | null>(null);
const englishQuestions = ['What products does Arzana provide?', 'Tell me about testing and commissioning.', 'Show me safety systems.', 'How can I request a quote?', 'What is your WhatsApp number?', 'Where is Arzana located?'];
const arabicQuestions = ['ما هي منتجات أرزانا؟', 'أخبرني عن الاختبار والتشغيل.', 'اعرض أنظمة السلامة.', 'كيف أطلب عرض سعر؟', 'ما رقم واتساب الشركة؟', 'أين يقع مقر أرزانا؟'];

function isSafeAction(url: string) {
  if (url.startsWith('/')) return /^\/(?:products(?:\/[-a-z0-9]+){0,2}|request-quote|contact|testing-commissioning|safety-systems)$/.test(url);
  if (/^tel:\+966(?:566676600|597080480|530637156)$/.test(url)) return true;
  if (/^mailto:(?:m\.saadi|moath|projects)@arzanaco\.com$/i.test(url)) return true;
  return url === 'https://wa.me/966566676600' || url === 'https://maps.app.goo.gl/nPuY2zpt2Gx1axCY9';
}

export function useArzanaAssistant() {
  const context = useContext(AssistantContext);
  if (!context) throw new Error('useArzanaAssistant must be used within AssistantProvider');
  return context;
}

export function AssistantProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const openAssistant = useCallback(() => setIsOpen(true), []);
  const value = useMemo(() => ({ openAssistant }), [openAssistant]);
  return <AssistantContext.Provider value={value}>{children}<ArzanaAssistant isOpen={isOpen} onOpenChange={setIsOpen} /></AssistantContext.Provider>;
}

function ArzanaAssistant({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (value: boolean) => void }) {
  const { language } = useLanguage();
  const [location] = useLocation();
  const reducedMotion = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const isAdmin = location.startsWith('/admin-panel');
  const ar = language === 'ar';
  const copy = ar ? { title: 'مساعد أرزانا الذكي', status: 'معلومات عامة متحقق منها', placeholder: 'اسأل عن أرزانا', open: 'فتح مساعد أرزانا الذكي', close: 'إغلاق المساعد', clear: 'بدء محادثة جديدة', send: 'إرسال السؤال', suggested: 'أسئلة مقترحة', unavailable: 'المساعد غير متاح مؤقتاً. يرجى التواصل مع أرزانا عبر واتساب أو البريد الإلكتروني.', loading: 'جارٍ التحقق من معلومات أرزانا…' } : { title: 'ARZANA AI', status: 'Verified public company knowledge', placeholder: 'Ask a question about Arzana', open: 'Open ARZANA AI', close: 'Close assistant', clear: 'Start a new conversation', send: 'Send question', suggested: 'Suggested questions', unavailable: 'Arzana AI is temporarily unavailable. Please contact Arzana through WhatsApp or email.', loading: 'Checking Arzana’s verified information…' };
  const initialMessage = (): Message => ({ role: 'assistant', content: ar ? 'مرحباً بك في مساعد أرزانا الذكي. يمكنني مساعدتك في المنتجات والخدمات وأنظمة السلامة والاختبار والتشغيل والعملاء وطرق التواصل وطلب عرض السعر.' : 'Welcome to ARZANA AI. I can help with products, services, safety systems, testing and commissioning, clients, contact details, and quotation requests.' });

  useEffect(() => { if (messages.length === 0) setMessages([initialMessage()]); }, [language]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [messages, isLoading, error]);
  useEffect(() => { if (!isOpen || !window.matchMedia('(max-width: 639px)').matches) return; const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous; }; }, [isOpen]);
  useEffect(() => { if (!isOpen) return; const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onOpenChange(false); }; window.addEventListener('keydown', closeOnEscape); return () => window.removeEventListener('keydown', closeOnEscape); }, [isOpen, onOpenChange]);

  const sendMessage = async (value = input) => {
    const content = value.trim();
    if (!content || isLoading) return;
    setMessages((current) => [...current, { role: 'user', content }]); setInput(''); setError(''); setIsLoading(true);
    try {
      const response = await fetch('/api/arzana-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: content, language }) });
      const payload = await response.json() as { message?: string; actions?: Action[] };
      if (!response.ok || typeof payload.message !== 'string') throw new Error(payload.message || copy.unavailable);
      const answer = payload.message;
      setMessages((current) => [...current, { role: 'assistant', content: answer, actions: Array.isArray(payload.actions) ? payload.actions.filter((action) => isSafeAction(action.url)) : [] }]);
    } catch { setInput(content); setError(copy.unavailable); }
    finally { setIsLoading(false); }
  };
  const clear = () => { setMessages([initialMessage()]); setInput(''); setError(''); };
  if (isAdmin) return null;
  const side = ar ? 'left-[calc(env(safe-area-inset-left)+1rem)] sm:left-5' : 'right-[calc(env(safe-area-inset-right)+1rem)] sm:right-5';
  const panelSide = ar ? 'sm:left-5' : 'sm:right-5';
  return <>
    <AnimatePresence>{isOpen && <motion.section role="dialog" aria-modal="true" initial={reducedMotion ? false : { opacity: 0, y: 12, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reducedMotion ? undefined : { opacity: 0, y: 10, scale: .98 }} transition={{ duration: .25, ease: [.16, 1, .3, 1] }} aria-label={copy.title} className={`fixed inset-x-2 bottom-[calc(env(safe-area-inset-bottom)+.5rem)] top-[calc(env(safe-area-inset-top)+.5rem)] z-[70] flex flex-col overflow-hidden rounded-2xl border border-[#6f102d]/20 bg-[#fffdfb] shadow-[0_24px_70px_rgba(39,40,42,.3)] sm:inset-x-auto sm:top-auto sm:bottom-24 sm:h-[min(43rem,calc(100svh-8rem))] sm:w-[min(25rem,calc(100vw-2.5rem))] ${panelSide}`} dir={ar ? 'rtl' : 'ltr'}>
      <header className="flex items-start justify-between border-b border-[#6f102d]/12 bg-[#292a2c] px-5 py-4 text-white"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#991b3f]"><Bot className="h-5 w-5" /></div><div><h2 className="font-bold tracking-wide">{copy.title}</h2><p className="mt-0.5 text-xs text-white/65">{copy.status}</p></div></div><div className="flex items-center gap-1"><button type="button" onClick={clear} aria-label={copy.clear} className="grid h-9 w-9 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><RotateCcw className="h-4 w-4" /></button><button type="button" onClick={() => onOpenChange(false)} aria-label={copy.close} className="grid h-9 w-9 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><X className="h-5 w-5" /></button></div></header>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(140deg,#fffdfb,#f8eff1)] p-4" aria-live="polite">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${message.role === 'user' ? 'order-2 bg-[#7c1e32]' : 'bg-[#55585a]'} text-white`}>{message.role === 'user' ? <UserRound className="h-4 w-4" /> : <Bot className="h-4 w-4" />}</div><div className={`max-w-[83%] whitespace-pre-line rounded-2xl px-3.5 py-3 text-sm leading-6 ${message.role === 'user' ? 'order-1 rounded-ee-sm bg-[#991b3f] text-white' : 'rounded-es-sm border border-[#6f102d]/10 bg-white text-[#252525] shadow-sm'}`}><p>{message.content}</p>{message.actions?.length ? <div className="mt-3 flex flex-wrap gap-2">{message.actions.map((action) => action.url.startsWith('/') ? <Link key={action.url} href={action.url} onClick={() => onOpenChange(false)} className="inline-flex items-center gap-1.5 rounded-full bg-[#292a2c] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#991b3f]">{action.label}<ExternalLink className="h-3 w-3" /></Link> : <a key={action.url} href={action.url} target={action.url.startsWith('http') ? '_blank' : undefined} rel={action.url.startsWith('http') ? 'noopener noreferrer' : undefined} className="inline-flex items-center gap-1.5 rounded-full bg-[#292a2c] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#991b3f]">{action.label}<ExternalLink className="h-3 w-3" /></a>)}</div> : null}</div></div>)}{isLoading ? <div className="flex items-center gap-2 rounded-xl border border-[#6f102d]/10 bg-white p-3 text-sm text-[#797979]"><LoaderCircle className="h-4 w-4 animate-spin text-[#991b3f]" />{copy.loading}</div> : null}{error ? <p role="alert" className="rounded-xl border border-[#991b3f]/25 bg-[#f7e9ee] p-3 text-sm leading-6 text-[#6f102d]">{error}</p> : null}<div ref={endRef} /></div>
      <div className="border-t border-[#6f102d]/10 bg-white p-3"><p className="mb-2 text-[.65rem] font-bold uppercase tracking-[.13em] text-[#6f102d]">{copy.suggested}</p><div className="mb-3 flex gap-2 overflow-x-auto pb-1">{(ar ? arabicQuestions : englishQuestions).map((question) => <button key={question} type="button" onClick={() => void sendMessage(question)} disabled={isLoading} className="shrink-0 rounded-full border border-[#6f102d]/18 bg-[#fffdfb] px-3 py-1.5 text-xs font-semibold text-[#6f102d] transition hover:border-[#991b3f] hover:bg-[#f7e9ee] disabled:opacity-50">{question}</button>)}</div><AiQuestionInput id="arzana-ai-message" value={input} onChange={setInput} placeholder={copy.placeholder} disabled={isLoading} sendLabel={copy.send} onSubmit={(event) => { event.preventDefault(); void sendMessage(); }} /></div>
    </motion.section>}</AnimatePresence>
    <button type="button" onClick={() => onOpenChange(!isOpen)} aria-label={copy.open} aria-expanded={isOpen} className={`group fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-[71] grid h-14 w-14 place-items-center rounded-full bg-[#7c1e32] text-white shadow-[0_10px_26px_rgba(111,16,45,.34)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#991b3f] hover:shadow-[0_14px_32px_rgba(111,16,45,.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#6f102d] sm:h-15 sm:w-15 ${side}`}><Sparkles className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" /><span className={`pointer-events-none absolute ${ar ? 'left-full ms-3' : 'right-full me-3'} whitespace-nowrap rounded bg-[#292a2c] px-2.5 py-1.5 text-xs font-bold opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100`}>ARZANA AI</span></button>
  </>;
}
