import React from 'react'
import logoSVG from '../../assets/images/logo.svg'
import dummyImg from '../../assets/images/dummy.png'


export default function SidebarGuest() {
  return (
    <div className="sidebar js-popup-parent">
         <div className="sidebar__header">
      <a className="sidebar__logo-holder">
        <img className="sidebar__logo" src={logoSVG} alt="Logo" />
      </a>
      <h2 className="sidebar__title h2"><span className='orange'>TODO</span> App</h2>
    </div>
    <div className="sidebar__mobile-profile-toggle">
      <img className="sidebar__toggle-img" src={dummyImg} alt="Guest" />
      <button className="sidebar__toggle-btn js-sidebar-menu" type="button">
        <span className="sr-only">Menu</span>
      </button>
    </div>
    <div className="sidebar__container js-sidebar-content">
      <div className="sidebar__profile sidebar__profile--guest">
        <img className="sidebar__profile-img" src={dummyImg} alt="Guest" />
        <h2 className="sidebar__profile-name h2">Guest</h2>
        <p className="sidebar__guest-text">You are not logged in. Please login in to see your lists</p>
      </div>
    </div>
    </div>
  )
}
