import { useEffect, useRef } from 'react';
import { Pie } from "react-chartjs-2";


const Piechart = (props) => {

  return (
    <div>
        <Pie
        data={props.data}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: false,
              text: "Users Gained between 2016-2020"
            }
          }
        }}
      />
    </div>
  )
}

export default Piechart
