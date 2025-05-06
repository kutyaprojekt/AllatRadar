import { useEffect, useState, useContext } from "react"
import User from "./User";
import UserContext from "../context/UserContext";


const UserList = () => {

    const [users, setUsers] = useState([]);
    const {user} = useContext(UserContext);
    const token = localStorage.getItem("usertoken")

    const loadUsers = async () => {
        const response = await fetch("http://localhost:8000/felhasznalok/alluser", {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`

            }
        });
        const data = await response.json();
        setUsers(data);
    }

    useEffect(() => {
        loadUsers()
    }, []);

  return (
    <div className="flex flex-col gap-5 pl-5">
        <h1 className="text-3xl font-bold">Üdvözöljük <span className="text-red-600">{user.username}</span>!</h1>
        <h1 className="text-3xl font-bold justofy-center text-center mt-10">Összes felhasználó</h1>
        <div className="flex flex-wrap gap-5 justify-center items-center">
        {
            users.map((user) => (<User user={user}/>))
        }
    </div>
    </div>
    
  )
}

export default UserList