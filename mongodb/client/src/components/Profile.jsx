import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const getUserId = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        return user._id;
    }
    return null;
};

function Profile() {
    const { user } = useAuth();
    const user_id = getUserId();
    const navigate = useNavigate();

    const [preferences, setPreferences] = useState({
        notificationFrequency: user?.preferences?.notificationFrequency || 'daily',
        preferredUnits: user?.preferences?.preferredUnits || 'metric',
    });

    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState({ type: '', text: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false); // New state for toggling password form

    if (!user) {
        navigate('/login');
        return null;
    }

    const handlePreferenceChange = (e) => {
        setPreferences({
            ...preferences,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
            message: `Password must be at least ${minLength} characters long and contain uppercase, lowercase, numbers, and special characters`
        };
    };

    const handlePreferenceSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5002/api/users/${user_id}/preferences`, preferences);
            setMessage({ type: 'success', text: 'Preferences updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Error updating preferences. Please try again.' });
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setIsLoading(true);

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            setIsLoading(false);
            return;
        }

        const passwordValidation = validatePassword(passwords.newPassword);
        if (!passwordValidation.isValid) {
            setMessage({ type: 'error', text: passwordValidation.message });
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5002/api/users/${user_id}/change-password`, {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword
            });

            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswords({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setShowPasswordForm(false); // Hide form after successful change
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error changing password. Please try again.';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <img 
                alt="profile"
                src="https://i.pinimg.com/736x/9e/41/dd/9e41dd56f7a091cf4df76aed668db4fc.jpg" 
                style={{ height: '150px', width: '150px', borderRadius: '50%', border: '2px solid gray' }}
            />
            <h1 style={{ color: "black" }}>Welcome, {user.username}</h1>
            <p>Email: {user.email}</p>

            <h2 style={{ color: "black" }}>Update Preferences</h2>
            <form onSubmit={handlePreferenceSubmit}>
                <label>
                    Notification Frequency:
                    <select
                        name="notificationFrequency"
                        value={preferences.notificationFrequency}
                        onChange={handlePreferenceChange}
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </label>
                <br />
                <label>
                    Preferred Units:
                    <select
                        name="preferredUnits"
                        value={preferences.preferredUnits}
                        onChange={handlePreferenceChange}
                    >
                        <option value="metric">Metric</option>
                        <option value="imperial">Imperial</option>
                    </select>
                </label>
                <br />
                <button type="submit">Update Preferences</button>
            </form>

            {message.text && (
                <div style={{ 
                    color: message.type === 'success' ? 'green' : 'red', 
                    fontWeight: 'bold' 
                }}>
                    {message.text}
                </div>
            )}

            <h2 style={{ color: "black" }}>Change Password</h2>
            {!showPasswordForm ? (
                <button 
                    onClick={() => setShowPasswordForm(true)}
                    style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                >
                    Change Password
                </button>
            ) : (
                <form onSubmit={handlePasswordSubmit}>
                    <label>
                        Old Password:
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwords.oldPassword}
                            onChange={handlePasswordChange}
                            required
                            disabled={isLoading}
                        />
                    </label>
                    <br />
                    <label>
                        New Password:
                        <input
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handlePasswordChange}
                            required
                            disabled={isLoading}
                        />
                    </label>
                    <br />
                    <label>
                        Confirm New Password:
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            disabled={isLoading}
                        />
                    </label>
                    <br />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Changing Password...' : 'Change Password'}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setShowPasswordForm(false)}
                        style={{ marginLeft: '10px' }}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                </form>
            )}
        </div>
    );
}

export default Profile;