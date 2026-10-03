/**
 * JarvisTerminal — Console flutuante do JARVIS no PGT-UI
 * Envia mensagens para POST /api/chat e exibe as respostas.
 * JARVIS tem autonomia total: pode editar roadmap.md, mudar status,
 * adicionar bosses, deletar tarefas — tudo por linguagem natural.
 */
import { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Minimize2, Maximize2, Loader2, Bot, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'jarvis' | 'system';
  content: string;
  timestamp: Date;
}

interface JarvisTerminalProps {
  isolationActive?: boolean;
  onClose?: () => void;
  className?: string;
}

const BOOT_MESSAGES: Message[] = [
  {
    id: 'boot-1',
    role: 'system',
    content: '⚡ JARVIS ONLINE — Sistema SKYROS conectado.',
    timestamp: new Date(),
  },
  {
    id: 'boot-2',
    role: 'jarvis',
    content: 'Pronto para servir, Sr. Lima. Tenho acesso total ao seu roadmap.md e STATUS.md.\n\nPosso adicionar, completar, mover ou deletar qualquer tarefa. Basta falar.\n\n_Exemplos:_\n• "Adiciona uma nova missão P0 no sprint: finalizar landing page da Experia"\n• "Marca a tarefa 2 como concluída"\n• "Ativa o modo de guerra (isolation mode)"\n• "Qual é o estado atual do meu sistema?"',
    timestamp: new Date(),
  },
];

export function JarvisTerminal({ isolationActive, onClose, className }: JarvisTerminalProps) {
  const [messages, setMessages] = useState<Message[]>(BOOT_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      const jarvisMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'jarvis',
        content: res.ok ? (data.reply || 'Ação executada.') : `Erro: ${data.error || 'Falha na comunicação.'}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, jarvisMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'system',
          content: '⚠️ Backend offline. Inicie o servidor: `node scripts/dashboard.js`',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={cn(
        'glass-card-purple flex flex-col transition-all duration-300 animate-fade-in',
        minimized ? 'h-14' : 'h-[520px]',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neon-purple/20 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot className="w-5 h-5 text-neon-purple" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          </div>
          <span className="font-hud text-sm text-neon-purple tracking-widest uppercase">
            JARVIS
          </span>
          {isolationActive && (
            <span className="text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
              🔴 ISOLATION
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(p => !p)}
            className="icon-btn w-7 h-7 text-muted-foreground hover:text-neon-purple"
          >
            {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          {onClose && (
            <button onClick={onClose} className="icon-btn w-7 h-7 text-muted-foreground hover:text-red-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-2 animate-fade-in',
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                  msg.role === 'jarvis' && 'bg-neon-purple/20 border border-neon-purple/30',
                  msg.role === 'user' && 'bg-primary/20 border border-primary/30',
                  msg.role === 'system' && 'bg-muted/30 border border-border'
                )}>
                  {msg.role === 'jarvis' && <Bot className="w-3.5 h-3.5 text-neon-purple" />}
                  {msg.role === 'user' && <User className="w-3.5 h-3.5 text-primary" />}
                  {msg.role === 'system' && <Terminal className="w-3.5 h-3.5 text-muted-foreground" />}
                </div>

                <div className={cn(
                  'max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed',
                  msg.role === 'jarvis' && 'bg-neon-purple/10 border border-neon-purple/20 text-foreground',
                  msg.role === 'user' && 'bg-primary/10 border border-primary/20 text-foreground',
                  msg.role === 'system' && 'bg-muted/30 border border-border text-muted-foreground font-mono text-xs'
                )}>
                  {msg.content.split('\n').map((line, i) => {
                    const isItalic = line.startsWith('_') && line.endsWith('_');
                    const isBullet = line.startsWith('•');
                    return (
                      <span key={i} className={cn('block', isItalic && 'italic text-muted-foreground', isBullet && 'ml-2')}>
                        {isItalic ? line.slice(1, -1) : line}
                      </span>
                    );
                  })}
                  <div className={cn('text-[9px] mt-1 opacity-40 font-mono', msg.role === 'user' ? 'text-right' : 'text-left')}>
                    {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-start animate-fade-in">
                <div className="w-7 h-7 rounded-full bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-neon-purple" />
                </div>
                <div className="bg-neon-purple/10 border border-neon-purple/20 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2 text-xs text-neon-purple font-mono">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Processando ação...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex-shrink-0 border-t border-neon-purple/20 p-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isolationActive ? '🔴 Isolation Mode — foco no P0...' : 'Comande JARVIS...'}
                  className="cyber-input text-sm py-2 pr-10"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <Terminal className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className={cn(
                  'w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-200 flex-shrink-0',
                  input.trim() && !isLoading
                    ? 'bg-neon-purple/20 border-neon-purple/50 text-neon-purple hover:bg-neon-purple/30'
                    : 'border-border text-muted-foreground/30 cursor-not-allowed'
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[9px] text-muted-foreground/30 font-mono mt-1.5 text-center">
              AUTONOMIA TOTAL · roadmap.md · STATUS.md
            </div>
          </div>
        </>
      )}
    </div>
  );
}
