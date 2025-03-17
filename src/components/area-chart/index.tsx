import { FC } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type TProps = {
  data: any[];
  key1: string;
  key2: string;
};
const AreaChartCom: FC<TProps> = ({ data, key1, key2 }) => {
  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={key1} />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey={key2} stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartCom;
