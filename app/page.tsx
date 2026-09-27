'use client'

import { useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const biography = `Я развиваюсь в сфере лидерства и постоянно работаю над собой. Мечта стать президентом школы для меня — это осознанный шаг и желание сделать нашу школьную жизнь лучше.`

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main className="campaign-site">
      <header className="site-header">
        <a href="#top" className="brand" aria-label="BINOM School"><span className="brand-mark">B</span><span><b>BINOM</b><small>SCHOOL</small></span></a>
        <p className="campaign-label">КАМПАНИЯ МЕДИНЫ<br />2025—2026</p>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}><span className="menu-circle">{menuOpen ? <X /> : <Menu />}</span></button>
      </header>
      {menuOpen && <nav className="menu-panel" aria-label="Основная навигация"><a href="#about" onClick={() => setMenuOpen(false)}>Биография Медины</a><a href="#program" onClick={() => setMenuOpen(false)}>Программа</a><a href="#poll" onClick={() => setMenuOpen(false)}>Предложить идею</a></nav>}

      <section className="hero" id="top">
        <div className="hero-copy"><p className="eyebrow">ГОЛОС КАЖДОГО — БУДУЩЕЕ ВСЕХ.</p><h1 className="hero-title">Я создаю школу, где слышен каждый.</h1><p className="hero-note">Настоящий лидер не диктует правила, а умеет слушать и объединять людей. Моя цель — сделать так, чтобы наша школа ожила по-новому, превратив будни в время возможностей и взаимного уважения.</p><a className="round-link" href="#program">Узнать о программе <span><ArrowUpRight /></span></a></div>
        <div className="hero-visual" aria-label="Фотография Медины. Наведите курсор, чтобы увидеть фотографию с короной."><div className="portrait-orbit" /><img className="portrait portrait-default" src="/medina.png" alt="Медина" /><img className="portrait portrait-hover" src="/medina-sash.png" alt="Медина — президент школы" /><div className="portrait-caption">ПРЕЗИДЕНТ ШКОЛЫ</div></div><div className="hero-footer"><span>01 / 04</span><a href="#about">ЛИСТАЙ ВНИЗ <ArrowUpRight /></a></div><div className="hero-name">MEDINA</div>
      </section>

      <section className="biography" id="about"><div className="about-heading"><span>ОБО МНЕ</span><i /></div><div className="biography-grid"><div className="photo-frame"><img src="/medina.png" alt="Медина" /><span className="crown-mark">⌁</span><span className="sparkle">✦</span></div><div className="biography-copy"><h1 className="display-title">Лидерство начинается<br />с умения <em>слушать.</em></h1><p>{biography}</p><p>Моя главная позиция: настоящий лидер не диктует свои правила, а умеет слушать и объединять людей. Я хочу быть президентом, который ставит мнения и интересы учеников на первое место.</p><p className="biography-lead">Если я стану президентом — школа оживет по-новому!</p><p>Мы превратим школьные будни в время возможностей, ярких мероприятий и взаимного уважения. У каждого из вас появится реальная возможность влиять на то, что происходит вокруг. Голосуйте за перемены, где важен каждый!</p></div></div></section>


    </main>
  )
}
