'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function UserSettings() {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [deletePassword, setDeletePassword] = useState('');
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data.username) {
                    setUsername(response.data.username);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('New passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/changepassword', {
                currentPassword,
                newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setMessage('Password changed successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            setMessage('Failed to change password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDeleteLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/deleteuser', {
                password: deletePassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                localStorage.removeItem('token');
                window.dispatchEvent(new Event('authStateChange'));
                router.push('/signin');
            }
        } catch (error) {
            setMessage('Failed to delete account. Please check your password.');
        } finally {
            setIsDeleteLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('authStateChange'));
        router.push('/signin');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">User Settings</h1>
                
                {username && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700">Welcome, {username}</h2>
                    </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 mb-8">
                    <h3 className="text-lg font-semibold text-gray-700">Change Password</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black p-2"
                            required
                        />
                    </div>

                    {message && (
                        <p className={`text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </p>
                    )}

                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-black text-white rounded hover:bg-slate-600 disabled:opacity-50"
                        >
                            {isLoading ? 'Changing Password...' : 'Change Password'}
                        </button>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </form>

                <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Delete Account</h3>
                    <form onSubmit={handleDeleteAccount} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enter Password to Delete Account</label>
                            <input
                                type="password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black p-2"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isDeleteLoading}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                            {isDeleteLoading ? 'Deleting Account...' : 'Delete Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
} 