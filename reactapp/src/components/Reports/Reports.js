import React, { useEffect, useState } from 'react';
import './Reports.css'
import { fetcher } from "../../utils/Fetcher";
import Select from "react-select";
import { Doughnut } from 'react-chartjs-2';


const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase();


export default function Reports() {
  const [month, setMonth] = useState('all');
  const [reportData, setReportData] = useState({});


  useEffect(() => {
    async function fetchExpenses() {
      const { success, data, error } = await fetcher(`/reports?month=${month}`, {
        method: 'GET'
      });
      if (success) {
        await setReportData(data);
        console.log(data)
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

  function FormattedData(props) {
    const { title, type } = props;

    if (Object.keys(reportData).length === 0 || reportData.totalExpenses === 0) {
      return (
        <>
          <div className="ReportBoxTitle">{title}</div>
          <div className="noDataBox">No Data</div>
        </>
      )
    }

    return (
      <>
        <div className="ReportBoxTitle">{title}</div>
        <div className="ReportItemsContainer">
          {Object.keys(reportData.expensesByCategory).map(function (key, index) {
            return (
              <div className="reportItem">
                <div className="expenseName">{capitalize(key)}</div>
                <div className="expenseValue">{reportData.expensesByCategory[key][type]}</div>
              </div>
            )
          })}
          <div className="reportItemTotals">
            <div className="expenseName">{type === 'sum' ? "Total Sum" : "Total Expenses"}</div>
            <div className="expenseValue">{type === 'sum' ? reportData.totalSum : reportData.totalExpenses}</div>
          </div>
        </div>
      </>
    )
  }

  function FormattedDoughnut(props) {
    const { title, type } = props;
    const data = {
      labels: [],
      datasets: [{
        label: '# of Votes',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
      }]
    }

    if (Object.keys(reportData).length === 0 || reportData.totalExpenses === 0) {
      return (
        <>
          <div className="ReportBoxTitle">{title}</div>
          <div className="noDataBox">No Data</div>
        </>
      )
    }

    for (const category in reportData.expensesByCategory) {
      data.labels.push(category);
      data.datasets[0].data.push(reportData.expensesByCategory[category][type]);
    }


    return (
      <>
        <div className="ReportBoxTitle">{title}</div>
        <Doughnut data={data} height={100} width={100} options={{ maintainAspectRatio: false }}/>
      </>
    )
  }

  return (
    <>
      <div className="title">
        <div className="titleText">Reports</div>
      </div>
      <div className="ReportsBody">
        <Filter/>
        <div className="ReportsContainer">
          <div className="ReportBox">
            <FormattedDoughnut title="Sum By Category" type="sum"/>
          </div>
          <div className="ReportBox">
            <FormattedData title="Sum By Category" type="sum"/>

          </div>
          <div className="ReportBox">
            <FormattedDoughnut title="Amount By Category" type="amount"/>
          </div>
          <div className="ReportBox">
            <FormattedData title="Amount By Category" type="amount"/>

          </div>
        </div>
      </div>
    </>
  );
}