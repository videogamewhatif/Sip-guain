'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { navigation } from '@/data/content';

export function Wordmark() {
  return <Link className="wordmark" href="/" aria-label="Sip Güain, inicio">
    <Image src="/images/logo-mark.webp" alt="" width={25} height={30} unoptimized /><span>Sip Güain</span>
  </Link>;
}

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  return <header className="header">
    <div className="header-row shell">
      <Wordmark />
      <button className="menu-toggle icon-button" ref={toggle} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-controls="primary-nav" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <nav id="primary-nav" aria-label="Navegación principal" className={open ? 'is-open' : ''} onKeyDown={event => {
        if (event.key === 'Escape' && open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}>
        {navigation.map(([url, label]) => {
          const active = path === url || (url !== '/' && path.startsWith(url + '/'));
          return <Link key={url} href={url} data-active={active} aria-current={path === url ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>;
        })}
      </nav>
    </div>
  </header>;
}

export function AgeGate() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('sip-age') === 'confirmed') return;
    } catch { /* Confirmation is still available without storage. */ }
    dialog.current?.showModal();
  }, []);

  return <dialog ref={dialog} className="age-gate" aria-labelledby="age-title" aria-describedby="age-description" onCancel={event => event.preventDefault()}>
    <p className="eyebrow">Acceso al sitio</p>
    <h2 id="age-title" tabIndex={-1} autoFocus>¿Tienes 18 años o más?</h2>
    <p id="age-description">Sip Güain es una marca de vino. Disfruta con moderación.</p>
    {denied && <p role="status" className="age-denied">El acceso está reservado a personas mayores de edad.</p>}
    <div className="age-actions">
      <button className="button" onClick={() => {
        try { sessionStorage.setItem('sip-age', 'confirmed'); } catch { /* Storage may be disabled. */ }
        dialog.current?.close();
      }}>Sí, tengo 18 o más</button>
      <button className="button outline" onClick={() => setDenied(true)}>No</button>
    </div>
  </dialog>;
}
