import { assocPath, includes } from 'ramda';
import React, { useMemo } from 'react';
import { connect } from "react-redux";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { setGraphKeys } from "actions/mouse";
import styled from "styled-components";

const StyledRow =styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const StyledInput = styled.div`
  padding: 3px 0;
  margin-right: 1rem;
`;
const possibleColors = [
  '#f6c85f',
  '#F22613',
  '#C8F7C5',
  'green',
  '#E0FFFF',
  '#FFFACD',
  '#FF8C00',
  '#00AA00',
  'pink',
  'purple',
]
const Example = ({ dataHistory, graphKeys, setVisibleKeys }) => {
  const mappedData = useMemo(() => {
    let mapped = {};
    for (let user of Object.values(dataHistory)) {
      for (let val of user) {
        mapped = assocPath([format(new Date(val.start_of_30_day_interval), "PP"), val.channel], val.estimated_earnings, mapped);
      }
    }
    return mapped;
  }, [dataHistory]);
  const dataArray = useMemo(() => {
    const arr = Object.entries(mappedData).map((entry) => {
      const date = new Date(entry[0]);
      return ({ name: entry[0], ...entry[1], date: date })
    });
    return arr.sort((a, b) => a.date - b.date);
  }, [mappedData])

  return (
    <>
    <StyledRow>
        {Object.keys(dataHistory).map((value) => {
          return (
            <StyledInput key={value}>
              <input
                type="checkbox"
                name={value}
                checked={includes(value, graphKeys)}
                onChange={() => includes(value, graphKeys) ? setVisibleKeys(graphKeys.filter(val => val !== value)) : setVisibleKeys([...graphKeys, value])}
                id={value}
              />
              <label htmlFor={value}>
                {value}
              </label>
            </StyledInput>
          )
        })}
      </StyledRow>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          width={500}
          height={500}
          data={dataArray}
          margin={{
            top: 38,
            right: 30,
            left: 20,
            bottom: 38,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip labelStyle={{ color: "#000" }}  itemStyle={{color: "#000"}}/>
          <Legend layout="horizontal"/>
          {(graphKeys).map((value, index) => {
            return (
              <Line type="monotone" key={value} dataKey={value} stroke={possibleColors[index]} dot={false}/>
            )
          })}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    dataHistory: state.data.dataHistory,
    graphKeys: state.mouse.graphKeys,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setVisibleKeys: (graphKeys) => dispatch(setGraphKeys(graphKeys)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Example);