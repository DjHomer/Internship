import React, { useEffect, useState } from 'react'
import listService from '../../core/services/list.service';
import employeeService from '../../core/services/employee.service';


export default function ListDetails({employee, activeListId, activeListDetails, withTokenValidation, rerender}) {

  const getListInfoTokenValidation = withTokenValidation(listService.getListInfo);
  const getSharedEmployeesTokenValidation = withTokenValidation(employeeService.getSharedListEmployees)

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [emailInput, setEmailInput] = useState('');

  
  const [listDetails, setListDetails] = useState({})
  const [sharedEmployees, setSharedEmployees] = useState([])

  const completedByOthers = listDetails.completedTasks - listDetails.completedByMe;


  useEffect(()=>{
    getSharedEmployeesTokenValidation(activeListDetails.id).then(emp => {
      console.log(emp)
      setSharedEmployees(emp)
    })

    getListInfoTokenValidation(employee.id, activeListDetails.id).then(li => {
      setListDetails(li)
    })


  },[activeListId, rerender])


  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

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
    console.log(emails)
  }

  const renderPrivateStats = () => {
    return (
      <>
        <li className="details__stats-item">
          <span className="details__stats-num green">{listDetails.totalTasks}</span>
          <span className="details__stats-text body-text">tasks</span>
        </li>
        <li className="details__stats-item">
          <span className="details__stats-num green">{listDetails.completedTasks}</span>
          <span className="details__stats-text body-text">completed</span>
        </li>
      </>
    );
  };

  const renderSharedStats = () => {
    return (
      <>
        <li className="details__stats-item">
          <span className="details__stats-num green">{listDetails.totalTasks}</span>
          <span className="details__stats-text body-text">tasks</span>
        </li>
        <li className="details__stats-item">
          <span className="details__stats-num green">{listDetails.completedByMe}</span>
          <span className="details__stats-text body-text">completed by me</span>
        </li>
        <li className="details__stats-item">
          <span className="details__stats-num green">{completedByOthers}</span>
          <span className="details__stats-text body-text">completed by others</span>
        </li>
      </>
    );
  };

  return (
    <div className={`details js-popup-parent ${isPopupOpen ? 'popup--opened-parent' : ''}`}>
      <section className={`popup js-popup ${isPopupOpen ? 'popup--opened' : ''}`}> 
      <div className="popup__container">
        <div className="popup__header">
          <h2 className="popup__title">Share this list</h2>
          <button className="poput__close-btn js-popup-close" onClick={togglePopup}>
            <span className="sr-only">Close popup</span>
          </button>
        </div>
        <div className="popup__main">
          <div className="popup__share">
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
			<button type="button" className="popup__link inline-link" onClick={() => {navigator.clipboard.writeText(window.location.href)}}>Copy invite link</button>
		</div>
        </div>
      </div>
    </section>
      <h2 className="details__title h2">Details</h2>
      {activeListDetails.isPrivate ? (
        <div className="details__container">
          <div className="details__box">
            <h3 className="details__list-type-title h3">{activeListDetails.name}</h3>
            <span className="details__list-type-tag details__list-type-tag--private body-text">Private</span>
          </div>
          <div className="details__box">
            <h4 className="details__stats-title h4">Statistics</h4>
            <ul className="details__stats-list">{renderPrivateStats()}</ul>
          </div>
        </div>
      ) : (
        <div className="details__container details__container--share">
          <div className="details__box">
            <h3 className="details__list-type-title h3">{activeListDetails.name}</h3>
            <span className="details__list-type-tag details__list-type-tag--shared body-text">Shared</span>
          </div>
          <div className="details__box">
            <h4 className="details__owner-title h4">Owner</h4>
            <div className="details__owner-info-holder">
              <img className="details__img" src={activeListDetails.owner.profilePicUrl} alt="Profile image" />
              <p className="details__owner-info body-text">{activeListDetails.owner.firstName} {activeListDetails.owner.lastName}</p>
            </div>
          </div>
          <div className="details__box">
            <h4 className="details__stats-title h4">Statistics</h4>
            <ul className="details__stats-list">{renderSharedStats()}</ul>
          </div>
          <div className="details__box">
            <h4 className="details__share-title h4">Share</h4>
            <p className="details__share-text body-text">This list is shared with:</p>
            <ul className="details__share-list">
              {sharedEmployees.map((emp) => (
                <li className="details__share-list-item" key={emp.id}>
                  <img src={emp.profilePicUrl} alt="Profile image" className="details__img" />
                </li>
              ))}
            </ul>
            <button className="details__shate-btn inline-link js-create-list-btn" onClick={togglePopup}  type="button">
              Share this list
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
