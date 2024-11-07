import React, { useState, useEffect } from 'react';
import './UserProfile.css';

interface UserProfileProps {
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  variant?: number; // Optional variant prop for different styles
}

const UserProfile: React.FC<UserProfileProps> = ({ name, email, bio, avatarUrl, variant }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState(name);
  const [editableEmail, setEditableEmail] = useState(email);
  const [editableBio, setEditableBio] = useState(bio);
  const [nameColor, setNameColor] = useState('#000000');
  const [emailColor, setEmailColor] = useState('#000000');
  const [bioColor, setBioColor] = useState('#000000');

  // Load user profile from local storage on component mount
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      const { name, email, bio } = JSON.parse(storedProfile);
      setEditableName(name);
      setEditableEmail(email);
      setEditableBio(bio);
    }
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    try {
      const userProfile = {
        name: editableName,
        email: editableEmail,
        bio: editableBio,
        avatarUrl,
      };

      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      setIsEditing(false);
      alert('Profile updated successfully!'); // Success message
    } catch (error) {
      console.error('Error saving changes to local storage:', error);
      alert('Failed to save changes. Please try again.'); // Error message
    }
  };

  return (
    <div className={`user-profile-card ${variant ? `variant-${variant}` : ''}`}>
      <img src={avatarUrl} alt={`${name}'s avatar`} className="user-avatar" />
      {isEditing ? (
        <>
          <input
            type="text"
            value={editableName}
            onChange={(e) => setEditableName(e.target.value)}
            className="user-name"
            style={{ color: nameColor }}
            placeholder="Enter your name"
          />
          <input
            type="email"
            value={editableEmail}
            onChange={(e) => setEditableEmail(e.target.value)}
            className="user-email"
            style={{ color: emailColor }}
            placeholder="Enter your email"
          />
          <textarea
            value={editableBio}
            onChange={(e) => setEditableBio(e.target.value)}
            className="user-bio"
            style={{ color: bioColor }}
            placeholder="Tell us about yourself"
          />
          <input
            type="color"
            value={nameColor}
            onChange={(e) => setNameColor(e.target.value)}
            title="Select Name Color"
          />
          <input
            type="color"
            value={emailColor}
            onChange={(e) => setEmailColor(e.target.value)}
            title="Select Email Color"
          />
          <input
            type="color"
            value={bioColor}
            onChange={(e) => setBioColor(e.target.value)}
            title="Select Bio Color"
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleEditToggle}>Cancel</button> {/* Cancel button */}
        </>
      ) : (
        <>
          <h2 className="user-name" style={{ color: nameColor }}>{editableName}</h2>
          <p className="user-email" style={{ color: emailColor }}>{editableEmail}</p>
          <p className="user-bio" style={{ color: bioColor }}>{editableBio}</p>
          <button onClick={handleEditToggle}>Edit</button>
        </>
      )}
    </div>
  );
};

export default UserProfile;
