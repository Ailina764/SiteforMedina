'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { asset } from '@/lib/asset'
import { startGlow } from '@/lib/glow'
import { LANGS, TEXTS, type Lang, type Texts } from '@/lib/i18n'
import { ArrowRight, ArrowUpRight, Heart, Lock, Maximize, Menu, MessageCircle, Music2, Pause, Play, Send, Share2, Volume2, VolumeX, X } from 'lucide-react'

const MEDINA_WHATSAPP = '77021366520'
const IDEA_LIMIT = 500
const LANG_KEY = 'medina-site-lang'

// Оформление карточек программы. Тексты карточек — в lib/i18n.ts.
const programCards = [
  { id: 'study', tone: 'blue', icon: '/program/book.png' },
  { id: 'events', tone: 'violet', icon: '/program/calendar.png' },
  { id: 'sport', tone: 'cyan', icon: '/program/ball.png' },
  { id: 'dialog', tone: 'amber', icon: '/program/people.png' },
]

// Галерея «Vote for me». Когда видео готово: положи файл в public/videos/
// и впиши путь в src, например src: '/videos/01.mp4'. Обложка (poster) — по желанию.
// Названия и хештеги видео — в lib/i18n.ts.
// Главное (горизонтальное) видео галереи. Тексты — в lib/i18n.ts (gallery.featured).
const FEATURED_VIDEO = { src: '/videos/vote-for-medina.mp4', poster: '/videos/vote-for-medina.jpg' }

