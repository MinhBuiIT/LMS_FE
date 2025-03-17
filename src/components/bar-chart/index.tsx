'use client';
import { FC } from 'react';
import { Bar, BarChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type TProps = {
  data: any[];
  key1: string;
  key2: string;
};
const BarChartCom: FC<TProps> = ({ data, key1, key2 }) => {
  return (
    <>
      <ResponsiveContainer width="100%" height="60%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <XAxis dataKey={key1} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={key2} fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};
export default BarChartCom;
