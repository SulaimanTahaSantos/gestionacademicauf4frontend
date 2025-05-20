'use client'
import { useState, useEffect } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://gestionacademicauf4backend-production.up.railway.app/api/users"
        );
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
        console.log(users);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Users List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{user.name} {user.surname}</h2>
            <p className="text-gray-600 mb-2">Email: {user.email}</p>
            <p className="text-gray-600 mb-2">DNI: {user.dni}</p>
            <p className="text-gray-600">Rol: {user.rol || 'Not specified'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}