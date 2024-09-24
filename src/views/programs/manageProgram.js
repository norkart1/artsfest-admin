import React, { useState, useEffect, useContext } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import Swal from 'sweetalert2'

import { CrudProgramContext } from '../../Context/programContext'

const ProgramManage = () => {
  const { fetchPrograms, createProgram, deleteProgramById } = useContext(CrudProgramContext)

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [alertMessage, setAlertMessag] = useState(null)

  const [newprogram, setNewprogram] = useState('')

  const [allPrograms, setAllPrograms] = useState([])

  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchPrograms()
      setAllPrograms(fetchedData)
    }
    fetchData()
  }, [fetchPrograms])

  const addprogram = async () => {
    // Validation checks
    if (!newprogram) {
      Swal.fire({
        icon: 'error',
        title: 'Please enter a program name',
        showConfirmButton: true,
        timer: 1500,
      })
      return // Exit function if validation fails
    }

    let formData = { value: newprogram, label: newprogram }

    try {
      await createProgram(formData)
      Swal.fire({
        icon: 'success',
        title: 'New program added successfully!',
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (error) {
      console.error('Error adding program:', error)
      Swal.fire({
        icon: 'error',
        title: 'Failed to add program',
        text: error.message || 'An unexpected error occurred',
        showConfirmButton: true,
      })
    }
  }

  const handleDeleteprogram = (id) => {
    if (id) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          deleteProgramById(id)
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'program deleted successfully!',
                showConfirmButton: false,
                timer: 1500, // Close alert after 1.5 seconds
              })
            })
            .catch((error) => {
              // Handle errors if needed
              console.error('Error deleting program:', error)
            })
        }
      })
    }
  }

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h1
        style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '24px',
        }}
      >
        Program Management
      </h1>

      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          width: '50%',
        }}
      >
        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={searchTerm}
            style={{
              width: '100%',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none',
              fontSize: '16px',
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search programs"
          />
        </div>
      </div>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="warning" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ marginBottom: '16px' }}>
          <input
            name="program"
            type="text"
            value={newprogram}
            onChange={(e) => setNewprogram(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none',
              fontSize: '16px',
            }}
            placeholder="New program"
          />
        </div>

        <button
          onClick={addprogram}
          style={{
            fontSize: '16px',
            fontWeight: '500',
            padding: '12px 16px',
            width: '100%',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
        >
          Add Program
        </button>
      </div>

      <div style={{ marginBottom: '32px' }}>
        {allPrograms?.map((program) => (
          <div
            key={program.value}
            style={{
              backgroundColor: '#fff',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              marginBottom: '32px',
              transition: 'box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)')
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)')}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#333',
                }}
              >
                {program.label}
              </span>

              <button
                onClick={() => handleDeleteprogram(program._id)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#c82333')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#dc3545')}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgramManage
