import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useArzanaAssistant } from '../components/ArzanaAssistant';

/** Keeps existing bookmarks working without retaining a second chatbot UI. */
export default function ArzanaAi() {
  const { openAssistant } = useArzanaAssistant();
  const [, setLocation] = useLocation();
  useEffect(() => { openAssistant(); setLocation('/', { replace: true }); }, [openAssistant, setLocation]);
  return null;
}
