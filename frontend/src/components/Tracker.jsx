import React from 'react'
import { VerticalTimeline, VerticalTimelineElement, } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FaBeer,FaCogs,FaRegEdit,FaStar } from "react-icons/fa";
import { TbTransferVertical } from "react-icons/tb";



const Tracker = ({data}) => {


  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <>
        <VerticalTimeline>
          {/* {data.path[0].assetCreateTxn && 
              <VerticalTimelineElement
              className="vertical-timeline-element--creation"
              contentStyle={{ background: '#00796b', color: '#fff' }}
              contentArrowStyle={{ borderRight: '7px solid #00796b' }}
              date={formatTimestamp(data.path[0].assetCreateTxn.timestamp)}
              iconStyle={{ background: '#00796b', color: '#fff' }}
              icon={<TbTransferVertical />}
            >
              <h3 className="vertical-timeline-element-title">Asset Creation</h3>
              <p>Sender: <span className="text-wrap">{data.path[0].assetCreateTxn.sender}</span></p>
              <p>Tx ID: {data.path[0].assetCreateTxn.txid}</p>
              <p>Confirmed Round: {data.path[0].assetCreateTxn.confirmedRound}</p>
            </VerticalTimelineElement>
            
          } */}
          {data.path.map((element) => (
            <>
            {element.assetCreateTxn && 
              <VerticalTimelineElement
              className="vertical-timeline-element--creation"
              contentStyle={{ background: '#00796b', color: '#fff' }}
              contentArrowStyle={{ borderRight: '7px solid #00796b' }}
              date={<p className='time_stamp'>{formatTimestamp(element.assetCreateTxn.timestamp)}</p>}
              iconStyle={{ background: '#00796b', color: '#fff' }}
              icon={<FaCogs />}
            >
              <h3 className="vertical-timeline-element-title">Asset Creation</h3>
              <p className='hover_effect'><a href={`https://lora.algokit.io/${data.network}/account/${element.assetCreateTxn.sender}`} target='blank'><span>Sender :</span> {`${element.assetCreateTxn.sender.slice(0,4)}....${element.assetCreateTxn.sender.slice(-4)}`}</a></p>
              <p className='hover_effect'><a href={`https://lora.algokit.io/${data.network}/transaction/${element.assetCreateTxn.txid}`} target='blank'>Tx ID : {`${element.assetCreateTxn.txid.slice(0,4)}....${element.assetCreateTxn.txid.slice(-4)}`}</a></p>
              <p>Confirmed Round : {element.assetCreateTxn.confirmedRound}</p>
            </VerticalTimelineElement>
            }
            {
              element.assetReConfigTxn && (
                <VerticalTimelineElement
                  className="vertical-timeline-element--reconfig"
                  contentStyle={{ background: '#ff9800', color: '#fff' }}
                  contentArrowStyle={{ borderRight: '7px solid #ff9800' }}
                  date={<p className='time_stamp'>{formatTimestamp(element.assetReConfigTxn.timestamp)}</p>}
                  iconStyle={{ background: '#ff9800', color: '#fff' }}
                  icon={<FaRegEdit />}
                >
                  <h3 className="vertical-timeline-element-title">Asset Reconfiguration</h3>
                  <p className='hover_effect'><a href={`https://lora.algokit.io/${data.network}/account/${element.assetReConfigTxn.sender}`} target='blank'>Sender : {`${element.assetReConfigTxn.sender.slice(0,4)}....${element.assetReConfigTxn.sender.slice(-4)}`}</a></p>
                  <p className='hover_effect'><a href={`https://lora.algokit.io/${data.network}/transaction/${element.assetReConfigTxn.txid}`} target='blank'>Tx ID : {`${element.assetReConfigTxn.txid.slice(0,4)}....${element.assetReConfigTxn.txid.slice(-4)}`}</a></p>
                  <p>Confirmed Round : {element.assetReConfigTxn.confirmedRound}</p>
                </VerticalTimelineElement>
              )
            }
            {element.assetTransferTxn && (
              <VerticalTimelineElement
                className="vertical-timeline-element--transfer"
                contentStyle={{ background: '#3f51b5', color: '#fff' }}
                contentArrowStyle={{ borderRight: '7px solid #3f51b5' }}
                date={<p className='time_stamp'>{formatTimestamp(element.assetTransferTxn.timestamp)}</p>}
                iconStyle={{ background: '#3f51b5', color: '#fff' }}
                icon={<TbTransferVertical />}
              >
                <h3 className="vertical-timeline-element-title">Asset Transfer</h3>
                <p className='hover_effect'><a href={`https://lora.algokit.io/${data.network}/account/${element.assetTransferTxn.sender}`} target='blank'>Sender : {`${element.assetTransferTxn.sender.slice(0,4)}....${element.assetTransferTxn.sender.slice(-4)}`}</a></p>
                <p className='hover_effect'><a href={`https://lora.algokit.io/${data.network}/account/${element.assetTransferTxn.from}`} target='blank'>From : {`${element.assetTransferTxn.from.slice(0,4)}....${element.assetTransferTxn.from.slice(-4)}`}</a></p>
                <p className='hover_effect'><a href={`https://lora.algokit.io/${data.network}/account/${element.assetTransferTxn.to}`} target='blank'>To : {`${element.assetTransferTxn.to.slice(0,4)}....${element.assetTransferTxn.to.slice(-4)}`}</a></p>
                <p className='hover_effect'><a href={`https://lora.algokit.io/${data.network}/transaction/${element.assetTransferTxn.txid}`} target='blank'>Tx ID : {`${element.assetTransferTxn.txid.slice(0,4)}....${element.assetTransferTxn.txid.slice(-4)}`}</a></p>
                {/* <p>Amount: {element.assetTransferTxn.amount}</p> */}
                <p>Confirmed Round : {element.assetTransferTxn.confirmedRound}</p>
                <p>Transfer type : <span className='txn_type'>{element.assetTransferTxn.type}</span></p>
              </VerticalTimelineElement>
            )}
            </>))}
            <VerticalTimelineElement
              iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
              icon={<FaStar />}
            />
        </VerticalTimeline>
    </>
  )
}

export default Tracker


