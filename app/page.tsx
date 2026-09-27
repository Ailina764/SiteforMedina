'use client'

import { useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, Lock, Menu, Send, X } from 'lucide-react'

const biography = `Я развиваюсь в сфере лидерства и постоянно работаю над собой. Мечта стать президентом школы для меня — это осознанный шаг и желание сделать нашу школьную жизнь лучше.`

const MEDINA_WHATSAPP = '77021366520'
const IDEA_LIMIT = 500

const programCards = [
  { id: 'study', tone: 'blue', icon: '/program/book.png', title: 'Учёба и комфорт', text: 'Комфортные зоны отдыха и поддержка инициатив учеников.' },
  { id: 'events', tone: 'violet', icon: '/program/calendar.png', title: 'Досуг и мероприятия', text: 'Яркие праздники, тематические дни и школьные традиции.' },
  { id: 'sport', tone: 'cyan', icon: '/program/ball.png', title: 'Спорт и активность', text: 'Межклассные турниры и спортивные ивенты для разных интересов.' },
  { id: 'dialog', tone: 'amber', icon: '/program/people.png', title: 'Связь с администрацией', text: 'Открытый диалог с учителями через школьный совет.' },
]

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

  function pickTopic(title: string) {
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
        <a href="#top" className="brand" aria-label="BINOM School"><span className="brand-mark">B</span><span><b>BINOM</b><small>SCHOOL</small></span></a>
        <nav className="header-links" aria-label="Разделы сайта"><a href="#top">Главная</a><a href="#about">Обо мне</a><a href="#poll">Опрос</a><a href="#contacts">Контакты</a></nav>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}><span className="menu-circle">{menuOpen ? <X /> : <Menu />}</span></button>
      </header>
      {menuOpen && <nav className="menu-panel" aria-label="Основная навигация"><a href="#about" onClick={() => setMenuOpen(false)}>Биография Медины</a><a href="#program" onClick={() => setMenuOpen(false)}>Программа</a><a href="#poll" onClick={() => setMenuOpen(false)}>Предложить идею</a></nav>}

      <section className="hero" id="top">
        <div className="hero-copy"><p className="eyebrow">ГОЛОС КАЖДОГО — БУДУЩЕЕ ВСЕХ.</p><h1 className="hero-title">Я создаю школу, где слышен каждый.</h1><p className="hero-note">Настоящий лидер не диктует правила, а умеет слушать и объединять людей. Моя цель — сделать так, чтобы наша школа ожила по-новому, превратив будни в время возможностей и взаимного уважения.</p><a className="round-link" href="#program">Узнать о программе <span><ArrowUpRight /></span></a></div>
        <div className="hero-visual" aria-label="Фотография Медины. Наведите курсор, чтобы увидеть фотографию с короной."><div className="portrait-orbit" /><img className="portrait portrait-default" src="/medina.png" alt="Медина" /><img className="portrait portrait-hover" src="/medina-sash.png" alt="Медина — президент школы" /></div><div className="hero-footer"><span>01 / 04</span><a href="#about">ЛИСТАЙ ВНИЗ <ArrowUpRight /></a></div><div className="hero-name">MEDINA</div>
      </section>

      <section className="biography" id="about"><div className="about-heading"><span>ОБО МНЕ</span><i /></div><div className="biography-grid"><div className="photo-frame"><img src="/medina-photo.jpg" alt="Медина" /><span className="crown-mark">⌁</span><span className="sparkle">✦</span></div><div className="biography-copy"><h1 className="display-title">Лидерство начинается<br />с умения <em>слушать.</em></h1><p>{biography}</p><p>Моя главная позиция: настоящий лидер не диктует свои правила, а умеет слушать и объединять людей. Я хочу быть президентом, который ставит мнения и интересы учеников на первое место.</p><p className="biography-lead">Если я стану президентом — школа оживет по-новому!</p><p>Мы превратим школьные будни в время возможностей, ярких мероприятий и взаимного уважения. У каждого из вас появится реальная возможность влиять на то, что происходит вокруг. Голосуйте за перемены, где важен каждый!</p></div></div></section>

      <section className="program" id="program">
        <div className="program-school" aria-hidden="true"><img src="/program/school.jpg" alt="" /></div>
        <div className="program-head">
          <p className="program-eyebrow">ПРОГРАММА</p>
          <h2 className="program-title">Мои идеи —<br /><span>для лучшей школы.</span></h2>
          <p className="program-lead">Я верю, что школа — это не только про учёбу, но и про комфорт, развитие, дружбу и возможности. Моя программа направлена на то, чтобы сделать нашу школьную жизнь ярче, удобнее и интереснее для каждого.</p>
        </div>
        <p className="program-note" aria-hidden="true">Вместе<br />мы можем<br />больше! <span>♥</span><svg viewBox="0 0 160 40"><path d="M2 38C40 20 95 6 158 2" /></svg></p>
        <div className="program-cards">
          {programCards.map((card, index) => (
            <article key={card.id} className={`program-card tone-${card.tone}`}>
              <Sparkle className="program-card-ghost" />
              <span className="program-card-num">0{index + 1}</span>
              <img className="program-card-icon" src={card.icon} alt="" />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <button type="button" className="program-card-go" onClick={() => pickTopic(card.title)} aria-label={`Предложить идею: ${card.title}`}><ArrowRight /></button>
            </article>
          ))}
        </div>
        <div className="idea-box" id="poll">
          <Sparkle className="idea-star idea-star-right" />
          <Sparkle className="idea-star idea-star-left" />
          <img className="idea-icon" src="/program/chat.png" alt="" />
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
    </main>
  )
}
