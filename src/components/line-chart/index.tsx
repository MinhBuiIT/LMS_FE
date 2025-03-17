import { FC } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type TProps = {
  data: any[];
  key1: string;
  key2: string;
};
const LineChartCom: FC<TProps> = ({ data, key1, key2 }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
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
        <Line type="monotone" dataKey={key2} stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartCom;
