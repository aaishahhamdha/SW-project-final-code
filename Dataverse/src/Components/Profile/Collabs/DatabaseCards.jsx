import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DatabaseCards.css';

const DatabaseCards = () => {
  const [collaboratedDatabases, setCollaboratedDatabases] = useState([]);
  const [ownerData, setOwnerData] = useState({});

  useEffect(() => {
    const fetchCollaboratedDatabases = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/database-collabs/", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        const databaseIds = response.data;
        const databaseRequests = databaseIds.map((id) =>
          axios.get(`http://localhost:8000/api/view-database/${id}/`)
        );
        const responses = await Promise.all(databaseRequests);
        const databases = responses.map((response) => response.data);

        // Fetch owners' data
        const ownerRequests = databases.map((db) =>
          axios.get(`http://localhost:8000/api/users/${db.owner}/`)
        );
        const ownerResponses = await Promise.all(ownerRequests);
        
        // Map the owner details
        const owners = ownerResponses.reduce((acc, response) => {
          const { id, email, first_name, last_name, username } = response.data;
          const fullName = first_name && last_name ? `${first_name} ${last_name}` : username;
          acc[id] = {
            email,
            name: fullName,
          };
          return acc;
        }, {});

        setCollaboratedDatabases(databases);
        setOwnerData(owners);
      } catch (error) {
        console.error("Error fetching collaborated databases or owners: ", error);
      }
    };

    fetchCollaboratedDatabases();
  }, []);

  return (
    <div>
      <h1 className="collabs-title">My Collaborations</h1>
      <div className="database-cards-container2">
        {collaboratedDatabases.length === 0 ? (
          <p>No collaborations yet</p>
        ) : (
          collaboratedDatabases.map((db) => (
            <div key={db.id} className="database-card2">
              <h3>{db.name}</h3>
              <p className="owner-name2">{ownerData[db.owner]?.name}</p>
              <p className="owner-email2">Owner:{ownerData[db.owner]?.email}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DatabaseCards;
