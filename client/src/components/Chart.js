import { assocPath, includes, uniq } from "ramda";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { setGraphKeys } from "actions/ui";
import styled from "styled-components";
import { resetDataHistory } from "actions/data";
import { selectDataHistory, selectGraphKeys } from "reducers";
import { possibleColors } from "data/variables";

const StyledRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const StyledInput = styled.div`
  padding: 3px 0;
  margin-right: 1rem;
`;
const StyledOption = styled.div`
  border-radius: 5px;
  border: 2px solid #dedede;
  font-size: 12px;
  margin-right: 1rem;
  cursor: pointer;
  background-color: ${(props) => props["data-active"] && "#374151"};
  padding: 5px 10px;
  margin-bottom: 1rem;
`;
const StyledReset = styled.div`
  border: 2px solid red;
  border-radius: 5px;
  margin-right: 1rem;
  cursor: pointer;
  padding: 5px 10px;
  margin-bottom: 1rem;
  font-size: 12px;
  color: red;
  align-self: flex-start;
  justify-self: flex-start;
`;

const Chart = () => {
  const dispatch = useDispatch();
  const graphKeys = useSelector(selectGraphKeys);
  const dataHistory = useSelector(selectDataHistory);

  const [graphKey, setGraphKey] = useState("estimated_earnings");

  const mappedData = useMemo(() => {
    let mapped = {};
    for (let user of Object.values(dataHistory)) {
      for (let val of user) {
        mapped = assocPath([format(new Date(val.start_of_30_day_interval), "PP"), val.channel], val[graphKey], mapped);
      }
    }
    return mapped;
  }, [dataHistory, graphKey]);

  const dataArray = useMemo(() => {
    const arr = Object.entries(mappedData).map((entry) => {
      const date = new Date(entry[0]);
      return { name: entry[0], ...entry[1], date: date };
    });
    return arr.sort((a, b) => a.date - b.date);
  }, [mappedData]);

  return (
    <>
      <StyledRow>
        <StyledOption data-active={graphKey === "estimated_earnings"} onClick={() => setGraphKey("estimated_earnings")}>
          Earnings (30d)
        </StyledOption>
        <StyledOption data-active={graphKey === "estimated_subs"} onClick={() => setGraphKey("estimated_subs")}>
          Est. Subs
        </StyledOption>
        <StyledOption data-active={graphKey === "percentage_gifted"} onClick={() => setGraphKey("percentage_gifted")}>
          % Gifted
        </StyledOption>
      </StyledRow>
      <StyledRow>
        {Object.keys(dataHistory).map((value) => {
          return (
            <StyledInput key={value}>
              <input
                type="checkbox"
                name={value}
                checked={includes(value, graphKeys)}
                onChange={() =>
                  includes(value, graphKeys)
                    ? dispatch(setGraphKeys(graphKeys.filter((val) => val !== value)))
                    : dispatch(setGraphKeys([...graphKeys, value]))
                }
                id={value}
              />
              <label htmlFor={value}>{value}</label>
            </StyledInput>
          );
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
          <Tooltip labelStyle={{ color: "#000" }} itemStyle={{ color: "#000" }} />
          <Legend layout="horizontal" />
          {uniq(graphKeys).map((value, index) => {
            return <Line type="monotone" key={value} dataKey={value} stroke={possibleColors[index]} dot={false} />;
          })}
        </LineChart>
      </ResponsiveContainer>
      <StyledReset onClick={() => dispatch(resetDataHistory())}>RESET ALL CHART DATA</StyledReset>
    </>
  );
};

export default Chart;
