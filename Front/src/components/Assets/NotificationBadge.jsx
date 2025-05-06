import React from 'react';

const NotificationBadge = ({ count }) => {
    return (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                {count}
            </div>
        </div>
    );
};

export default NotificationBadge; 