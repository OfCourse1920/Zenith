import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '../../ui/Card';
import { useAppStore } from '../../../store/useAppStore';

const data = [
  { name: 'Mon', hours: 4 },
  { name: 'Tue', hours: 3 },
  { name: 'Wed', hours: 5 },
  { name: 'Thu', hours: 4.5 },
  { name: 'Fri', hours: 6 },
  { name: 'Sat', hours: 8 },
  { name: 'Sun', hours: 2 },
];

const colors = ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f472b6', '#fb923c', '#facc15'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-100 dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{`${label}`}</p>
        <p className="text-xs text-primary">{`Study Hours: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const StatsWidget: React.FC = () => {
    const theme = useAppStore(state => state.theme);
    const tickColor = theme === 'dark' ? '#9ca3af' : '#4b5563';
    const gridColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';

    return (
        <Card className="h-full">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Study Hours</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your progress over the last 7 days.</p>
            </div>
            <div className="h-64 px-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="name" tick={{ fill: tickColor }} tickLine={{ stroke: tickColor }} axisLine={{ stroke: tickColor }} />
                        <YAxis tick={{ fill: tickColor }} tickLine={{ stroke: tickColor }} axisLine={{ stroke: tickColor }} />
                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(100, 116, 139, 0.1)'}} />
                        <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

export default StatsWidget;