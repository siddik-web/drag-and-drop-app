import React, { useState } from 'react';
import './UserProfile.css'; // Assuming you will create a CSS file for styling

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
  const [nameColor, setNameColor] = useState('#000000'); // Default color for name
  const [emailColor, setEmailColor] = useState('#000000'); // Default color for email
  const [bioColor, setBioColor] = useState('#000000'); // Default color for bio

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    try {
      const userProfile = {
        name: editableName,
        email: editableEmail,
        bio: editableBio,
        avatarUrl, // Assuming avatarUrl remains unchanged
      };

      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      setIsEditing(false);
      // Optionally, you can handle a success message here
    } catch (error) {
      console.error('Error saving changes to local storage:', error);
      // Optionally, show an error message to the user
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
          />
          <input
            type="email"
            value={editableEmail}
            onChange={(e) => setEditableEmail(e.target.value)}
            className="user-email"
            style={{ color: emailColor }}
          />
          <textarea
            value={editableBio}
            onChange={(e) => setEditableBio(e.target.value)}
            className="user-bio"
            style={{ color: bioColor }}
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
