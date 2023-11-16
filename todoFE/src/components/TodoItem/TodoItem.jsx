import React, { useEffect, useState } from 'react'
import todoService from '../../core/services/todo.service';

export default function TodoItem({ item, withTokenValidation, employeeId, isChecked, type, updateUncompletedItems, updateTodaysItems, selDate, activeListId}) {


    const toggleIsDoneWithToken = withTokenValidation(todoService.toggleIsDone);

    const formatDateToString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
  };

    const handleCheckboxChange = () => {

      const todoItemEdit = {
        id: item.id,
        listId: activeListId,
        dateCreated: item.dateCreated,
        dateFinished: formatDateToString(selDate),
        description: item.description,
        isDone: item.isDone,
        doneById: employeeId
      };

      toggleIsDoneWithToken(todoItemEdit).then(res => {
        if(type=="uncompleted")
          updateUncompletedItems(res.id, res)
        else
          updateTodaysItems(res.id, res)

      });
      };
      

     
 
      
      return (
        <li className="tasks__list-item">
          <label htmlFor={`task${item.id}`} className="tasks__label">
            <input
              type="checkbox"
              className="tasks__checkbox"
              id={`task${item.id}`}
              name={`task${item.id}`}
              value={item.description}
              checked={isChecked} 
              onChange={handleCheckboxChange}
            />
            <span className="tasks__checkmark"></span>
            <span className="tasks__task-text">{item.description}</span>
            {item.isDone && <img className="tasks__shared-img" src={item.doneBy?.profilePicUrl} alt="Profile image"></img>}
          </label>
        </li>
      );
}
