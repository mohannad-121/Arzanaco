import { useState } from 'react';
import { Link } from 'wouter';
import { Bot, ExternalLink, RotateCcw, Send, UserRound } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { useLanguage } from '../contexts/LanguageContext';

type Action = { label: string; url: string; type: 'link' };
type Message = { role: 'user' | 'assistant'; content: string; actions?: Action[] };
const englishQuestions = ['What products does Arzana provide?', 'Tell me about your testing and commissioning services.', 'Show me your safety systems.', 'How can I request a quote?', 'What is your WhatsApp number?', 'Where is Arzana located?'];
const arabicQuestions = ['ما هي منتجات أرزانا؟', 'أخبرني عن خدمات الاختبار والتشغيل.', 'اعرض أنظمة السلامة.', 'كيف أطلب عرض سعر؟', 'ما رقم واتساب الشركة؟', 'أين يقع مقر الشركة؟'];

export default function ArzanaAi() {
  const { language } = useLanguage();
  const initialMessage: Message = { role: 'assistant', content: language === 'ar' ? 'مرحبًا بك في بوت أرزانا. يمكنني مساعدتك في استكشاف منتجات أرزانا العربية وخدماتها وأنظمة السلامة وخدمات الاختبار والتشغيل والعملاء وطرق التواصل وطلب عرض السعر.' : 'Welcome to Arzana Bot. I can help you explore Arzana Arabia’s products, services, safety solutions, testing capabilities, clients, contact information, and quotation process.' };
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const copy = language === 'ar' ? { title: 'بوت أرزانا', subtitle: 'إجابات مستندة إلى معلومات أرزانا العامة والمتحقق منها.', placeholder: 'اكتب سؤالك عن أرزانا...', send: 'إرسال', clear: 'بدء محادثة جديدة', suggested: 'أسئلة مقترحة', unavailable: 'بوت أرزانا غير متاح مؤقتاً. يرجى التواصل مع أرزانا عبر واتساب أو البريد الإلكتروني.' } : { title: 'ARZANA BOT', subtitle: 'Answers grounded in Arzana’s verified public company information.', placeholder: 'Ask a question about Arzana...', send: 'Send', clear: 'Start a new conversation', suggested: 'Suggested questions', unavailable: 'Arzana Bot is temporarily unavailable. Please contact Arzana through WhatsApp or email.' };
  const questions = language === 'ar' ? arabicQuestions : englishQuestions;

  const sendMessage = async (value = input) => {
    const content = value.trim();
    if (!content || isLoading) return;
    const nextMessages = [...messages, { role: 'user' as const, content }];
    setMessages(nextMessages); setInput(''); setError(''); setIsLoading(true);
    try {
      const response = await fetch('/api/arzana-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: content, language }) });
      const payload = await response.json() as { message?: string; actions?: Action[] };
      if (!response.ok || typeof payload.message !== 'string') throw new Error(payload.message || copy.unavailable);
      const responseMessage: string = payload.message;
      setMessages((current) => [...current, { role: 'assistant', content: responseMessage, actions: Array.isArray(payload.actions) ? payload.actions : [] }]);
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : copy.unavailable); }
    finally { setIsLoading(false); }
  };
  const clear = () => { setMessages([{ ...initialMessage }]); setInput(''); setError(''); };
  return <PageWrapper>
    <section className="bg-[#d8d4cb] py-14 md:py-20"><div className="site-container max-w-5xl"><div className="mb-8 grid gap-5 md:grid-cols-[1fr_auto] md:items-end"><div><p className="eyebrow mb-4">Verified company assistant</p><h1 className="section-title">{copy.title}</h1><p className="section-copy mt-5">{copy.subtitle}</p></div><Button variant="outline" onClick={clear}><RotateCcw className="me-2 h-4 w-4" />{copy.clear}</Button></div>
      <section className="overflow-hidden border border-[#3b3c3e] bg-[#292a2c] shadow-[0_20px_50px_rgba(39,40,42,.16)]" aria-label={copy.title}><div className="border-b border-white/12 p-6 md:p-8"><div className="flex items-center gap-4"><div className="grid h-12 w-12 place-items-center bg-primary text-white"><Bot className="h-6 w-6" /></div><div><h2 className="font-bold text-white">{copy.title}</h2><p className="text-sm text-white/65">{language === 'ar' ? 'المعرفة العامة المتحقق منها فقط' : 'Verified public knowledge only'}</p></div></div></div>
        <div className="min-h-[25rem] space-y-5 bg-[linear-gradient(135deg,rgba(255,255,255,.035),transparent)] p-5 md:p-8" aria-live="polite">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`grid h-9 w-9 shrink-0 place-items-center ${message.role === 'user' ? 'order-2 bg-[#7c1e32]' : 'bg-[#55585a]'} text-white`}>{message.role === 'user' ? <UserRound className="h-4 w-4" /> : <Bot className="h-4 w-4" />}</div><div className={`max-w-[85%] whitespace-pre-line px-4 py-3 text-sm leading-7 md:text-base ${message.role === 'user' ? 'order-1 bg-primary text-white' : 'bg-[#f6f3ee] text-foreground'}`}><p>{message.content}</p>{message.actions && message.actions.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{message.actions.map((action) => action.url.startsWith('/') ? <Link key={action.url} href={action.url} className="inline-flex items-center gap-1.5 bg-[#292a2c] px-3 py-2 text-xs font-bold text-white hover:bg-primary">{action.label}<ExternalLink className="h-3.5 w-3.5" /></Link> : <a key={action.url} href={action.url} target={action.url.startsWith('http') ? '_blank' : undefined} rel={action.url.startsWith('http') ? 'noopener noreferrer' : undefined} className="inline-flex items-center gap-1.5 bg-[#292a2c] px-3 py-2 text-xs font-bold text-white hover:bg-primary">{action.label}<ExternalLink className="h-3.5 w-3.5" /></a>)}</div>}</div></div>)}{isLoading && <div className="flex gap-3"><div className="grid h-9 w-9 place-items-center bg-[#55585a] text-white"><Bot className="h-4 w-4" /></div><div className="bg-[#f6f3ee] px-4 py-3 text-sm text-foreground/70">{language === 'ar' ? 'جارٍ التحقق من معلومات أرزانا…' : 'Checking Arzana’s verified information…'}</div></div>}{error && <p role="alert" className="bg-[#7c1e32] p-4 text-sm leading-6 text-white">{error}</p>}</div>
        <form className="border-t border-white/12 bg-[#242527] p-4 md:p-6" onSubmit={(event) => { event.preventDefault(); void sendMessage(); }}><label className="sr-only" htmlFor="arzana-ai-message">{copy.placeholder}</label><div className="flex gap-3"><Textarea id="arzana-ai-message" value={input} onChange={(event) => setInput(event.target.value)} placeholder={copy.placeholder} maxLength={900} className="min-h-12 resize-none border-white/20 bg-white text-foreground" rows={2} /><Button type="submit" disabled={isLoading || !input.trim()} className="min-h-12 self-end"><span className="hidden sm:inline">{copy.send}</span><Send className="h-4 w-4 sm:ms-2" /></Button></div></form>
      </section>
      <section className="mt-8"><h2 className="mb-4 text-sm font-bold uppercase tracking-[.14em] text-foreground/70">{copy.suggested}</h2><div className="flex flex-wrap gap-3">{questions.map((question) => <button key={question} type="button" onClick={() => void sendMessage(question)} className="border border-foreground/18 bg-[#f6f3ee] px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary">{question}</button>)}</div></section>
    </div></section>
  </PageWrapper>;
}
