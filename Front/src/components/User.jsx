import React from 'react'

const User = ({ user }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-96 overflow-hidden">
            <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{user.username}</h2>
                <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>
        </div>
    )
}

export default User