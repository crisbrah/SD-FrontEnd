export default function MinisteriosPreview() {
  const ministerios = [
    { emoji: '👩', title: 'Ministerio de Damas', desc: 'Mujeres creciendo en la Palabra, apoyándose mutuamente en oración y servicio.' },
    { emoji: '💑', title: 'Matrimonios', desc: 'Edificando hogares sobre el fundamento de Cristo con talleres y retiros.' },
    { emoji: '⚡', title: 'Jóvenes', desc: 'Una generación apasionada por Dios, impactando su ciudad con fe y creatividad.' },
    { emoji: '🌱', title: 'Adolescentes', desc: 'Guiando a los adolescentes a descubrir su propósito en el reino de Dios.' },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary-600 text-sm font-semibold uppercase tracking-widest">Nuestros grupos</span>
          <h2 className="mt-3 text-4xl font-bold text-slate-900 font-display">Ministerios</h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            Hay un lugar para ti. Cada ministerio es un espacio donde puedes crecer, servir y conectar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ministerios.map(({ emoji, title, desc }) => (
            <div
              key={title}
              className="group relative bg-slate-50 hover:bg-primary-600 rounded-3xl p-6 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="text-4xl mb-4">{emoji}</div>
              <h3 className="font-bold text-slate-900 group-hover:text-white mb-2 transition-colors">{title}</h3>
              <p className="text-slate-500 group-hover:text-primary-100 text-sm leading-relaxed transition-colors">{desc}</p>
              <div className="absolute bottom-4 right-4 text-slate-200 group-hover:text-primary-400 transition-colors">
                <span className="text-2xl">✝</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
