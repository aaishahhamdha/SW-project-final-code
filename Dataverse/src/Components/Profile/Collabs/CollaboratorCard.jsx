import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Import the cross icon
import './CollaboratorCard.css'; 

const CollaboratorCard = ({ fullName, username, profilePicUrl, email, onRemove }) => {
  const imageUrl = profilePicUrl ? `http://localhost:8000${profilePicUrl}` : 'default-profile-pic-url.jpg';

  return (
    <div className="collaborator-card">
      <img 
        src={imageUrl} 
        alt={`${fullName || username}'s profile`} 
        className="collaborator-card-img" 
      />
      <div className="collaborator-card-details">
        <h4>{fullName || username}</h4>
        <p>{email}</p>
      </div>
      <button 
        className="remove-collaborator-btn" 
        onClick={onRemove} // Handle removal
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default CollaboratorCard;
