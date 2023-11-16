import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import listService from '../../core/services/list.service';

export default function MiddleContentGuest({listId, isAuthenticated}) {

    const [listName, setListName] = useState('');

    useEffect(() => {
      console.log(listId)
        listService.getListName(listId).then(res => {
            setListName(res.listName)
        })
    })



    const navigate = useNavigate();

  return (
    <div className="middle-main middle-main--no-access">
    <section className="no-access-block">
      <p className="no-access-block__text">You are trying to access “<span className='green'>{listName}</span>” </p>
      <h1 className="no-access-block__title h1">We are sorry,</h1>
      <p className="no-access-block__text">but you don’t have access to this list.</p>
      {isAuthenticated ? (<a style={{ cursor: 'pointer' }} onClick={() => navigate("/login")} className="btn">Request access</a>) : 
      (
        <a style={{ cursor: 'pointer' }} onClick={() => navigate("/login")} className="btn">Login first</a>
      )}
      
    </section>
  </div>
  )
}
