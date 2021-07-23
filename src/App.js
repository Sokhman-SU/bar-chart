import React, { useState } from "react";
import Select from "react-select";
import { Bar } from "react-chartjs-2";
import program from "./programData.json";
import _ from 'lodash';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "./App.css";

// dropdown select options 
const options = [
  { label: "Viewers By Network", value: "network" },
  { label: "Viewers By genre", value: "genre" },
  { label: "Viewers By Hometown", value: "hometown" }
];

// group by network and make it an array, then add all viewers for each network
const networkarray = _(program)
  .groupBy('network')
  .map((network, id) => ({
    network: id,
    viewers: _.sumBy(network, 'viewers'),
  }))
  .value()

// assign variable to number of viewers (repetitive, has to be a better way to structure this)
const cbsarray = networkarray[0];
const cbsviewers = cbsarray.viewers;

const abcarray = networkarray[1];
const abcviewers = abcarray.viewers;

const syfyarray = networkarray[2];
const syfyviewers = syfyarray.viewers;

// group by genre and make it an array, then add all viewers for each genre
const genrearray = _(program)
  .groupBy('genre')
  .map((genre, id) => ({
    genre: id,
    viewers: _.sumBy(genre, 'viewers'),
  }))
  .value()

// assign variable to number of viewers (repetitive, has to be a better way to structure this)
const sportsarray = genrearray[0];
const sportsviewers = sportsarray.viewers;

const mysteryarray = genrearray[1];
const mysteryviewers = mysteryarray.viewers;

const sfarray = genrearray[2];
const sfviewers = sfarray.viewers;

// group by hometown and make it an array, then add all viewers for each hometown
const hometownarray = _(program)
  .groupBy('hometown')
  .map((hometown, id) => ({
    hometown: id,
    viewers: _.sumBy(hometown, 'viewers'),
  }))
  .value()

// assign variable to number of viewers (repetitive, has to be a better way to structure this)
const pittarray = hometownarray[0];
const pittviewers = pittarray.viewers;

const newarray = hometownarray[1];
const newviewers = newarray.viewers;

const bosarray = hometownarray[2];
const bosviewers = bosarray.viewers;

const clevarray = hometownarray[3];
const clevviewers = clevarray.viewers;

// switch between different views selected from dropdown
function requestApi(network) {
  let result;
  switch (network) {
    case "network":
      result = {
        labels: ['CBS', 'ABC', 'SyFy'],
        datasets: [
          {
            label: "Network Viewship",
            data: [cbsviewers, abcviewers, syfyviewers],
            backgroundColor: '#072f5f',
            borderWidth: 1
          }
        ]
      };
      break;

    case "genre":
      result = {
        labels: ['Sports', 'Mystery', 'Science Fiction'],
        datasets: [
          {
            label: "Genre Viewship",
            data: [sportsviewers, mysteryviewers, sfviewers],
            backgroundColor: '#6495ed',
            borderWidth: 1
          }
        ]
      };
      break;

      case "hometown":
        result = {
          labels: ['Pittsburgh', 'New York', 'Boston', 'Cleveland'],
          datasets: [
            {
              label: "Hometown Viewship",
              data: [pittviewers, newviewers, bosviewers, clevviewers],
              backgroundColor: '#00AEEF',
              borderWidth: 1
            }
          ]
        };
        break;

    default:
      break;
  }
  return Promise.resolve(result);
}

function getDataFromNetwork(network) {
  return requestApi(network);
}



const defaultNetwork = options[0];
const defaultData = {};

export default function App() {
  // useState is a hook to change data
  const [network, setNetwork] = React.useState(defaultNetwork.value);
  const [chartData, setChartData] = useState(defaultData);

  const handleChange = (value) => {
    const network = value.value;
    setNetwork(network);
  };

  React.useEffect(() => {
    getDataFromNetwork(network).then((chartData) => {
      setChartData(chartData);
    });
  }, [network]);

  return (
    <div className="card-one">
      <h1>Tv Viewership</h1>
     
      <Tabs className="tabs">
        <TabList>
          <Tab>Filter By: Viewship</Tab>
          <Tab>Filter By: Location</Tab>
        </TabList>

        <TabPanel>
        <span className="dropdown-select">
        <Select
          options={options}
          defaultValue={defaultNetwork}
          onChange={handleChange}
        />
      </span>
          <Bar
          data={chartData}
          options={{
            responsive: true,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            },

          }}
          height={125}
        />
        </TabPanel>
        <TabPanel>
          <h2>Future Heatmap Of Viewers Based On Location</h2>
        </TabPanel>
      </Tabs>
    </div>
  );
}

