import { createContext, useState, useEffect } from 'react'
import { teamBaseUrl, imageUrl } from '../Constant/url'
import axios from 'axios'


export const CrudTeamContext = createContext()

export const CrudProvider = ({ children }) => {
  const [teams, setTeams] = useState([])

  const addteam = async (userData) => {
    console.log(userData)
    try {
      const response = await axios.post(`${teamBaseUrl}/addTeam`, userData)

      if (response.status === 200) {
        // Add the newly created teams from response data to the state
        const createdTeam = response.data
        setTeams((prevteams) => [...prevteams, createdTeam])
        //console.log('New Team added successfully:', createdteam)
      } else {
        throw new Error('Failed to add new team')
      }
    } catch (error) {
      console.error('Error adding teams:', error)
    }
  }

  // Function to fetch all Teams
  const fetchTeamData = async () => {
    try {
      // Make GET request to fetch all teams
      const response = await axios.get(`${teamBaseUrl}/getAllTeams`)
      if (response.status !== 200) {
        throw new Error('Failed to fetch teams')
      }

      

      // Extract data from response
      const teams = response.data

      // Optionally transform data logic
      const transformedTeams = teams.map((team) => ({
        ...teams,
        image: team.image ? `${imageUrl}/${team.image}` : null,
        //createdAt: new Date(team.createdAt).toLocaleString(),
        monthYear: new Date(team.createdAt).toLocaleString('default', { month: 'short' }) + ' ' + new Date(team.createdAt).getFullYear(),
      }))
  

      return response.data
    } catch (error) {
      console.error('Error fetching teams:', error)
      throw error // Rethrow the error to handle it where the function is called
    }
  }

  //Function to edit a team
  const editTeam = async (teamId, updatedData) => {
    try {
      // Make PUT request to update franchise
      const response = await axios.put(`${teamBaseUrl}/updateteamBy/${teamId}`, updatedData)
      if (response.status === 200) {
        const updatedteam = response.data
        // Update franchises state with the updated franchise
        setTeams((prevFranchises) =>
          prevFranchises.map((team) =>
            team._id === updatedteam._id ? updatedteam : team,
          ),
        )
        console.log('team updated successfully')
      } else {
        throw new Error('Failed to update team')
      }
    } catch (error) {
      console.error('Error updating team:', error)
    }
  }

  const deleteteam = async (teamId) => {
    try {
      // Make DELETE request to delete team
      const response = await axios.delete(`${teamBaseUrl}/deleteteamBy/${teamId}`)

      if (response.status === 200) {
        // Remove the deleted team from the state
        setTeams((prevteams) => prevteams.filter((team) => team._id !== teamId))
        console.log('team deleted successfully')
      } else {
        throw new Error('Failed to delete team')
      }
    } catch (error) {
      console.error('Error deleting team:', error)
    }
  }

  const contextValue = {
    addteam,
    teams,
    fetchTeamData,
    editTeam,
    deleteteam,
  }

  return <CrudTeamContext.Provider value={contextValue}>{children}</CrudTeamContext.Provider>
}
