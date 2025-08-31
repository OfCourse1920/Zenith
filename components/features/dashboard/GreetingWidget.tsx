import React, { useMemo } from 'react';
import Card from '../../ui/Card';
import { MOTIVATIONAL_QUOTES } from '../../../constants';

const GreetingWidget: React.FC = () => {
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }, []);

    const dailyQuote = useMemo(() => {
        const dayOfYear = Math.floor((new Date().valueOf() - new Date(new Date().getFullYear(), 0, 0).valueOf()) / (1000 * 60 * 60 * 24));
        return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
    }, []);

    return (
        <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-12 -left-8 w-32 h-32 bg-white/10 rounded-full" />
            <div className="relative z-10">
                <h2 className="text-3xl font-bold">{greeting}, Student!</h2>
                <p className="text-indigo-100 mt-1">Ready to be productive today? Let's get things done.</p>
                <div className="mt-6 border-t-2 border-white/20 pt-4">
                    <p className="text-sm italic">"{dailyQuote}"</p>
                </div>
            </div>
        </Card>
    );
};

export default GreetingWidget;