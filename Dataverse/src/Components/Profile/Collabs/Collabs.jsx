import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Collabs.css';
import Header from "../../header-all/Header1";
import CollaboratorCard from './CollaboratorCard'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'; 
import AddCollab from '../../Collaboration/addCollab';
import DatabaseCards from './DatabaseCards';

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};
const database_id = ""; 
const Collabs = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [user, setUser] = useState({
    id: '',
    firstName: '',
    lastName: '',
    name: '',
    gender: '',
    profilePicture: '',
  });
  const [showAddCollab, setShowAddCollab] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const profileData = await response.json();

      setUser({
        id: profileData.id,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        name: profileData.name,
        gender: profileData.gender,
        profilePicture: profileData.profilePicture,
      });
      
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchCollaboratorDetails = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/${email}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      console.log(response.data);

      return response.data;
    } catch (error) {
      console.error(`Error fetching collaborator details for ${email}`, error);
      return null;
    }
  };

  const fetchCollaborations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user-all-collaborations/', {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
     
      if (Array.isArray(response.data)) {
        const collaborationsWithDetails = await Promise.all(
          response.data.map(async (collab) => {
            const collaboratorDetailsPromises = collab.collaborators.map(async (email) => {
              const details = await fetchCollaboratorDetails(email);
              return details ? {
                fullName: `${details.firstName} ${details.lastName}`,
                username: details.name, 
                profilePicUrl: details.profilePicture,  
                email: email 
              } : { email };
            });
      
            const collaboratorsWithDetails = await Promise.all(collaboratorDetailsPromises);
            return { ...collab, collaboratorsWithDetails };
          })
        );
      
        setCollaborations(collaborationsWithDetails);
      } else {
        console.error('API did not return an array');
        setCollaborations([]);
      }
      
    } catch (error) {
      console.error('Error fetching collaborations', error);
      setCollaborations([]);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCollaborations();
  }, []);

  const handleAddCollaborators = () => {
    setShowAddCollab(true);
  };

  const handleCloseCollab = () => {
    setShowAddCollab(false);
  };



  return (
    <div>
      <Header 
        firstName={user.firstName || user.name} 
        lastName={user.lastName} 
        userName={user.name} 
      />
      {showAddCollab && (
        <div className="modal-background">
          <div className="modal-content">
            <AddCollab database_id={database_id} onClose={handleCloseCollab} />
          </div>
        </div>
      )}
      <div className="collabs-container">
        <h1 className="collabs-title">All Collaborators</h1>
        <table className="collabs-table">
          <thead>
            <tr>
              <th>Database Name</th>
              <th>Collaborators</th>
            </tr>
          </thead>
          <tbody>
            {collaborations.length > 0 ? (
              collaborations.map((collab, index) => (
                <tr key={index}>
                  <td>
                    {collab.database_name}
                    <FontAwesomeIcon 
                      icon={faUserPlus} 
                      className="add-collaborator-icon"
                      onClick={handleAddCollaborators}
                    />
                  </td>
                  <td>
                    <div className="collaborators-cards-container">
                      {collab.collaboratorsWithDetails.length > 0
                        ? collab.collaboratorsWithDetails.map((collaborator, idx) => (
                            <CollaboratorCard
                              key={idx}
                              fullName={collaborator.fullName || collaborator.email}
                              username={collaborator.username}
                              profilePicUrl={collaborator.profilePicUrl}
                              email={collaborator.email}
                            />
                          ))
                        : 'No collaborators'}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No collaborations found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="collabs-container">
      <DatabaseCards/>
      </div>
    
    </div>
  );
};

export default Collabs;
