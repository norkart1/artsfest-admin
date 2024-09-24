// AddBrokerForm.js
import React, { useContext, useState, useEffect } from 'react'
import {
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  FormLabel,
  FormGroup,
  MenuItem,
} from '@mui/material'
import { CrudTeamContext } from '../../Context/teamContext'
import { CrudProgramContext } from '../../Context/programContext'

const AddBrokerForm = ({ open, setOpen }) => {
  const { addteam } = useContext(CrudTeamContext)
  const { fetchPrograms } = useContext(CrudProgramContext)

  const [imagePreview, setImagePreview] = useState(null)
  const [nameError, setNameError] = useState('')
  const [rankingError, setRankingError] = useState('')
  const [linkError, setLinkError] = useState('')
  const [locationError, setLocationError] = useState('')
  const [scoreError, setScoreError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    ranking: '',
    score: '',
    program: '',
    image: null,
    imagePreviewUrl: '',
    isSingle: false,
    isGroup: false,
  })

  const [allPrograms, setAllPrograms] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchPrograms()
      setAllPrograms(fetchedData)
    }
    fetchData()
  }, [fetchPrograms])

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
          setNameError('Team name is required')
        }
        break
      case 'ranking':
        if (!value.trim()) {
          setRankingError('Team Ranking is required')
        }
        break
      // case 'location':
      //   if (!value.trim()) {
      //     setLocationError('Broker Location is required')
      //   }
      //   break

      // case 'link':
      //   if (!value.trim()) {
      //     setLinkError('Broker Link is required')
      //   }
      //   break

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

    const isScoreValid = validateScore(formData.score)

    if (!isNameValid || !isRankingValid || !isScoreValid) {
      return
    }

    try {
      const formDataToSend = new FormData()
      for (let key in formData) {
        formDataToSend.append(key, formData[key])
      }

      addteam(formDataToSend)

      // Reset form after submission
      setFormData({
        name: '',
        ranking: '',
        score: '',
        program: '',
        imagePreviewUrl: '',
        image: null,
      })

      setImagePreview(null)
      setOpen(false)
    } catch (error) {
      console.error('Error adding Team:', error)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      ranking: '',
      score: '',
      program: '',
      imagePreviewUrl: '',
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
                <TextField
                  fullWidth
                  label="Score"
                  name="score"
                  variant="outlined"
                  margin="normal"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Typography color="error" variant="body2">
                  {scoreError}
                </Typography>
              </Grid>

              {/* Select dropdown for programs */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="program-select-label">Program</InputLabel>
                  <Select
                    labelId="program-select-label"
                    id="program-select"
                    value={formData.program || ''}
                    label="Program"
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  >
                    {allPrograms.map((program) => (
                      <MenuItem key={program.value} value={program.value}>
                        {program.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Checkboxes for Single/Group */}
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Category</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isSingle}
                          onChange={(e) => setFormData({ ...formData, isSingle: e.target.checked })}
                          name="isSingle"
                        />
                      }
                      label="Single"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isGroup}
                          onChange={(e) => setFormData({ ...formData, isGroup: e.target.checked })}
                          name="isGroup"
                        />
                      }
                      label="Group"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>

              {/* Image Upload */}
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

              {/* Submit / Cancel Buttons */}
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
