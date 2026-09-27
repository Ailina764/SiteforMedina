'use client'

import { useEffect, useRef, useState } from 'react'
import { asset } from '@/lib/asset'
import { startGlow } from '@/lib/glow'
import { ArrowRight, ArrowUpRight, Heart, Lock, Menu, MessageCircle, Music2, Play, Send, Share2, X } from 'lucide-react'

const biography = `Я развиваюсь в сфере лидерства и постоянно работаю над собой. Мечта стать президентом школы для меня — это осознанный шаг и желание сделать нашу школьную жизнь лучше.`

const MEDINA_WHATSAPP = '77021366520'
const IDEA_LIMIT = 500

const programCards = [
  {
    id: 'study', tone: 'blue', icon: '/program/book.png', title: 'Учёба и комфорт', text: 'Комфортные зоны отдыха и поддержка инициатив учеников.',
    intro: 'В школе мы проводим большую часть дня, поэтому здесь должно быть удобно и учиться, и отдыхать.',
    points: [
      ['Зоны отдыха', 'Уютные места в коридорах: пуфы, настольные игры и розетки, чтобы зарядить телефон на перемене.'],
      ['Помощь с учёбой', 'Клуб взаимопомощи: старшеклассники помогают младшим разобраться в трудных темах перед контрольными.'],
      ['Голос учеников', 'Опрос раз в четверть: вы сами выбираете, что в школе улучшить в первую очередь.'],
      ['Ваши проекты', 'Помогу с кружками и идеями учеников: найти кабинет, время и учителя-куратора.'],
    ],
  },
  {
    id: 'events', tone: 'violet', icon: '/program/calendar.png', title: 'Досуг и мероприятия', text: 'Яркие праздники, тематические дни и школьные традиции.',
    intro: 'Школьные будни станут ярче, если в каждой четверти будет событие, которого все ждут.',
    points: [
      ['Тематические дни', 'День национального костюма, день ретро, день любимого героя и другие дни, которые предложите вы.'],
      ['Праздники', 'Наурыз, Новый год, День учителя и 8 Марта с концертами, ярмарками и фотозонами.'],
      ['Новые традиции', 'Ежегодный конкурс талантов и большой школьный вечер, которые будут ждать каждый год.'],
      ['Музыка на переменах', 'Школьное радио с песнями по заявкам учеников.'],
    ],
  },
  {
    id: 'sport', tone: 'cyan', icon: '/program/ball.png', title: 'Спорт и активность', text: 'Межклассные турниры и спортивные ивенты для разных интересов.',
    intro: 'Спорт объединяет классы и помогает найти друзей не только среди одноклассников.',
    points: [
      ['Турниры между классами', 'Футбол, волейбол и баскетбол каждую четверть, с таблицей результатов для всей школы.'],
      ['Игры для ума', 'Турниры по шахматам и тогыз кумалак для тех, кто любит думать.'],
      ['День спорта', 'Эстафеты и весёлые старты, где в командах вместе и младшие, и старшие.'],
      ['Награды', 'Грамоты и призы лучшим командам, игрокам и самым громким болельщикам.'],
    ],
  },
  {
    id: 'dialog', tone: 'amber', icon: '/program/people.png', title: 'Связь с администрацией', text: 'Открытый диалог с учителями через школьный совет.',
    intro: 'Президент школы — это мост между учениками и администрацией. Каждый должен быть услышан.',
    points: [
      ['Школьный совет', 'Представитель от каждого класса и встречи раз в месяц, где обсуждаем ваши вопросы.'],
      ['Честные отчёты', 'После каждой встречи рассказываю, что решили и что уже получилось.'],
      ['Встречи с директором', 'Открытые встречи, где ученики могут задать вопрос напрямую.'],
      ['Всегда на связи', 'Любую проблему или идею можно написать мне через форму ниже.'],
    ],
  },
]

