import React, { useEffect, useState } from 'react';
import './Reports.css'
import { fetcher } from "../../utils/Fetcher";
import Select from "react-select";

export default function Reports() {
  const [month, setMonth] = useState('all');


  useEffect(() => {
    async function fetchExpenses() {
      const { success, error } = await fetcher(`/reports?month=${month}`, {
        method: 'GET'
      });
      if (success) {
        console.log('Success!')
      } else {
        console.log(error);
      }
    }

    fetchExpenses().catch(err => console.log(err));
  }, [month])

  function Filter() {
    const options = [
      { value: 'all', label: 'All Time' },
      { value: 1, label: 'January' },
      { value: 2, label: 'February' },
      { value: 3, label: 'March' },
      { value: 4, label: 'April' },
      { value: 5, label: 'May' },
      { value: 6, label: 'June' },
      { value: 7, label: 'July' },
      { value: 8, label: 'August' },
      { value: 9, label: 'September' },
      { value: 10, label: 'October' },
      { value: 11, label: 'November' },
      { value: 12, label: 'December' },
    ]

    return (
      <div className="FilterContainer">
        <div className="FilterText">Filter:</div>
        <Select
          defaultValue={options.filter(option => option.value === month)[0]}
          options={options}
          isSearchable={false}
          onChange={(e) => setMonth(e.value)}
        />
      </div>
    )
  }

  console.log('Called Reports');
  return (
    <>
      <div className="title">
        <div className="titleText">Reports</div>
      </div>
      <div className="ReportsBody">
        <Filter/>
      </div>
    </>
  );
}