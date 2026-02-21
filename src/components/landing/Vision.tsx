export default function Vision() {
  const pillars = [
    {
      emoji: '✝',
      title: 'Fe',
      text: 'Creemos en la Biblia como la Palabra viva de Dios. Nuestra fe en Jesucristo es el fundamento de todo lo que somos y hacemos como iglesia.',
    },
    {
      emoji: '🤝',
      title: 'Comunidad',
      text: 'Somos una familia donde cada persona es bienvenida. Nos amamos, nos apoyamos y crecemos juntos en el conocimiento de Dios.',
    },
    {
      emoji: '🕊️',
      title: 'Servicio',
      text: 'Servir a nuestro prójimo es una expresión de amor a Dios. Salimos a las calles, escuelas y hogares llevando esperanza y sanidad divina.',
    },
  ]

  return (
    <section id="vision" className="py-24 bg-amber-50/60 relative overflow-hidden">
      {/* Subtle cross bg */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
        <svg viewBox="0 0 100 120" className="w-[50vw] max-w-2xl fill-amber-900">
          <rect x="42" y="0" width="16" height="120" />
          <rect x="0" y="35" width="100" height="16" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-gold-600 text-sm font-semibold uppercase tracking-widest">Nuestra identidad</span>
          <h2 className="mt-3 text-4xl font-bold text-slate-900 font-display">
            Misión & Visión
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Somos una iglesia que cree en el poder transformador del Evangelio. Nuestra misión es
            hacer discípulos que impacten cada esfera de la sociedad para la gloria de Dios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map(({ emoji, title, text }) => (
            <div
              key={title}
              className="bg-white rounded-3xl p-8 shadow-sm border border-amber-100 hover:shadow-md transition-shadow group"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-3xl mb-6 group-hover:scale-105 transition-transform">
                {emoji}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
              <p className="text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-16 text-center">
          <blockquote className="text-2xl font-display italic text-slate-700 max-w-3xl mx-auto">
            "Porque yo sé los planes que tengo para vosotros, planes de bienestar y no de calamidad,
            para daros un futuro y una esperanza."
          </blockquote>
          <cite className="block mt-4 text-gold-600 font-semibold">— Jeremías 29:11</cite>
        </div>
      </div>
    </section>
  )
}
