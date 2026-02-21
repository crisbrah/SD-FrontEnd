import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, ChevronDown } from 'lucide-react'

interface Message {
  id: number
  from: 'bot' | 'user'
  text: string
}

interface QA {
  patterns: string[]
  answer: string
}

const FAQ: QA[] = [
  {
    patterns: ['horario', 'culto', 'domingo', 'servicio', 'hora'],
    answer: 'Nuestros cultos dominicales son los **domingos a las 10:00 AM**. También tenemos reunión de oración los **miércoles a las 7:00 PM**. ¡Te esperamos con los brazos abiertos!',
  },
  {
    patterns: ['dirección', 'donde', 'ubicación', 'ubicacion', 'lugar', 'llegar'],
    answer: 'Puedes encontrarnos en nuestra sede principal. Escríbenos al WhatsApp para la dirección exacta o usa el botón verde en la página.',
  },
  {
    patterns: ['celula', 'célula', 'grupo', 'pequeño'],
    answer: 'Tenemos grupos de células semanales para **Damas, Varones, Jóvenes, Matrimonios** y más. ¡Únete al grupo que más se adapte a ti!',
  },
  {
    patterns: ['bautismo', 'bautizo', 'bautizar'],
    answer: 'El bautismo es un paso importante en tu fe. Hablamos contigo personalmente para prepararte. Contáctanos por WhatsApp para agendar una reunión.',
  },
  {
    patterns: ['miembro', 'unir', 'registrar', 'registro', 'pertenecer'],
    answer: 'Para ser miembro, puedes **registrarte en nuestra web**. Tu cuenta será aprobada por un administrador. También puedes venir un domingo y hablar con uno de nuestros pastores.',
  },
  {
    patterns: ['pastor', 'lider', 'líder', 'quien', 'quién'],
    answer: 'Nuestra iglesia está liderada por pastores comprometidos con la Palabra de Dios. ¡Ven a conocerlos en persona este domingo!',
  },
  {
    patterns: ['niño', 'ninos', 'niños', 'kids', 'infante'],
    answer: 'Tenemos un **ministerio de niños** durante el culto dominical. Los pequeños aprenden de Dios de forma divertida y segura.',
  },
  {
    patterns: ['joven', 'jovenes', 'jóvenes', 'juventud'],
    answer: 'Nuestro **ministerio de jóvenes** se reúne los viernes. ¡Un espacio para crecer en fe, amistad y propósito!',
  },
  {
    patterns: ['ofrenda', 'diezmo', 'donacion', 'donación', 'ofrendar'],
    answer: 'Puedes dar tus ofrendas y diezmos en efectivo, Yape o transferencia. Cada contribución ayuda a la obra de Dios.',
  },
  {
    patterns: ['hola', 'buenos', 'buenas', 'saludos', 'hi', 'hello'],
    answer: '¡Hola! Bienvenido a Sanidad Divina 🙏 ¿En qué puedo ayudarte hoy?',
  },
  {
    patterns: ['gracias', 'thanks'],
    answer: '¡A ti! Si tienes más preguntas, con gusto te ayudo. ¡Dios te bendiga!',
  },
  {
    patterns: ['orar', 'oración', 'oracion', 'necesito', 'ayuda'],
    answer: 'Estaremos felices de orar contigo. Escríbenos al WhatsApp o ven a nuestro servicio de oración los **miércoles a las 7 PM**.',
  },
]

function getAnswer(input: string): string {
  const normalized = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  for (const qa of FAQ) {
    if (qa.patterns.some(p => normalized.includes(p))) {
      return qa.answer
    }
  }
  return 'Gracias por tu mensaje. Para consultas específicas, te recomendamos contactarnos por **WhatsApp** usando el botón verde, o visitarnos este domingo. ¡Dios te bendiga!'
}

function renderText(text: string) {
  // Convert **bold** to <strong>
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  )
}

let msgId = 0

const INITIAL: Message[] = [
  { id: ++msgId, from: 'bot', text: '¡Hola! Soy el asistente de **Sanidad Divina** 🙏 ¿En qué puedo ayudarte? Puedes preguntarme sobre horarios, ministerios, bautismo y más.' },
]

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(INITIAL)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = () => {
    const text = input.trim()
    if (!text) return
    const userMsg: Message = { id: ++msgId, from: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const answer = getAnswer(text)
      setTyping(false)
      setMessages(prev => [...prev, { id: ++msgId, from: 'bot', text: answer }])
    }, 800)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Abrir chat"
        className="fixed bottom-24 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-primary-600 hover:bg-primary-700 text-white transition-all duration-200 hover:scale-110 active:scale-95"
      >
        {open ? <ChevronDown className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-40 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-primary-700 text-white">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">✝️</div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Sanidad Divina</p>
              <p className="text-xs text-primary-200">Asistente en línea</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72 bg-stone-50">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.from === 'user'
                    ? 'bg-primary-600 text-white rounded-br-sm'
                    : 'bg-white border border-stone-200 text-stone-800 rounded-bl-sm shadow-sm'
                }`}>
                  {renderText(m.text)}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 px-3 py-3 border-t border-stone-100 bg-white">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-stone-50"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
