import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TableView.css';

const TableView = ({ database_id }) => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dbServer, setDbServer] = useState("");
    const [dbName, setDbName] = useState("");
    const [dbUser, setDbUser] = useState("");
    const [dbPassword, setDbPassword] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/view-database/${database_id}/`);
                console.log("new"+response.data);
                setDbServer(response.data.server);
                setDbName(response.data.database);
                setDbUser(response.data.user);
                setDbPassword(response.data.password);
            } catch (error) {
                console.error("Error fetching database details:", error);
            }
        };

        fetchData();
    }, [database_id]);

    useEffect(() => {
        const fetchTables = async () => {
            if (dbServer && dbName && dbUser && dbPassword) {
                try {
                    const response = await axios.post('http://localhost:8000/api/list-tables/', {
                        "db_details": {
                            "db_name": dbName,
                            "db_user": dbUser,
                            "db_password": dbPassword,
                            "db_host": dbServer
                        }
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,  
                    });
                    setTables(response.data.tables);
                    setLoading(false);
                } catch (err) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        fetchTables();
    }, [dbServer, dbName, dbUser, dbPassword]);

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">Error: {error}</p>;

    return (
        <div>
            {tables.map((table, index) => (
                <div key={index} className="table-container">
                    <h2 className='tname'>Table Name: {table.table_name}</h2>
                    <h3 className='tdata'>Data</h3>
                    <table className='mytable '>
                        <thead>
                            <tr className='trr'>
                                {table.columns.map((column, colIndex) => (
                                    <th className='thh' key={colIndex}>{column.Field}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {table.data.map((row, rowIndex) => (
                                <tr className='trr' key={rowIndex}>
                                    {table.columns.map((column, colIndex) => (
                                        <td className='tdd' key={colIndex}>{row[column.Field]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default TableView;
