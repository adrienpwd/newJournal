import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderSideNavItems,
  SkipToContent,
  SideNav,
  SideNavItems
} from 'carbon-components-react/lib/components/UIShell';

import styles from './nav.module.css';

export default function Navbar() {
  const [isSideNavExpanded, setSideNavExpanded] = useState(false);

  function updateMenuState() {
    setSideNavExpanded(!isSideNavExpanded);
  }

  return (
    <Header aria-label="TradeSeeds" className={styles.appBar}>
      <SkipToContent />
      <HeaderMenuButton
        aria-label="Open menu"
        onClick={updateMenuState}
        isActive={isSideNavExpanded}
      />
      <HeaderName prefix="" className={styles.header}>
        TS
      </HeaderName>
      <HeaderNavigation className={styles.container} aria-label="TradeSeeds">
        <Link className={styles.link} to="/dashboard">
          Dashboard
        </Link>
        <Link className={styles.link} to="/overviews">
          Overviews
        </Link>
        <Link className={styles.link} to="/strategy">
          Strategy
        </Link>
        <Link className={styles.link} to="/tradebook">
          Tradebook
        </Link>
        <Link className={styles.link} to="/utils">
          Utils
        </Link>
        <Link className={styles.link} to="/import">
          Import
        </Link>
      </HeaderNavigation>
      <SideNav
        aria-label="Side navigation"
        expanded={isSideNavExpanded}
        isPersistent={false}
      >
        <SideNavItems>
          <HeaderSideNavItems>
            <Link to="/">Home</Link>
            <Link to="/overviews">Overviews</Link>
            <Link to="/tradebook">Tradebook</Link>
            <Link to="/utils">Utils</Link>
            <Link to="/import">Import</Link>
          </HeaderSideNavItems>
        </SideNavItems>
      </SideNav>
    </Header>
  );
}
