import React, { useContext,useState,useEffect } from 'react'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cibSuperuser,
} from '@coreui/icons'

import WidgetsDropdown from '../widgets/WidgetsDropdown'


import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { CrudBrokerContext } from '../../Context/brokerContext'

const Dashboard = () => {
  const { fetchBrokerData } = useContext(CrudBrokerContext);
  const [brokers, setBrokers] = useState([]);
  const [loading, setIsLoading] = useState(true);

  

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchBrokerData();

      const sortedBrokers = fetchedData.sort((a, b) => a.ranking - b.ranking);
      setBrokers(sortedBrokers);
      setIsLoading(false); // Set isLoading to false after fetching data
    };
    fetchData();
  }, [fetchBrokerData]); // Make sure to include fetchFranchises in the dependency array

   
  return (
    <>
      <WidgetsDropdown className="mb-4" />
      
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader style={{ fontSize:30}}>Top 10 Brokers</CCardHeader>
            <CCardBody>
              

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cibSuperuser} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Broker</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Country
                    </CTableHeaderCell>
                    {/* <CTableHeaderCell className="bg-body-tertiary">Usage</CTableHeaderCell> */}
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Rank
                    </CTableHeaderCell>
                    {/* <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell> */}
                    <CTableHeaderCell className="bg-body-tertiary text-center">Link</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                {loading ? (
  // Render skeleton rows while data is being fetched
  Array.from({ length: 10 }).map((_, index) => (
    <CTableRow key={index}>
      <CTableDataCell className="text-center">
        <Skeleton circle={true} height={40} width={40} />
      </CTableDataCell>
      <CTableDataCell>
        <Skeleton height={20} width={`80%`} />
      </CTableDataCell>
      <CTableDataCell className="text-center">
        <Skeleton height={20} width={`60%`} />
      </CTableDataCell>
      <CTableDataCell className="text-center">
        <Skeleton height={20} width={`40%`} />
      </CTableDataCell>
      <CTableDataCell className="text-center">
        <Skeleton height={20} width={`80%`} />
      </CTableDataCell>
    </CTableRow>
  ))
) : (
  // Render actual data once it's loaded
  brokers.slice(0, 10).map((item, index) => (
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
      {/* Wrap the link in an anchor tag to make it clickable */}
      <a href={item.link} target="_blank" rel="noopener noreferrer">
        {item.link}
      </a>
    </CTableDataCell>
    </CTableRow>
  ))
)}

              </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
