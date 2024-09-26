import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { teamBaseUrl } from '../../Constant/url';
import Swal from 'sweetalert2';



const AddTeamToProgram = () => {
  const [teams, setTeams] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [score, setScore] = useState('');
  const [rank, setRank] = useState('');
  const [isSingle, setIsSingle] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTeams();
    fetchPrograms();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${teamBaseUrl}/getAllteams`);
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${teamBaseUrl}/getAllPrograms`);
      setPrograms(response.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Construct the request payload
    const payload = {
      teamId: selectedTeam,
      programId: selectedProgram,
      score: parseInt(score),
      rank: parseInt(rank),
      isSingle,
      isGroup,
    };
  
    try {
      const response = await axios.post(`${teamBaseUrl}/addTeamToProgram`, payload);
  
      // If successful, show success alert
      Swal.fire({
        title: 'Success!',
        text: 'Team added to program successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
  
      setMessage(response.data.message);
      setScore("");
      setIsGroup(false);
      setIsSingle(false);
      setScore("");
      setRank("");
    } catch (error) {
      console.error('Error adding team to program:', error);
      setMessage('Error adding team to program.');
  
      // If error occurs, show error alert
      Swal.fire({
        title: 'Error!',
        text: 'There was a problem adding the team to the program.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const formGroupStyle = {
    marginBottom: '15px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '8px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
  };

  const checkboxStyle = {
    marginRight: '10px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const buttonHoverStyle = {
    backgroundColor: '#45a049',
  };

  const messageStyle = {
    marginTop: '20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: message.includes('Error') ? 'red' : 'green',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center' }}>Add Team to Program</h2>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Team</label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">Select a team</option>
            {teams?.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Program</label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">Select a program</option>
            {programs?.map((program) => (
              <option key={program._id} value={program._id}>
                {program.label}
              </option>
            ))}
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Score</label>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
            min="0"
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Rank</label>
          <input
            type="number"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            required
            min="0"
            style={inputStyle}
          />
        </div>

        {/* Add isSingle and isGroup checkboxes */}
        <div style={formGroupStyle}>
          <label style={labelStyle}>Team Type</label>
          <div>
            <label>
              <input
                type="checkbox"
                checked={isSingle}
                onChange={(e) => setIsSingle(e.target.checked)}
                style={checkboxStyle}
              />
              Is Single
            </label>
            <label>
              <input
                type="checkbox"
                checked={isGroup}
                onChange={(e) => setIsGroup(e.target.checked)}
                style={checkboxStyle}
              />
              Is Group
            </label>
          </div>
        </div>

        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
        >
          Submit
        </button>
      </form>

      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
};

export default AddTeamToProgram;
