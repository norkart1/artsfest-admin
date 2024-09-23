import React, { useContext, useEffect, useState } from 'react'
import {
  CAvatar,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cibSuperuser } from '@coreui/icons'
import { CrudBrokerContext } from '../../Context/brokerContext'
import Pagination from 'react-js-pagination' // Import pagination component

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function AllBrokers() {
  const { fetchBrokerData } = useContext(CrudBrokerContext)
  const [brokers, setBrokers] = useState([])
  const [loading, setIsLoading] = useState(true)
  const [activePage, setActivePage] = useState(1) // State to manage the active page
  const itemsPerPage = 10 // Number of items per page

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchBrokerData()
      const sortedBrokers = fetchedData.sort((a, b) => a.ranking - b.ranking)

      setBrokers(sortedBrokers)
      setIsLoading(false) // Set isLoading to false after fetching data
    }
    fetchData()
  }, [fetchBrokerData]) // Make sure to include fetchFranchises in the dependency array

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber)
  }

  // Calculate the indexes for the current page
  const startIndex = (activePage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  return (
    <div>
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead className="text-nowrap">
          <CTableRow>
            <CTableHeaderCell className="bg-body-tertiary text-center">
              <CIcon icon={cibSuperuser} />
            </CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary">Broker Name</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary text-center">Country</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary text-center">Rank</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary text-center">Score</CTableHeaderCell>
            <CTableHeaderCell className="bg-body-tertiary text-center">Link</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {loading
            ? // Render skeleton rows while data is being fetched
            Array.from({ length: 5 }).map((_, index) => (
              <CTableRow key={index}>
                <CTableDataCell className="text-center">
                  <Skeleton circle={true} height={40} width={40} />
                </CTableDataCell>
                <CTableDataCell>
                  <Skeleton height={20} />
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <Skeleton height={20} />
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <Skeleton height={20} />
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <Skeleton height={20} />
                </CTableDataCell>
              </CTableRow>
            ))
            : // Render actual data once it's loaded
            brokers.slice(startIndex, endIndex).map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell className="text-center">
                  <CAvatar size="md" src={item.image} />
                </CTableDataCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell className="text-center">{item.location}</CTableDataCell>
                <CTableDataCell className="text-center">
                  <div className="fw-semibold">{item.ranking}</div>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  <div className="fw-semibold">{item.score}</div>
                </CTableDataCell>
                <CTableDataCell className="text-center">
                  {/* Wrap the link in an anchor tag to make it clickable */}
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.link}
                  </a>
                </CTableDataCell>
              </CTableRow>
            ))}
        </CTableBody>
      </CTable>
      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <Pagination
          activePage={activePage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={brokers.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        />
      </div>
    </div>
  )
}

export default AllBrokers
