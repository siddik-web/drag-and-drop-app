import React from 'react';
import './UserProfile.css'; // Assuming you will create a CSS file for styling

interface UserProfileProps {
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  variant?: number; // Optional variant prop for different styles
}

const UserProfile: React.FC<UserProfileProps> = ({ name, email, bio, avatarUrl, variant }) => {
  return (
    <div className={`user-profile-card ${variant ? `variant-${variant}` : ''}`}>
      <img src={avatarUrl} alt={`${name}'s avatar`} className="user-avatar" />
      <h2 className="user-name">{name}</h2>
      <p className="user-email">{email}</p>
      <p className="user-bio">{bio}</p>
    </div>
  );
};

export default UserProfile;