// Галерея «Vote for me». Когда видео готово: положи файл в public/videos/
// и впиши путь в src, например src: '/videos/01.mp4'. Обложка (poster) — по желанию.
const galleryVideos = [
  { id: '01', title: 'Знакомьтесь: это я', tags: '#голосуйзамедину #binomschool', src: '', poster: '' },
  { id: '02', title: 'Моя программа за минуту', tags: '#программа #школаживёт', src: '', poster: '' },
  { id: '03', title: 'Чего не хватает нашей школе?', tags: '#голоскаждого #опрос', src: '', poster: '' },
  { id: '04', title: 'Почему стоит выбрать меня', tags: '#voteforme #президентшколы', src: '', poster: '' },
]

function GlowBlobs({ soft = false }: { soft?: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => (host.current ? startGlow(host.current) : undefined), [])
  return <div ref={host} className={`glow${soft ? ' glow-soft' : ''}`} aria-hidden="true"><span className="glow-orange" /><span className="glow-blue" /></div>
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" fill="currentColor" />
    </svg>
  )
}

function ideaLink(text: string) {
  const message = `Идея для школы (с сайта кампании Медины):\n\n${text.trim()}`
  return `https://wa.me/${MEDINA_WHATSAPP}?text=${encodeURIComponent(message)}`
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [idea, setIdea] = useState('')
  const [ideaStatus, setIdeaStatus] = useState<'idle' | 'empty' | 'sent'>('idle')
  const ideaField = useRef<HTMLTextAreaElement>(null)
  const [openCard, setOpenCard] = useState<string | null>(null)

  useEffect(() => {
    if (!openCard) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpenCard(null) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    document.querySelector<HTMLButtonElement>(`#modal-${openCard} .program-modal-close`)?.focus()
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [openCard])

  function pickTopic(title: string) {
    setOpenCard(null)
    const prefix = `${title}: `
    setIdea((current) => (current.startsWith(prefix) ? current : (prefix + current).slice(0, IDEA_LIMIT)))
    setIdeaStatus('idle')
    document.getElementById('poll')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    window.setTimeout(() => ideaField.current?.focus(), 450)
  }

  function sendIdea(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!idea.trim()) {
      event.preventDefault()
      setIdeaStatus('empty')
      ideaField.current?.focus()
      return
    }
    setIdeaStatus('sent')
  }

  return (
    <main className="campaign-site">
      <header className="site-header">
        <a href="#top" className="brand" aria-label="BINOM School имени Кадыра Мырзы Али — на главную"><img className="brand-logo" src={asset('/binom-logo.png')} alt="" /><span><b>BINOM</b><small>SCHOOL</small></span></a>
        <nav className="header-links" aria-label="Разделы сайта"><a href="#top">Главная</a><a href="#about">Обо мне</a><a href="#poll">Опрос</a><a href="#gallery">Галерея</a></nav>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}><span className="menu-circle">{menuOpen ? <X /> : <Menu />}</span></button>
      </header>
      {menuOpen && <nav className="menu-panel" aria-label="Основная навигация"><a href="#about" onClick={() => setMenuOpen(false)}>Биография Медины</a><a href="#program" onClick={() => setMenuOpen(false)}>Программа</a><a href="#poll" onClick={() => setMenuOpen(false)}>Предложить идею</a><a href="#gallery" onClick={() => setMenuOpen(false)}>Галерея</a></nav>}

      <section className="hero" id="top">
        <GlowBlobs />
        <div className="hero-copy"><p className="eyebrow">ГОЛОС КАЖДОГО — БУДУЩЕЕ ВСЕХ.</p><h1 className="hero-title">Я создаю школу, где слышен каждый.</h1><p className="hero-note">Настоящий лидер не диктует правила, а умеет слушать и объединять людей. Моя цель — сделать так, чтобы наша школа ожила по-новому, превратив будни в время возможностей и взаимного уважения.</p><a className="round-link" href="#program">Узнать о программе <span><ArrowUpRight /></span></a></div>
        <div className="hero-visual" aria-label="Фотография Медины. Наведите курсор, чтобы увидеть фотографию с короной."><div className="portrait-orbit" /><img className="portrait portrait-default" src={asset('/medina.png')} alt="Медина" /><img className="portrait portrait-hover" src={asset('/medina-sash.png')} alt="Медина — президент школы" /></div><div className="hero-footer"><span>01 / 04</span><a href="#about">ЛИСТАЙ ВНИЗ <ArrowUpRight /></a></div><div className="hero-name">MEDINA</div>
      </section>

      <section className="biography" id="about"><GlowBlobs soft /><div className="about-heading"><span>ОБО МНЕ</span><i /></div><div className="biography-grid"><div className="photo-frame"><img src={asset('/medina-photo.jpg')} alt="Медина" /><span className="crown-mark">⌁</span><span className="sparkle">✦</span></div><div className="biography-copy"><h1 className="display-title">Лидерство начинается<br />с умения <em>слушать.</em></h1><p>{biography}</p><p>Моя главная позиция: настоящий лидер не диктует свои правила, а умеет слушать и объединять людей. Я хочу быть президентом, который ставит мнения и интересы учеников на первое место.</p><p className="biography-lead">Если я стану президентом — школа оживет по-новому!</p><p>Мы превратим школьные будни в время возможностей, ярких мероприятий и взаимного уважения. У каждого из вас появится реальная возможность влиять на то, что происходит вокруг. Голосуйте за перемены, где важен каждый!</p></div></div></section>

      <section className="program" id="program">
        <GlowBlobs soft />
        <div className="program-school" aria-hidden="true"><img src={asset('/program/school.jpg')} alt="" /></div>
        <div className="program-head">
          <p className="program-eyebrow">ПРОГРАММА</p>
          <h2 className="program-title">Мои идеи —<br /><span>для лучшей школы.</span></h2>
          <p className="program-lead">Я верю, что школа — это не только про учёбу, но и про комфорт, развитие, дружбу и возможности. Моя программа направлена на то, чтобы сделать нашу школьную жизнь ярче, удобнее и интереснее для каждого.</p>
        </div>
        <p className="program-note" aria-hidden="true">Вместе<br />мы можем<br />больше! <span>♥</span><svg viewBox="0 0 160 40"><path d="M2 38C40 20 95 6 158 2" /></svg></p>
        <div className="program-cards">
          {programCards.map((card, index) => (
            <article key={card.id} className={`program-card tone-${card.tone}`} onClick={() => setOpenCard(card.id)}>
              <Sparkle className="program-card-ghost" />
              <span className="program-card-num">0{index + 1}</span>
              <img className="program-card-icon" src={asset(card.icon)} alt="" />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <button type="button" className="program-card-go" onClick={(event) => { event.stopPropagation(); setOpenCard(card.id) }} aria-label={`Подробнее: ${card.title}`} aria-haspopup="dialog"><ArrowRight /></button>
            </article>
          ))}
        </div>
        {programCards.map((card, index) => (
          <div key={card.id} id={`modal-${card.id}`} className={`program-modal tone-${card.tone}`} hidden={openCard !== card.id} onClick={() => setOpenCard(null)}>
            <div className="program-modal-card" role="dialog" aria-modal="true" aria-labelledby={`modal-title-${card.id}`} onClick={(event) => event.stopPropagation()}>
              <button type="button" className="program-modal-close" onClick={() => setOpenCard(null)} aria-label="Закрыть"><X /></button>
              <img className="program-modal-icon" src={asset(card.icon)} alt="" />
              <span className="program-card-num">0{index + 1}</span>
              <h3 id={`modal-title-${card.id}`}>{card.title}</h3>
              <p className="program-modal-intro">{card.intro}</p>
              <ul>
                {card.points.map(([name, detail]) => <li key={name}><Sparkle /><div><b>{name}</b><span>{detail}</span></div></li>)}
              </ul>
              <div className="program-modal-foot"><p>Есть своя идея по этой теме?</p><button type="button" className="program-modal-cta" data-topic={card.title} onClick={() => pickTopic(card.title)}>Предложить идею<ArrowRight /></button></div>
            </div>
          </div>
        ))}
        <div className="idea-box" id="poll">
          <Sparkle className="idea-star idea-star-right" />
          <Sparkle className="idea-star idea-star-left" />
          <img className="idea-icon" src={asset('/program/chat.png')} alt="" />
          <div className="idea-heading"><p>ПРЕДЛОЖИ СВОЮ ИДЕЮ</p><h3>Твоя идея может изменить школу!</h3></div>
          <p className="idea-hint">Что, по твоему мнению, не хватает в нашей школе?<br />Напиши — я обязательно учту!</p>
          <label className="idea-field" htmlFor="idea-text">
            <span className="visually-hidden">Твоя идея</span>
            <textarea id="idea-text" ref={ideaField} value={idea} maxLength={IDEA_LIMIT} placeholder="Напиши свою идею..." onChange={(event) => { setIdea(event.target.value); setIdeaStatus('idle') }} />
            <span className="idea-count">{idea.length}/{IDEA_LIMIT}</span>
          </label>
          <div className="idea-actions">
            <a className="idea-send" href={ideaLink(idea)} target="_blank" rel="noopener noreferrer" onClick={sendIdea}><Send />Отправить</a>
            <p className={`idea-status is-${ideaStatus}`} role="status">{ideaStatus === 'empty' ? 'Сначала напиши идею' : ideaStatus === 'sent' ? 'Открылся WhatsApp — нажми там «Отправить»' : <><Lock />Уйдёт Медине в WhatsApp</>}</p>
          </div>
        </div>
      </section>

      <section className="gallery" id="gallery">
        <GlowBlobs soft />
        <div className="gallery-marquee" aria-hidden="true"><div>{Array.from({ length: 2 }, (_, copy) => <span key={copy}>VOTE FOR MEDINA <Sparkle /> ГОЛОС КАЖДОГО — БУДУЩЕЕ ВСЕХ <Sparkle /> VOTE FOR ME <Sparkle /> ШКОЛА, ГДЕ СЛЫШЕН КАЖДЫЙ <Sparkle /> </span>)}</div></div>
        <div className="gallery-inner">
          <div className="gallery-head">
            <div>
              <div className="about-heading"><span>ГАЛЕРЕЯ</span><i /></div>
              <h2 className="display-title gallery-title">Vote <em>for me.</em></h2>
            </div>
            <p className="gallery-lead">Короткие видео о том, кто я, что хочу изменить и почему ваш голос важен. Смотри, делись с друзьями и приходи голосовать.</p>
          </div>
          <div className="gallery-reel">
            {galleryVideos.map((video) => (
              <article key={video.id} className={`reel${video.src ? ' has-video' : ''}`}>
                <div className="reel-screen">
                  {video.src ? (
                    <video src={asset(video.src)} poster={video.poster ? asset(video.poster) : undefined} controls playsInline preload="metadata" />
                  ) : (
                    <div className="reel-placeholder"><span className="reel-play"><Play /></span><p>Скоро здесь</p></div>
                  )}
                  <span className="reel-badge">VOTE FOR ME · {video.id}</span>
                  <div className="reel-actions" aria-hidden="true"><span><Heart /></span><span><MessageCircle /></span><span><Share2 /></span></div>
                  <div className="reel-caption">
                    <p className="reel-author"><img src={asset('/medina.png')} alt="" />Медина</p>
                    <h3>{video.title}</h3>
                    <p className="reel-tags">{video.tags}</p>
                    <p className="reel-sound"><Music2 />Кампания Медины 2025—2026</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="gallery-note"><Sparkle />Новые видео появятся здесь совсем скоро</p>
        </div>
      </section>
    </main>
  )
}
