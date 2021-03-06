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
    height: '460px',
    width: '400px',
  },
};

export default function NewExpenseModal(props) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [sum, setSum] = useState(0);
  const { modalIsOpen, closeModal } = props;
  const categories = [
    { value: 'food', label: 'Food' },
    { value: 'health', label: 'Health' },
    { value: 'housing', label: 'Housing' },
    { value: 'sport', label: 'Sport' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' },
  ]

  async function onSubmit() {
    const body = { category, description, sum }
    const { success, error } = await fetcher('/expenses/new', {
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
    >
      <h2>New Entry</h2>
      <form className="modalForm">
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
          <div>??? <input type="number" autoComplete="off" onChange={(e) => setSum(Number.parseInt(e.target.value))}/>
          </div>
        </div>
      </form>

      <button onClick={onSubmit}>Submit</button>
      <button onClick={closeModal}>close</button>
    </Modal>
  )
}