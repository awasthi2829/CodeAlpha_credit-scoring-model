import React from 'react';
import { BookOpen, ChevronDown, Menu, Settings2, ShieldCheck, X } from 'lucide-react';
import { UserPreferences } from '../types/underwriting';

interface HeaderProps {
  activeScreen: 'intake' | 'analytics';
  onNavigate: (screen: 'intake' | 'analytics') => void;
  preferences: UserPreferences;
  onOpenPreferences: () => void;
  onOpenDocs: () => void;
  onToggleMobileMenu: () => void;
  mobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onNavigate,
  preferences,
  onOpenPreferences,
  onOpenDocs,
  onToggleMobileMenu,
  mobileMenuOpen,
}) => {
  const navigate = (screen: 'intake' | 'analytics') => {
    onNavigate(screen);
    if (mobileMenuOpen) onToggleMobileMenu();
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        <button type="button" className="brand-lockup" onClick={() => navigate('intake')} aria-label="Vectura home">
          <span className="brand-mark"><ShieldCheck size={21} strokeWidth={2.2} /></span>
          <span className="brand-name">vectura<span>.ai</span><small>Credit profile studio</small></span>
        </button>

        <div className="header-status"><span className="status-dot" /> Ready to assess</div>

        <nav className={`header-nav ${mobileMenuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <button type="button" onClick={() => navigate('intake')} className={activeScreen === 'intake' ? 'active' : ''}>Applicant profile</button>
          <button type="button" onClick={() => navigate('analytics')} className={activeScreen === 'analytics' ? 'active' : ''}>Risk assessment</button>
        </nav>

        <div className="header-actions">
          <button type="button" className="header-icon-button docs-action" onClick={onOpenDocs} aria-label="Model guide" title="Model guide"><BookOpen size={18} /></button>
          <button type="button" className="profile-action" onClick={onOpenPreferences}>
            <span className="profile-avatar">{preferences.isGuest ? 'G' : preferences.underwriterName.trim().charAt(0).toUpperCase()}</span>
            <span className="profile-label">{preferences.isGuest ? 'Guest workspace' : preferences.underwriterName}</span>
            <ChevronDown size={14} />
          </button>
          <button type="button" className="mobile-menu-button" onClick={onToggleMobileMenu} aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button type="button" className="mobile-settings-button" onClick={onOpenPreferences} aria-label="Settings"><Settings2 size={18} /></button>
        </div>
      </div>
    </header>
  );
};
