import React, { useEffect, useState } from 'react'
import logoSVG from '../../assets/images/logo.svg'
import profileImg from '../../assets/images/image1.png'
import listService from '../../core/services/list.service';
import Cookies from 'js-cookie';
import { useNavigate  } from 'react-router-dom';
import employeeService from '../../core/services/employee.service';


export default function Sidebar({employee, empLists, withTokenValidation, setEmpLists, activeList, activeListChanged}) {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const [listName, setListName] = useState('');

  const [emails, setEmails] = useState([]);
  const [emailInput, setEmailInput] = useState('');



  
  const navigateTo = useNavigate();

    const handleClick = (id) => {
        activeListChanged(id);
      };
      
    const handleLogout = () => {
        
      employeeService.logout().then(res => {
        navigateTo('/login');

      })
    
    };

    const toggleSidebar = () => {
        setIsSidebarOpened(!isSidebarOpened);
    };

    const togglePopup = () => {
      setIsPopupOpen(!isPopupOpen);
    };

    const createList = () => {
      const listJson = 
      {
        name: listName,
        ownerId: employee.id
      }

      console.log(listJson)
      
      listService.createList(listJson).then(res => {
        console.log(res)
        setEmpLists(prevItems => [...prevItems, res]);
        setListName("") 
        setIsPopupOpen(false)
      })

      
    }

    const handleInputChange = (e) => {
      setEmailInput(e.target.value);
    };
  
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addEmail();
      }
    };
  
    const isValidEmail = (email) => {
      const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
      return emailRegex.test(email);
    };
  
    const addEmail = () => {
      const trimmedEmail = emailInput.trim();
      if (trimmedEmail !== '' && isValidEmail(trimmedEmail)) {
        setEmails([...emails, trimmedEmail]);
        setEmailInput('');
      }
    };
  
    const removeEmail = (index) => {
      const updatedEmails = [...emails];
      updatedEmails.splice(index, 1);
      setEmails(updatedEmails);
    };


    const submitMails = () => {
       const listJson = 
      {
        name: listName,
        ownerId: employee.id
      }

      console.log(listJson)
      
      listService.createList(listJson).then(res => {
        console.log(res)
        emails.map(email => {
          console.log(email)
          listService.sendListInviteEmployee(res, email)
        })
        setEmpLists(prevItems => [...prevItems, res]);
        setListName("")
        setEmails([])
        setEmailInput("") 
 
        setIsPopupOpen(false)
      })
    }


  return (
   <div className={`sidebar js-popup-parent ${isPopupOpen ? 'popup--opened-parent' : ''}`}>
      <section className={`popup js-popup ${isPopupOpen ? 'popup--opened' : ''}`}> 
      <div className="popup__container">
        <div className="popup__header">
          <h2 className="popup__title">Create a list</h2>
          <button className="poput__close-btn js-popup-close" onClick={togglePopup}>
            <span className="sr-only">Close popup</span>
          </button>
        </div>
        <div className="popup__main">
          <form className="popup__input-add-holder">
            <label className="popup__label-add" htmlFor="addlist">
              <span className="sr-only">Add task</span>
              <input className="popup__input-add" type="text" name="addlist" onChange={(e) => setListName(e.target.value)} id="addlist" placeholder="Type in name..." />
            </label>
          </form>
          <div className="popup__share">
          <h4 className="popup__share-title h4">Share a list</h4>
      <form className="popup__share-wrap">
        <label className="popup__share-label" htmlFor="email">Email</label>
        <div className="popup__share-input-wrap">
          {emails.length > 0 && (
          <ul className="popup__share-email-list">
            {emails.map((email, index) => (
              <li className="popup__share-email-item" key={index}>
                <div className="popup__share-email-item-wrap">
                  <span className="popup__share-email">{email}</span>
                  <button
                    className="popup__share-email-delete-btn"
                    type="button"
                    onClick={() => removeEmail(index)}
                  >
                    <span className="sr-only">Delete email address</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          )}
          <input
            className="popup__share-input"
            type="email"
            id="email"
            name="email"
            placeholder="Type in email, comma separated..."
            value={emailInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button className="popup__share-btn btn" type="button" onClick={submitMails}>
          Send invite
        </button>
      </form>
    </div>
          <div className="popup__buttons">
            <button type="submit" className="popup__button btn" onClick={createList} >Create</button>
          </div>
        </div>
      </div>
    </section>
      <div className='sidebar__header'>
      <a className="sidebar__logo-holder" >
        <img className="sidebar__logo" src={logoSVG} alt="Logo" />
      </a>
      <h2 className="sidebar__title h2"><span className='orange'>TODO</span> App</h2>
      </div>
      <div className="sidebar__mobile-profile-toggle">
        <img className="sidebar__toggle-img" src={employee.profilePicUrl} alt="Jane Doe" />
        <button className="sidebar__toggle-btn js-sidebar-menu" onClick={toggleSidebar} type="button">
          <span className="sr-only">Menu</span>
        </button>
      </div>

      <div className={`sidebar__container js-sidebar-content ${isSidebarOpened ? 'sidebar__container--opened' : ''}`}>
        <div className="sidebar__profile">
          <img className="sidebar__profile-img" src={employee.profilePicUrl} alt="Jane Doe" />
          <h2 className="sidebar__profile-name h2">{employee.firstName} {employee.lastName}</h2>
          <a  className="sidebar__profile-link inline-link">{employee.email}</a>
          <button className="sidebar__profile-btn" onClick={handleLogout}>Logout</button>
        </div>

        <nav className="sidebar__lists-wrap">
          <h3 className="sidebar__lists-title">Lists</h3>
          <ul className="sidebar__lists">
        {empLists.map((list) => (
          <li
            key={list.id}
            className={`sidebar__list-item ${
              list.isPrivate
                ? 'sidebar__list-item--locked'
                : 'sidebar__list-item--shared'
            } ${
              list.id === activeList
                ? 'sidebar__list-item--active'
                : ''
            }`}
          >
            <a
              
              className="sidebar__list-link inline-link"
              onClick={() => handleClick(list.id)}
              style={{ cursor: 'pointer' }}
            >
              {list.name}
            </a>
          </li>
        ))}
      </ul>
        </nav>

        <button className="sidebar__button inline-link js-create-list-btn" onClick={togglePopup} type="button" >Create new list</button>
      </div>
    </div>
  )
}
