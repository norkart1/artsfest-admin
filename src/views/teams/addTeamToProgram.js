import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { teamBaseUrl } from '../../Constant/url'

const AddTeamToProgram = () => {
  const [teams, setTeams] = useState([])
  const [programs, setPrograms] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('')
  const [score, setScore] = useState('')
  const [message, setMessage] = useState('')

  // Fetch teams and programs when the component mounts
  useEffect(() => {
    fetchTeams()
    fetchPrograms()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${teamBaseUrl}/getAllteams`) // Update the endpoint as per your API
      setTeams(response.data)
    } catch (error) {
      console.error('Error fetching teams:', error)
    }
  }

  const fetchPrograms = async () => {
    try {
      const response = await axios.get(`${teamBaseUrl}/getAllPrograms`) // Update the endpoint as per your API
      setPrograms(response.data)
    } catch (error) {
      console.error('Error fetching programs:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Construct the request payload
    const payload = {
      teamId: selectedTeam,
      programId: selectedProgram,
      score: parseInt(score), // Ensure the score is an integer
    }

    try {
      const response = await axios.post(`${teamBaseUrl}/addTeamToProgram`, payload) // Update the endpoint as per your API
      setMessage(response.data.message)
    } catch (error) {
      console.error('Error adding team to program:', error)
      setMessage('Error adding team to program.')
    }
  }

  const containerStyle = {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  }

  const formGroupStyle = {
    marginBottom: '15px',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '8px',
  }

  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
  }

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
  }

  const buttonHoverStyle = {
    backgroundColor: '#45a049',
  }

  const messageStyle = {
    marginTop: '20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: message.includes('Error') ? 'red' : 'green',
  }

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
  )
}

export default AddTeamToProgram
