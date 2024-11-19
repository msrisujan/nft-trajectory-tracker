import { useEffect, useState } from 'react';
import Tracker from '../components/Tracker';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import Graph from '../components/Graph';
import Piechart from '../components/Piechart';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../assets/images/portal.gif'


Chart.register(CategoryScale);


const HomePage = () => {

    const [selectedValue, setSelectedValue] = useState(null);
    const [apiData,setApiData] = useState([])
    const [isLoading,setIsLoading] = useState(true);
    const [tranferCount,setTransferCount] = useState(null);
    const [reconfigureCount,setReconfigureCount] = useState(null)

    const apiCall = async (data) => {
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({  "assetId": data.assetId, "network": data.network })
      };
      const response = await fetch('http://194.54.158.191:1314',requestOptions)
      const result = await response.json()
      if(result.assetId){
        setIsLoading(false);
        setApiData(result)
        toast.success('Asset Found !');
        let transcount = 0
        let reconcount = 0
        result.path.forEach(element => {
          if(element.assetTransferTxn){
            transcount++
          }
        });
        result.path.forEach(element => {
          if(element.assetReConfigTxn){
            reconcount++
          }
        })
        setTransferCount(transcount);
        setReconfigureCount(reconcount);
      }
      else{
        setIsLoading(true);
        toast.error('Asset Not Found !');
      }
  }

    const handleSubmit = () => {
        const asset = document.getElementById('assetid').value
        const net = document.getElementById('networktype').value
        const formData = {
          assetId : asset,
          network : net
        }
        apiCall(formData);
    }



    const Data = [
        {
          id: 1,
          transaction : 'Transfer',
          count: tranferCount,
        },
        {
          id: 2,
          transaction: 'Reconfigure',
          count: reconfigureCount,
        },
        // {
        //   id: 3,
        //   year: 2018,
        //   userGain: 78888,
        //   userLost: 555
        // },
        // {
        //   id: 4,
        //   year: 2019,
        //   userGain: 90000,
        //   userLost: 4555
        // },
        // {
        //   id: 5,
        //   year: 2020,
        //   userGain: 4300,
        //   userLost: 234
        // }
      ];
      

      const chartData = {
        labels: Data.map((data) => data.transaction), 
        datasets: [
          {
            label: "Total",
            data: Data.map((data) => data.count),
            backgroundColor: [
              "#3f51b5",
              "#ff9800",
            ],
            borderColor: "#fff",
            borderWidth: 1
          }
        ]
      };


   return (
    
    <>
        <div className="home_wrapper">
            <div className="top_section">
                <div className="assetid_div">
                    <label htmlFor="assetid">Asset Id :</label>
                    <input type="number" id='assetid'/>
                </div>
                <select name="" id="networktype">
                    <option value="null">Select Network</option>
                    <option value="mainnet">Mainnet</option>
                    <option value="testnet">Testnet</option>
                </select>
                <button type="submit" className='search_btn' onClick={() => handleSubmit()}>search</button>
           </div>
            <div className="bottom_section">
                <div className="tracker_div">
                    {!isLoading ?<Tracker
                    data={apiData}
                    /> : <div className='loading_animation'> <img src={Loading} alt="" style={{width: '66%'}}/> </div>}
                </div>
                <div className="charts_div">
                    <div className="piechart_div">
                        {!isLoading ? <Piechart data={chartData} /> : <></>}
                    </div>
                    <div className="graph_div">
                        <Graph/>
                    </div>
                </div>
            </div>
        </div>
        <ToastContainer position="bottom-right" autoClose = {3000} newestOnTop closeOnClick pauseOnHover theme="dark" />
    </>
  )
}

export default HomePage

