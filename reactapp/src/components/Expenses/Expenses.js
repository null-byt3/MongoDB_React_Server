import React, { useEffect, useState } from 'react';
import './Expenses.css';
import NewExpenseModal from "./NewExpenseModal";
import { fetcher } from "../../utils/Fetcher";


const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase();

function timeFormatter(dateISOString) {
  const date = new Date(dateISOString);
  const year = date.getFullYear().toString();
  const month = ( date.getMonth() + 101 ).toString().substring(1);
  const day = ( date.getDate() + 100 ).toString().substring(1);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}


export default function Expenses() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    async function fetchEntries() {
      const { success, error, entries } = await fetcher('/entries', {
        method: 'GET'
      });
      if (success) {
        setEntries(entries)
      } else {
        console.log(error);
      }
    }

    fetchEntries().catch(err => console.log(err));
  }, [])


  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function handleDelete(e) {
    const id = e.target.parentElement?.parentElement?.id;
    if (id) {
      const res = await fetcher('/entries/delete', {
        method: 'POST',
        body: JSON.stringify({ id }),
      })
      window.location.reload(false);
    }
  }

  function mapEntry(entry) {
    const { type, category, description, sum, _id, timestamp } = entry;
    return (
      <div className="itemContainer" id={_id}>
        <div className={`${type === "income" ? "greenSignBox" : "redSignBox"}`}>
          <div className="sign" style={{ color: `${type === "income" ? "#70fd6f" : "#fd716f"}` }}>
            {type === "income" ? <>+</> : <>-</>}
          </div>
        </div>
        <div className={`${type === "income" ? "greenDataBox" : "redDataBox"}`}>
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

  return (
    <>
      <div className="title">
        <div className="titleText">Expenses</div>
      </div>
      <div className="body">
        <div className="itemsList">
          <div>
            {entries ? entries.map(entry => mapEntry(entry)) : 'lol'}
          </div>
        </div>
        <div className="rightContainer">
          <button className="openModalButton" onClick={openModal}>Add Entry</button>
          <NewExpenseModal modalIsOpen={modalIsOpen} closeModal={closeModal}/>
        </div>
      </div>
    </>
  );
}