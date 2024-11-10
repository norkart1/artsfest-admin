import React, { useContext, useState, useEffect } from 'react'
import {
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material'
import { CrudTeamContext } from '../../Context/teamContext'
import { CrudProgramContext } from '../../Context/programContext'

const AddBrokerForm = ({ open, setOpen }) => {
  const { addTeam } = useContext(CrudTeamContext)
  const { fetchPrograms } = useContext(CrudProgramContext)

  const [nameError, setNameError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      await fetchPrograms()
    }
    fetchData()
  }, [fetchPrograms])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })

    // Validate input value after each change
    validateName(value)
  }

  const handleBlur = (e) => {
    const { name, value } = e.target

    switch (name) {
      case 'name':
        if (!value.trim()) {
          setNameError('Team name is required')
        }
        break

      default:
        break
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const isNameValid = validateName(formData.name)

    if (!isNameValid) {
      return
    }

    try {
      await addTeam(formData)

      // Reset form after submission
      setFormData({
        name: '',
      })

      setOpen(false)
    } catch (error) {
      console.error('Error adding Team:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
    })
    setOpen(false)
  }

  // Validation setup
  const validateName = (name) => {
    if (!name.trim()) {
      setNameError('Name is required')
      return false
    }
    setNameError('')
    return true
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Add Team
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Team Name"
                  name="name"
                  variant="outlined"
                  margin="normal"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Typography color="error" variant="body2">
                  {nameError}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Save Changes
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddBrokerForm
