import React from 'react'

const User = ({ user }) => {
    return (

        <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">{user.username}</h2>
                <p>{user.email}</p>
            </div>
        </div>
    )
}

export default User