const galleryVideos = [
  { id: '01', src: '', poster: '' },
  { id: '02', src: '', poster: '' },
  { id: '03', src: '', poster: '' },
  { id: '04', src: '', poster: '' },
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

function ideaLink(text: string, heading: string) {
  const message = `${heading}\n\n${text.trim()}`
  return `https://wa.me/${MEDINA_WHATSAPP}?text=${encodeURIComponent(message)}`
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

// Горизонтальный плеер со своими кнопками (вместо стандартных браузерных).
function FeaturedPlayer({ src, poster, title, labels }: { src: string; poster: string; title: string; labels: Texts['gallery']['player'] }) {
  const box = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const hideTimer = useRef<number>(0)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [ui, setUi] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    // метаданные ролика могли загрузиться раньше, чем подключились обработчики
    const el = video.current
    if (el && el.readyState >= 1 && Number.isFinite(el.duration)) setDuration(el.duration)
    return () => window.clearTimeout(hideTimer.current)
  }, [])

  function poke() {
    setUi(true)
    window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setUi(false), 2600)
  }
  function toggle() {
    const el = video.current
    if (!el) return
    if (el.paused) void el.play().catch(() => {})
    else el.pause()
  }
  function toggleMute() {
    const el = video.current
    if (!el) return
    el.muted = !el.muted
    setMuted(el.muted)
  }
  function seek(value: number) {
    const el = video.current
    if (!el) return
    el.currentTime = value
    setCurrent(value)
  }
  function fullscreen() {
    const wrapper = box.current
    const el = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (!wrapper || !el) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else if (wrapper.requestFullscreen) void wrapper.requestFullscreen().catch(() => {})
    else el.webkitEnterFullscreen?.()
  }

  const percent = duration ? (current / duration) * 100 : 0
  const cls = ['player', started && 'is-started', playing && 'is-playing', (ui || !playing) && 'is-ui'].filter(Boolean).join(' ')
  return (
    <div className="feature-frame">
      <div ref={box} className={cls} onPointerMove={poke} onPointerDown={poke} onFocus={poke}>
        <video
          ref={video}
          src={asset(src)}
          preload="metadata"
          playsInline
          aria-label={title}
          onClick={toggle}
          onPlay={() => { setPlaying(true); setStarted(true); poke() }}
          onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); setStarted(false) }}
          onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        />
        <div className="player-cover" aria-hidden="true"><img src={asset(poster)} alt="" /></div>
        <button type="button" className="player-big" onClick={toggle} aria-label={labels.play}><Play /></button>
        <div className="player-bar">
          <button type="button" className="player-btn" onClick={toggle} aria-label={playing ? labels.pause : labels.play}>{playing ? <Pause /> : <Play />}</button>
          <span className="player-time">{formatTime(current)} / {formatTime(duration)}</span>
          <input
            type="range"
            className="player-seek"
            min={0}
            max={duration || 0}
            step={0.1}
            value={current}
            aria-label={labels.seek}
            onChange={(event) => seek(Number(event.target.value))}
            style={{ '--p': `${percent}%` } as React.CSSProperties}
          />
          <button type="button" className="player-btn" onClick={toggleMute} aria-label={muted ? labels.unmute : labels.mute}>{muted ? <VolumeX /> : <Volume2 />}</button>
          <button type="button" className="player-btn" onClick={fullscreen} aria-label={labels.fullscreen}><Maximize /></button>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [idea, setIdea] = useState('')
  const [ideaStatus, setIdeaStatus] = useState<'idle' | 'empty' | 'sent'>('idle')
  const ideaField = useRef<HTMLTextAreaElement>(null)
  const [openCard, setOpenCard] = useState<string | null>(null)
  const [lang, setLang] = useState<Lang>('ru')
  const t = TEXTS[lang]

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY)
      if (saved === 'ru' || saved === 'kk') setLang(saved)
    } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = TEXTS[lang].pageTitle
  }, [lang])

  function chooseLang(next: Lang) {
    setLang(next)
    try { localStorage.setItem(LANG_KEY, next) } catch {}
  }

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
        <a href="#top" className="brand" aria-label={t.brand}><img className="brand-logo" src={asset('/binom-logo.png')} alt="" /><span><b>BINOM</b><small>SCHOOL</small></span></a>
        <nav className="header-links" aria-label={t.nav.label}><a href="#top">{t.nav.home}</a><a href="#about">{t.nav.about}</a><a href="#poll">{t.nav.poll}</a><a href="#gallery">{t.nav.gallery}</a></nav>
        <div className="header-tools">
          <div className="lang-switch" role="group" aria-label={t.langSwitch}>
            {LANGS.map((option) => (
              <button key={option.id} type="button" lang={option.id} className={lang === option.id ? 'is-active' : undefined} aria-pressed={lang === option.id} title={option.name} onClick={() => chooseLang(option.id)}>{option.label}</button>
            ))}
          </div>
          <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? t.menu.close : t.menu.open}><span className="menu-circle">{menuOpen ? <X /> : <Menu />}</span></button>
        </div>
      </header>
      {menuOpen && <nav className="menu-panel" aria-label={t.menu.label}><a href="#about" onClick={() => setMenuOpen(false)}>{t.menu.about}</a><a href="#program" onClick={() => setMenuOpen(false)}>{t.menu.program}</a><a href="#poll" onClick={() => setMenuOpen(false)}>{t.menu.idea}</a><a href="#gallery" onClick={() => setMenuOpen(false)}>{t.menu.gallery}</a></nav>}

      <section className="hero" id="top">
        <GlowBlobs />
        <div className="hero-copy"><p className="eyebrow">{t.hero.eyebrow}</p><h1 className="hero-title">{t.hero.title}</h1><p className="hero-note">{t.hero.note}</p><a className="round-link" href="#program">{t.hero.cta} <span><ArrowUpRight /></span></a></div>
        <div className="hero-visual" aria-label={t.hero.photoLabel}><div className="portrait-orbit" /><img className="portrait portrait-default" src={asset('/medina.png')} alt={t.hero.photoAlt} /><img className="portrait portrait-hover" src={asset('/medina-sash.png')} alt={t.hero.photoSashAlt} /></div><div className="hero-footer"><span>01 / 04</span><a href="#about">{t.hero.scroll} <ArrowUpRight /></a></div><div className="hero-name">MEDINA</div>
      </section>

      <section className="biography" id="about"><GlowBlobs soft /><div className="about-heading"><span>{t.about.eyebrow}</span><i /></div><div className="biography-grid"><div className="photo-frame"><img src={asset('/medina-library.jpg')} alt={t.about.photoAlt} /><span className="crown-mark">⌁</span><span className="sparkle">✦</span></div><div className="biography-copy"><h1 className="display-title">{t.about.titleLine1}<br />{t.about.titleBefore}<em>{t.about.titleAccent}</em>{t.about.titleAfter}</h1><p>{t.about.p1}</p><p>{t.about.p2}</p><p className="biography-lead">{t.about.lead}</p><p>{t.about.p3}</p></div></div></section>

      <section className="program" id="program">
        <GlowBlobs soft />
        <div className="program-school" aria-hidden="true"><img src={asset('/program/school.jpg')} alt="" /></div>
        <div className="program-head">
          <p className="program-eyebrow">{t.program.eyebrow}</p>
          <h2 className="program-title">{t.program.title}<br /><span>{t.program.titleAccent}</span></h2>
          <p className="program-lead">{t.program.lead}</p>
        </div>
        <p className="program-note" aria-hidden="true">{t.program.note[0]}<br />{t.program.note[1]}<br />{t.program.note[2]} <span>♥</span><svg viewBox="0 0 160 40"><path d="M2 38C40 20 95 6 158 2" /></svg></p>
        <div className="program-cards">
          {programCards.map((card, index) => {
            const text = t.program.cards[index]
            return (
              <article key={card.id} className={`program-card tone-${card.tone}`} onClick={() => setOpenCard(card.id)}>
                <Sparkle className="program-card-ghost" />
                <span className="program-card-num">0{index + 1}</span>
                <img className="program-card-icon" src={asset(card.icon)} alt="" />
                <h3>{text.title}</h3>
                <p>{text.text}</p>
                <button type="button" className="program-card-go" onClick={(event) => { event.stopPropagation(); setOpenCard(card.id) }} aria-label={`${t.program.more}: ${text.title}`} aria-haspopup="dialog"><ArrowRight /></button>
              </article>
            )
          })}
        </div>
        {programCards.map((card, index) => {
          const text = t.program.cards[index]
          return (
            <div key={card.id} id={`modal-${card.id}`} className={`program-modal tone-${card.tone}`} hidden={openCard !== card.id} onClick={() => setOpenCard(null)}>
              <div className="program-modal-card" role="dialog" aria-modal="true" aria-labelledby={`modal-title-${card.id}`} onClick={(event) => event.stopPropagation()}>
                <button type="button" className="program-modal-close" onClick={() => setOpenCard(null)} aria-label={t.program.close}><X /></button>
                <img className="program-modal-icon" src={asset(card.icon)} alt="" />
                <span className="program-card-num">0{index + 1}</span>
                <h3 id={`modal-title-${card.id}`}>{text.title}</h3>
                <p className="program-modal-intro">{text.intro}</p>
                <ul>
                  {text.points.map(([name, detail]) => <li key={name}><Sparkle /><div><b>{name}</b><span>{detail}</span></div></li>)}
                </ul>
                <div className="program-modal-foot"><p>{t.program.modalQuestion}</p><button type="button" className="program-modal-cta" data-topic={text.title} onClick={() => pickTopic(text.title)}>{t.program.modalCta}<ArrowRight /></button></div>
              </div>
            </div>
          )
        })}
        <div className="idea-box" id="poll">
          <Sparkle className="idea-star idea-star-right" />
          <Sparkle className="idea-star idea-star-left" />
          <img className="idea-icon" src={asset('/program/chat.png')} alt="" />
          <div className="idea-heading"><p>{t.idea.eyebrow}</p><h3>{t.idea.title}</h3></div>
          <p className="idea-hint">{t.idea.hint1}<br />{t.idea.hint2}</p>
          <label className="idea-field" htmlFor="idea-text">
            <span className="visually-hidden">{t.idea.label}</span>
            <textarea id="idea-text" ref={ideaField} value={idea} maxLength={IDEA_LIMIT} placeholder={t.idea.placeholder} onChange={(event) => { setIdea(event.target.value); setIdeaStatus('idle') }} />
            <span className="idea-count">{idea.length}/{IDEA_LIMIT}</span>
          </label>
          <div className="idea-actions">
            <a className="idea-send" href={ideaLink(idea, t.idea.message)} target="_blank" rel="noopener noreferrer" onClick={sendIdea}><Send />{t.idea.send}</a>
            <p className={`idea-status is-${ideaStatus}`} role="status">{ideaStatus === 'empty' ? t.idea.empty : ideaStatus === 'sent' ? t.idea.sent : <><Lock />{t.idea.idle}</>}</p>
          </div>
        </div>
      </section>

      <section className="gallery" id="gallery">
        <GlowBlobs soft />
        <div className="gallery-marquee" aria-hidden="true"><div>{Array.from({ length: 2 }, (_, copy) => <span key={copy}>{t.gallery.marquee.map((phrase) => <Fragment key={phrase}>{phrase} <Sparkle /> </Fragment>)}</span>)}</div></div>
        <div className="gallery-inner">
          <div className="gallery-head">
            <div>
              <div className="about-heading"><span>{t.gallery.eyebrow}</span><i /></div>
              <h2 className="display-title gallery-title">Vote <em>for me.</em></h2>
            </div>
            <p className="gallery-lead">{t.gallery.lead}</p>
          </div>
          <div className="feature">
            <FeaturedPlayer src={FEATURED_VIDEO.src} poster={FEATURED_VIDEO.poster} title={t.gallery.featured.title} labels={t.gallery.player} />
            <div className="feature-info">
              <span className="feature-badge">{t.gallery.featured.badge}</span>
              <h3 className="display-title feature-title">{t.gallery.featured.title}</h3>
              <p className="feature-text">{t.gallery.featured.text}</p>
              <p className="feature-tags">{t.gallery.featured.tags}</p>
              <div className="feature-author"><img src={asset('/medina.png')} alt="" /><span>{t.gallery.author}<small>{t.gallery.sound}</small></span></div>
            </div>
          </div>
          <div className="gallery-shorts">
            <div className="about-heading"><span>{t.gallery.shorts}</span><i /></div>
          <div className="gallery-reel">
            {galleryVideos.map((video, index) => {
              const text = t.gallery.videos[index]
              return (
                <article key={video.id} className={`reel${video.src ? ' has-video' : ''}`}>
                  <div className="reel-screen">
                    {video.src ? (
                      <video src={asset(video.src)} poster={video.poster ? asset(video.poster) : undefined} controls playsInline preload="metadata" />
                    ) : (
                      <div className="reel-placeholder"><span className="reel-play"><Play /></span><p>{t.gallery.soon}</p></div>
                    )}
                    <span className="reel-badge">VOTE FOR ME · {video.id}</span>
                    <div className="reel-actions" aria-hidden="true"><span><Heart /></span><span><MessageCircle /></span><span><Share2 /></span></div>
                    <div className="reel-caption">
                      <p className="reel-author"><img src={asset('/medina.png')} alt="" />{t.gallery.author}</p>
                      <h3>{text.title}</h3>
                      <p className="reel-tags">{text.tags}</p>
                      <p className="reel-sound"><Music2 />{t.gallery.sound}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
          </div>
          <p className="gallery-note"><Sparkle />{t.gallery.note}</p>
        </div>
      </section>
    </main>
  )
}
