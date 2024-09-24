import { createContext, useState, useEffect } from 'react'
import { teamBaseUrl, imageUrl } from '../Constant/url'
import axios from 'axios'

export const CrudProgramContext = createContext()

export const ProgramCrudProvider = ({ children }) => {
  const [programs, setPrograms] = useState([])

  const createProgram = async (userData) => {
    try {
      const response = await axios.post(`${teamBaseUrl}/createProgram`, userData, {
        headers: { 'Content-Type': 'application/json' },
      })

      console.log('respose', response)

      if (response.status === 201) {
        // Add the newly created programs from response data to the state
        const createdTeam = response.data

        console.log('cretedteam', createdTeam)
        setPrograms((prevprograms) => [...prevprograms, createdTeam])
        //console.log('New Team added successfully:', createdteam)
      } else {
        throw new Error('Failed to add new team')
      }
    } catch (error) {
      console.error('Error adding programs:', error)
    }
  }

  // Function to fetch all programs
  const fetchPrograms = async () => {
    try {
      // Make GET request to fetch all programs
      const response = await axios.get(`${teamBaseUrl}/getAllPrograms`)
      if (response.status !== 200) {
        throw new Error('Failed to fetch programs')
      }

      return response.data
    } catch (error) {
      console.error('Error fetching programs:', error)
      throw error // Rethrow the error to handle it where the function is called
    }
  }

  //Function to edit a team
  const editProgram = async (programValue, newLabel) => {
    try {
      // Make PUT request to update franchise
      console.log('up', updatedData)
      const response = await axios.put(`${teamBaseUrl}/updateProgram/${teamId}`, updatedData)
      if (response.status === 200) {
        const updatedteam = response.data
        // Update franchises state with the updated franchise
        setPrograms((prevFranchises) =>
          prevFranchises.map((team) => (team._id === updatedteam._id ? updatedteam : team)),
        )
        console.log('team updated successfully')
      } else {
        throw new Error('Failed to update team')
      }
    } catch (error) {
      console.error('Error updating team:', error)
    }
  }

  const deleteProgramById = async (teamId) => {
    try {
      // Make DELETE request to delete team
      const response = await axios.delete(`${teamBaseUrl}/deleteProgramById/${teamId}`)

      if (response.status === 200) {
        // Remove the deleted team from the state
        setPrograms((prevprograms) => prevprograms.filter((team) => team._id !== teamId))
        console.log('team deleted successfully')
      } else {
        throw new Error('Failed to delete team')
      }
    } catch (error) {
      console.error('Error deleting team:', error)
    }
  }

  const contextValue = {
    fetchPrograms,
    programs,
    deleteProgramById,
    createProgram,
    editProgram,
  }

  return <CrudProgramContext.Provider value={contextValue}>{children}</CrudProgramContext.Provider>
}
