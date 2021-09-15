import Modal from "react-modal";
import React, { useState } from "react";
import './NewExpenseModal.css'
import Select from "react-select";
import { fetcher } from "../../utils/Fetcher";


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '25px',
    border: '1px solid black',
    backgroundColor: 'whitesmoke',
  },
};

export default function NewExpenseModal(props) {
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [sum, setSum] = useState("");
  const { modalIsOpen, closeModal } = props;
  const types = [
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' },
  ]

  const categories = [
    { value: 'food', label: 'Food' },
    { value: 'health', label: 'Health' },
    { value: 'housing', label: 'Housing' },
    { value: 'sport', label: 'Sport' },
    { value: 'education', label: 'Education' },
  ]

  async function onSubmit() {
    const body = { type, category, description, sum }
    const { success, error } = await fetcher('/entries/new', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (success) {
      closeModal();
      window.location.reload(false);
    } else {
      console.log(error);
    }
  }


  return (
    <Modal
      isOpen={modalIsOpen}
      //onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      ariaHideApp={false}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <h2>New Entry</h2>
      <form className="modalForm">
        <div className="formField">
          <div className="fieldHeader">Type:</div>
          <div><Select options={types} onChange={(e) => setType(e.value)}/></div>
        </div>
        <div className="formField">
          <div className="fieldHeader">Category:</div>
          <div><Select options={categories} onChange={(e) => setCategory(e.value)}/>
          </div>
        </div>
        <div className="formField">
          <div className="fieldHeader">Description:</div>
          <div>
            <textarea maxLength="75" className="descriptionBox"
                      onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
        </div>
        <div className="formField">
          <div className="fieldHeader">Sum:</div>
          <div>₪ <input type="number" autoComplete="off" onChange={(e) => setSum(e.target.value)}/></div>
        </div>
      </form>

      <button onClick={onSubmit}>Submit</button>
      <button onClick={closeModal}>close</button>
    </Modal>
  )
}