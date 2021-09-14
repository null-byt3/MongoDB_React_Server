import React, { useState } from 'react';
import './Expenses.css';
import NewExpenseModal from "./NewExpenseModal";


const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase();

export default function Expenses() {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const entries = [{
    "username": "sebas",
    "type": "income",
    "category": "sport",
    "description": "Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.",
    "sum": 1872
  }, {
    "username": "sebas",
    "type": "expense",
    "category": "housing",
    "description": "Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
    "sum": 163
  }, {
    "username": "sebas",
    "type": "expense",
    "category": "health",
    "description": "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
    "sum": 115
  }, {
    "username": "sebas",
    "type": "income",
    "category": "sport",
    "description": "Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
    "sum": 1215
  }, {
    "username": "sebas",
    "type": "income",
    "category": "education",
    "description": "Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.",
    "sum": 1926
  }, {
    "username": "sebas",
    "type": "expense",
    "category": "housing",
    "description": "Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.",
    "sum": 772
  }, {
    "username": "sebas",
    "type": "income",
    "category": "education",
    "description": "Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.",
    "sum": 104
  }, {
    "username": "sebas",
    "type": "income",
    "category": "housing",
    "description": "In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.",
    "sum": 371
  }, {
    "username": "sebas",
    "type": "expense",
    "category": "sport",
    "description": "Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.",
    "sum": 1099
  }, {
    "username": "sebas",
    "type": "income",
    "category": "housing",
    "description": "Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.",
    "sum": 1872
  }]


  function mapEntry(entry) {
    const { type, category, description, sum } = entry;
    return (
      <div className="itemContainer">
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
      </div>
    )
  }


  console.log('Called Expenses');
  return (
    <>
      <div className="title">
        <div className=" titleText">Expenses</div>
      </div>
      <div className="body">
        <div className="itemList">
          <div>{entries.map(entry => mapEntry(entry))}</div>
        </div>
        <div>
          <button onClick={openModal}>Open Modal</button>
          <NewExpenseModal modalIsOpen={modalIsOpen} closeModal={closeModal}/>
        </div>
      </div>
    </>
  );
}