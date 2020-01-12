import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderSideNavItems,
  SkipToContent,
  SideNav,
  SideNavItems
} from 'carbon-components-react/lib/components/UIShell'

import styles from './nav.module.css'

export default function Navbar() {
  const [isSideNavExpanded, setSideNavExpanded] = useState(false)

  function updateMenuState() {
    setSideNavExpanded(!isSideNavExpanded)
  }

  return (
    <Header aria-label="My Trading journal">
      <SkipToContent />
      <HeaderMenuButton
        aria-label="Open menu"
        onClick={updateMenuState}
        isActive={isSideNavExpanded}
      />
      <HeaderName prefix="">My Trading journal</HeaderName>
      <HeaderNavigation className={styles.container} aria-label="My Trading Journal">
        <Link className={styles.link} to="/">
          Home
        </Link>
        <Link className={styles.link} to="/trades">
          Trades
        </Link>
        <Link className={styles.link} to="/import">
          Import
        </Link>
      </HeaderNavigation>
      <SideNav aria-label="Side navigation" expanded={isSideNavExpanded} isPersistent={false}>
        <SideNavItems>
          <HeaderSideNavItems>
            <Link to="/">Home</Link>
            <Link to="/trades">Trades</Link>
            <Link to="/import">Import</Link>
          </HeaderSideNavItems>
        </SideNavItems>
      </SideNav>
    </Header>
  )
}