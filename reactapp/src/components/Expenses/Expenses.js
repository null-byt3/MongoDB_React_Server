import React, { useEffect, useState } from 'react';
import './Expenses.css';
import NewExpenseModal from "./NewExpenseModal";
import { fetcher } from "../../utils/Fetcher";
import Select from "react-select";


const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase();

function timeFormatter(dateISOString) {
  const zeroPad = (num, places) => String(num).padStart(places, '0')

  const date = new Date(dateISOString);
  const year = date.getFullYear().toString();
  const month = ( date.getMonth() + 101 ).toString().substring(1);
  const day = ( date.getDate() + 100 ).toString().substring(1);
  const hours = zeroPad(date.getHours(), 2);
  const minutes = zeroPad(date.getMinutes(), 2);
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}


export default function Expenses() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('all');


  useEffect(() => {
    async function fetchExpenses() {
      const { success, error, expenses } = await fetcher(`/expenses?filter=${filter}`, {
        method: 'GET'
      });
      if (success) {
        setExpenses(expenses)
      } else {
        console.log(error);
      }
    }

    fetchExpenses().catch(err => console.log(err));
  }, [filter])


  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function handleDelete(e) {
    const id = e.target.parentElement?.parentElement?.id;
    if (id) {
      const res = await fetcher('/expenses/delete', {
        method: 'POST',
        body: JSON.stringify({ id }),
      })
      window.location.reload(false);
    }
  }

  function mapEntry(entry) {
    const { category, description, sum, _id, timestamp } = entry;
    return (
      <div className="itemContainer" id={_id}>
        <div className="redSignBox">
          <div className="sign" style={{ color: "#fd716f" }}>
            <>-</>
          </div>
        </div>
        <div className="redDataBox">
          <h2 style={{ marginLeft: '1em' }}>{capitalize(category)}</h2>
          <p style={{ marginLeft: '1em' }}>{capitalize(description)}</p>
          <p style={{ marginLeft: '1em' }}>{sum}</p>
        </div>
        <div className="timeAndTrashBox">
          <div className="timeBox"><span style={{ fontWeight: 'normal' }}>Created: </span>{timeFormatter(timestamp)}
          </div>
          <button className="trashIconButton" onClick={async (e) => await handleDelete(e)}
          >&#128465;&#65039;</button>
        </div>
      </div>
    )
  }

  function Filter() {
    const options = [
      { value: 'all', label: 'All' },
      { value: 'food', label: 'Food' },
      { value: 'health', label: 'Health' },
      { value: 'housing', label: 'Housing' },
      { value: 'sport', label: 'Sport' },
      { value: 'education', label: 'Education' },
      { value: 'other', label: 'Other' },
    ]

    return (
      <div className="FilterContainer">
        <div className="FilterText">Filter:</div>
        <Select
          defaultValue={options.filter(option => option.value === filter)[0]}
          options={options}
          isSearchable={false}
          onChange={(e) => setFilter(e.value)}
        />
      </div>
    )
  }

  return (
    <>
      <div className="title">
        <div className="titleText">Expenses</div>
      </div>
      <div className="body">
        <Filter/>
        <div className="expensesAndButton">
          <div className="itemsList">
            {expenses ? expenses.map(expense => mapEntry(expense)) : 'lol'}
          </div>
          <div className="rightContainer">
            <button className="openModalButton" onClick={openModal}>Add Entry</button>
            <NewExpenseModal modalIsOpen={modalIsOpen} closeModal={closeModal}/>
          </div>
        </div>
      </div>
    </>
  );
}