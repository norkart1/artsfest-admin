import { createContext, useState, useEffect } from 'react'
import { brokerBaseUrl, imageUrl } from '../Constant/url'
import axios from 'axios'


export const CrudBrokerContext = createContext()

export const CrudProvider = ({ children }) => {
  const [brokers, setBrokers] = useState([])

  const addBroker = async (userData) => {
    console.log(userData)
    try {
      const response = await axios.post(`${brokerBaseUrl}/addBroker`, userData)

      if (response.status === 200) {
        // Add the newly created brokers from response data to the state
        const createdBroker = response.data
        setBrokers((prevBrokers) => [...prevBrokers, createdBroker])
        console.log('New Broker added successfully:', createdBroker)
      } else {
        throw new Error('Failed to add new broker')
      }
    } catch (error) {
      console.error('Error adding brokers:', error)
    }
  }

  // Function to fetch all Brokers
  const fetchBrokerData = async () => {
    try {
      // Make GET request to fetch all brokers
      const response = await axios.get(`${brokerBaseUrl}/getAllBrokers`)
      if (response.status !== 200) {
        throw new Error('Failed to fetch brokers')
      }

      // Extract data from response
      const brokers = response.data

      // Optionally transform data logic
      const transformedBrokers = brokers.map((broker) => ({
        ...broker,
        image: broker.image ? `${imageUrl}/${broker.image}` : null,
        //createdAt: new Date(broker.createdAt).toLocaleString(),
        monthYear: new Date(broker.createdAt).toLocaleString('default', { month: 'short' }) + ' ' + new Date(broker.createdAt).getFullYear(),
      }))

      return transformedBrokers
    } catch (error) {
      console.error('Error fetching brokers:', error)
      throw error // Rethrow the error to handle it where the function is called
    }
  }

  //Function to edit a broker
  const editBroker = async (brokerId, updatedData) => {
    try {
      // Make PUT request to update franchise
      const response = await axios.put(`${brokerBaseUrl}/updateBrokerBy/${brokerId}`, updatedData)
      if (response.status === 200) {
        const updatedBroker = response.data
        // Update franchises state with the updated franchise
        setBrokers((prevFranchises) =>
          prevFranchises.map((broker) =>
            broker._id === updatedBroker._id ? updatedBroker : broker,
          ),
        )
        console.log('Broker updated successfully')
      } else {
        throw new Error('Failed to update Broker')
      }
    } catch (error) {
      console.error('Error updating Broker:', error)
    }
  }

  const deleteBroker = async (brokerId) => {
    try {
      // Make DELETE request to delete broker
      const response = await axios.delete(`${brokerBaseUrl}/deleteBrokerBy/${brokerId}`)

      if (response.status === 200) {
        // Remove the deleted broker from the state
        setBrokers((prevBrokers) => prevBrokers.filter((broker) => broker._id !== brokerId))
        console.log('Broker deleted successfully')
      } else {
        throw new Error('Failed to delete Broker')
      }
    } catch (error) {
      console.error('Error deleting Broker:', error)
    }
  }

  const contextValue = {
    addBroker,
    brokers,
    fetchBrokerData,
    editBroker,
    deleteBroker,
  }

  return <CrudBrokerContext.Provider value={contextValue}>{children}</CrudBrokerContext.Provider>
}
