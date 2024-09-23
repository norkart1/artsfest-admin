// AddBrokerForm.js
import React, { useContext, useState } from 'react'
import {
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
} from '@mui/material'
import { CrudTeamContext } from '../../Context/teamContext'

const AddBrokerForm = ({ open, setOpen }) => {
  const { addBroker } = useContext(CrudTeamContext)

  const [imagePreview, setImagePreview] = useState(null)
  const [nameError, setNameError] = useState('')
  const [rankingError, setRankingError] = useState('')
  const [linkError, setLinkError] = useState('')
  const [locationError, setLocationError] = useState('')
  const [scoreError, setScoreError] = useState('')


  const [formData, setFormData] = useState({
    name: '',
    ranking: 0, // Initialize ranking as a number default 0;
    image: null,
    imagePreviewUrl: '',
    link: '',
    score: '',
    location: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: name === 'ranking' ? parseInt(value, 10) || '' : value, // Handle NaN by setting empty string
    })

    // Validate input value after each change
    switch (name) {
      case 'name':
        validateName(value)
        break
      case 'ranking':
        validateRanking(value)
        break
      case 'link':
        validateLink(value)
        break
      case 'location':
        validateLocation(value)
        break
      case 'score':
        validateScore(value)
        break
      default:
        break
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target

    // Reset corresponding error when the user types
    switch (name) {
      case 'name':
        if (!value.trim()) {
          setNameError('Broker name is required')
        }
        break
      case 'ranking':
        if (!value.trim()) {
          setRankingError('Broker Ranking is required')
        }
        break
      case 'location':
        if (!value.trim()) {
          setLocationError('Broker Location is required')
        }
        break

      case 'link':
        if (!value.trim()) {
          setLinkError('Broker Link is required')
        }
        break

      default:
        break
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    const maxSizeInBytes = 2 * 1024 * 1024 // 2MB (adjust as needed)
    if (file.size > maxSizeInBytes) {
      alert('File size exceeds the maximum allowed limit (2MB). Please select a smaller file.')
    } else {
      setFormData({ ...formData, image: file })

      // Display image preview
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const isNameValid = validateName(formData.name)
    const isRankingValid = validateRanking(formData.ranking)
    const isLocationValid = validateLocation(formData.location)
    const isLinkValid = validateLink(formData.link)
    const isScoreValid = validateScore(formData.score)

    if (!isNameValid || !isRankingValid || !isLocationValid || !isLinkValid || !isScoreValid) {
      return
    }

    try {
      const formDataToSend = new FormData()
      for (let key in formData) {
        formDataToSend.append(key, formData[key])
      }

      addBroker(formDataToSend)

      // Reset form after submission
      setFormData({
        name: '',
        ranking: '',
        location: '',
        link: '',
        image: null,
      })

      setImagePreview(null)
      setOpen(false)
    } catch (error) {
      console.error('Error adding Broker:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      ranking: '',
      location: '',
      link: '',
      image: null,
    })
    setImagePreview(null)
    setOpen(false)
  }

  //validation setup here;

  const validateName = (name) => {
    if (!name.trim()) {
      setNameError('Name is required')
      return false
    }
    setNameError('')
    return true
  }

  const validateRanking = (ranking) => {
    if (!ranking && ranking !== 0) {
      setRankingError('Ranking is required')
      return false
    }
    if (isNaN(ranking) || !Number.isInteger(parseInt(ranking))) {
      setRankingError('Ranking must be a valid number')
      return false
    }
    setRankingError('')
    return true
  }

  const validateLocation = (location) => {
    if (!location.trim()) {
      setLocationError('Location is required')
      return false
    }
    setLocationError('')
    return true
  }

  const validateLink = (link) => {
    // Check if the link is empty after trimming
    if (!link.trim()) {
      setLinkError('Link is required') // Set the error message
      return false
    }

    try {
      // Create a new URL object with the link
      const url = new URL(link)
      return true
    } catch (error) {
      setLinkError('Invalid URL') // Set the error message
      return false
    }
  }


  const validateScore = (score) => {
    if (score === undefined || score === null || score === '') {
      setScoreError('Score is required')
      return false
    }
    if (isNaN(score) || parseFloat(score) < 0 || parseFloat(score) > 100) {
      setScoreError('Score must be a valid number between 0 and 100')
      return false
    }
    setScoreError('')
    return true
  }




  return (
    <div>
      <Dialog open={open}>
        <DialogContent>
          {/* Edit form section */}
          <Typography variant="h6" gutterBottom>
            Add Team
          </Typography>
          <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Broker Name"
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
                <TextField
                  fullWidth
                  label="Ranking"
                  name="ranking"
                  variant="outlined"
                  margin="normal"
                  value={formData.ranking}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="tel"
                />
                <Typography color="error" variant="body2">
                  {rankingError}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <div>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    variant="outlined"
                    margin="normal"
                    type="text" // Set input type to tel for phone numbers
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Typography color="error" variant="body2">
                    {locationError}
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Link"
                  name="link"
                  variant="outlined"
                  margin="normal"
                  type="url" // Set input type to tel for phone numbers
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Typography color="error" variant="body2">
                  {linkError}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Score"
                  name="score"
                  variant="outlined"
                  margin="normal"
                  type="text" // Set input type to tel for phone numbers
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Typography color="error" variant="body2">
                  {scoreError}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="upload-image"
                />
                <label htmlFor="upload-image">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Upload Image
                  </Button>
                </label>
              </Grid>
              {imagePreview && (
                <Grid item xs={12}>
                  <Box mt={2}>
                    <Typography variant="subtitle1">Uploaded Image Preview:</Typography>
                    <img
                      src={imagePreview}
                      alt="Uploaded"
                      style={{ maxWidth: '50%', maxHeight: '50%', height: 'auto', marginTop: 8 }}
                    />
                  </Box>
                </Grid>
              )}
              <Grid item xs={12}>
                <DialogActions>
                  <Button onClick={handleClose} variant='outline-danger'>
                    Normal
                  </Button>
                  <Button type="submit" color="primary">
                    Danger
                  </Button>
                  <Button type="submit" color="primary">
                    Warning
                  </Button>
                </DialogActions>
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
