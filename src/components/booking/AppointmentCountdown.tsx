import React, { useState, useEffect } from 'react';

// Countdown component for upcoming appointments
const AppointmentCountdown: React.FC<{ date: string; time: string; theme?: 'light' | 'dark' }> = ({ date, time, theme = 'dark' }) => {
    const getTargetDate = () => {
        const timeParts = time.match(/(\d+):(\d+)\s?(AM|PM)/i);
        if (!timeParts) return null;

        let hours = parseInt(timeParts[1], 10);
        const minutes = parseInt(timeParts[2], 10);
        const ampm = timeParts[3];

        if (ampm.toUpperCase() === 'PM' && hours < 12) {
            hours += 12;
        }
        if (ampm.toUpperCase() === 'AM' && hours === 12) { // 12 AM is 00 hours
            hours = 0;
        }

        const targetDateTime = new Date(date);
        targetDateTime.setHours(hours, minutes, 0, 0);
        return targetDateTime;
    };

    const calculateRemainingTime = () => {
        const targetDate = getTargetDate();
        if (!targetDate) return { total: -1, days: 0, hours: 0, minutes: 0 };

        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        return {
            total: difference,
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
        };
    };
    
    const [timeLeft, setTimeLeft] = useState(calculateRemainingTime());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateRemainingTime());
        }, 1000 * 60); // update every minute

        return () => clearInterval(timer);
    }, [date, time]);

    const highlightClass = theme === 'light' ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400';
    const textClass = theme === 'light' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400';
    const separatorClass = theme === 'light' ? 'text-white/40' : 'text-gray-300 dark:text-neutral-600';

    let statusElement;

    if (timeLeft.total <= 0 && timeLeft.total > -1000 * 60 * 60 * 2) { // Show "In Progress" for up to 2 hours after start time
        statusElement = <span className="font-bold text-orange-500 animate-pulse">In Progress</span>;
    } else if (timeLeft.total <= 0) {
        statusElement = null; // Don't show anything if it's long past
    } else if (timeLeft.days > 0) {
        statusElement = <span className={`font-bold ${highlightClass}`}>{`${timeLeft.days} ${timeLeft.days > 1 ? 'days' : 'day'} left`}</span>;
    } else if (timeLeft.hours > 0) {
        statusElement = <span className={`font-bold ${highlightClass}`}>{`${timeLeft.hours} ${timeLeft.hours > 1 ? 'hrs' : 'hr'} ${timeLeft.minutes} mins left`}</span>;
    } else if (timeLeft.minutes > 0) {
        statusElement = <span className={`font-bold ${highlightClass}`}>{`${timeLeft.minutes} mins left`}</span>;
    } else {
        statusElement = <span className="font-bold text-green-500">Starting soon</span>;
    }

    if (!statusElement) return null;

    return (
        <div className={`flex items-center gap-2 text-xs md:text-sm mt-1 ${textClass}`}>
            {theme === 'dark' && <span>{time}</span>}
            {theme === 'dark' && <span className={separatorClass}>•</span>}
            {statusElement}
        </div>
    );
};

export default AppointmentCountdown;