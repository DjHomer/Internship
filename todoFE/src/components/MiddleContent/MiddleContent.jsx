import React, { useEffect, useState } from 'react'
import noTasksImg from '../../assets/images/no-tasks-image.png'
import todoService from '../../core/services/todo.service';
import TodoItem from '../TodoItem/TodoItem';
import listService from '../../core/services/list.service';

export default function MiddleContent({activeListId, withTokenValidation, employeeId, rerenderListDetails, employeeName}) {

  const [selDate, setSelDate] = useState(new Date());
  const [uncompletedItems, setUncompletedItems] = useState([])
  const [todaysItems, setTodaysItems] = useState([])
  const [inputValue, setInputValue] = useState('');
  const [listDetails, setListDetails] = useState({})



  useEffect(() => {

    todoService.getTodoItemsDay(activeListId, formatDateToString(selDate)).then(res => {
      setUncompletedItems(res.uncompletedItems)
      setTodaysItems(res.todaysItems)
    })

  }, [activeListId, selDate])

  useEffect(() => {

    listService.getListInfo(employeeId, activeListId).then(res => {
      setListDetails(res)
    })
  },[uncompletedItems, todaysItems])

  const tasksLeft = listDetails.totalTasks - listDetails.completedTasks


  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

const formatdDateWeekday = selDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 

      const todoItem = {
        listId: activeListId,
        dateCreated: formatDateToString(selDate),
        description: inputValue
      };
      
      todoService.createTodoItem(todoItem).then(res => {
        setTodaysItems(prevItems => [...prevItems, res]); 
        setInputValue("");
        rerenderListDetails() 
      })
    }
  };

  const handleNextDayClick = () => {
    const nextDay = new Date(selDate);
    nextDay.setDate(selDate.getDate() + 1);
    setSelDate(nextDay);
  };

  const handlePreviousDayClick = () => {
    const prevDay = new Date(selDate);
    prevDay.setDate(selDate.getDate() - 1);
    setSelDate(prevDay);
  };

  const isNextButtonDisabled = selDate.toDateString() === new Date().toDateString();



  const updateUncompletedItems = (id, updatedItem) => {
    const updatedItems = uncompletedItems.map(item => {
      if (item.id === id) {
        return updatedItem;
      }
      return item;
    });
    setUncompletedItems(updatedItems);
    rerenderListDetails()
  }

  const updateTodaysItems = (id, updatedItem) => {
    const updatedItems = todaysItems.map(item => {
      if (item.id === id) {
        return updatedItem;
      }
      return item;
    });

    setTodaysItems(updatedItems);
    rerenderListDetails()
  }

  const allTasksDone = () => {
    const areAllUncompletedItemsDone = uncompletedItems.every(item => item.isDone);
    const areAllTodaysItemsDone = todaysItems.every(item => item.isDone);    
    return areAllUncompletedItemsDone && areAllTodaysItemsDone;
  }


  return (
    <div className="middle-main">
      <section className="intro">
        <h1 className="intro__title h1">Hi <span className='green'>{employeeName}</span></h1>
				{tasksLeft > 1 && ( 
        <p className="intro__text">You have <strong>{tasksLeft}</strong> uncompleted tasks</p>
        )}

        {tasksLeft == 1 && ( 
        <p className="intro__text">You have <strong>{tasksLeft}</strong> uncompleted task</p>
        )}

        {tasksLeft == 0 && (
        <p className="intro__text">Well done! You don’t have any uncompleted task!</p>
        )}

       
      </section>
      <section className="tasks">
        <div className="tasks__header">
          <div className="tasks__links">
          <button className="tasks__link tasks__link--previous inline-link" onClick={handlePreviousDayClick} type="button">Previous day</button>
      <button className="tasks__link tasks__link--next inline-link" onClick={handleNextDayClick} disabled={isNextButtonDisabled} type="button">Next day</button>
          </div>
          <h2 className="tasks__title h2">{formatdDateWeekday.split(',')[0]}</h2>
          <span className="tasks__date">{formatdDateWeekday.split(',')[1]} {formatdDateWeekday.split(',')[2]}</span>
          <button className="tasks__today inline-link tasks__today--active" type="button">Today</button>
        </div>
        <div className="tasks__main">
          <form className="tasks__form">
            <div className="tasks__input-holder">
              <label htmlFor="addtask">
                <span className="sr-only">Add a task...</span>
              </label>
              <input
                type="text"
                className="tasks__input"
                id="addtask"
                name="addtask"
                placeholder="Add a task..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)} 
                onKeyDown={handleKeyDown} 
              />

            </div>
            <div className="tasks__container">
      <div className="tasks__list-holder">
      {uncompletedItems.length > 0 && <h4 className="tasks__list-title h4">Uncomplete tasks</h4>}
        <ul className="tasks__list">
        {uncompletedItems.map(item => (
          <TodoItem
            key={item.id}
            item={item}
            employeeId={employeeId}
            withTokenValidation={withTokenValidation}
            isChecked={item.isDone}
            type="uncompleted"
            updateUncompletedItems={updateUncompletedItems}
            updateTodaysItems={updateTodaysItems}
            selDate={selDate}
            activeListId={activeListId} 
          />
        ))}

    </ul>
      </div>
      <div className="tasks__list-holder">
        {todaysItems.length > 0 && <h3 className="tasks__list-title h3">Today’s tasks</h3>}
        <ul className="tasks__list">
        {todaysItems.map(item => (
          <TodoItem
            key={item.id}
            item={item}
            employeeId={employeeId}
            withTokenValidation={withTokenValidation}
            isChecked={item.isDone}
            type="today"
            updateUncompletedItems={updateUncompletedItems}
            updateTodaysItems={updateTodaysItems}
            selDate={selDate}
            activeListId={activeListId}    
          />
        ))}
        </ul>
      </div>
    </div>
            {allTasksDone() && (<div className="tasks__no-tasks-container">
              <h4 className="tasks__no-tasks-text h4">You have no tasks to do! <br/> Enjoy your day or add a task.</h4>
              <img src={noTasksImg} alt="No tasks decorative image" className="tasks__no-tasks-img" />
            </div>)}
          </form>
        </div>
      </section>
    </div>
  )
}
