import React, { useState, useEffect, useContext } from 'react'
import {
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  SvgIcon,
} from '@mui/material'
import { cilDelete } from '@coreui/icons'

import { CrudBrokerContext } from '../../Context/brokerContext'
import { Delete, Image } from '@mui/icons-material'

const EditDialog = ({ brokersData, setOpen, open }) => {
  const { editBroker, deleteBroker } = useContext(CrudBrokerContext)
  const [imagePreview, setImagePreview] = useState(null)

  const [nameError, setNameError] = useState('')
  const [rankingError, setRankingError] = useState('')
  const [linkError, setLinkError] = useState('')
  const [locationError, setLocationError] = useState('')
  const [confirmationOpen, setConfirmationOpen] = useState(false); // State for confirmation dialog


  const [formData, setFormData] = useState({
    name: '',
    ranking: 0, // Initialize ranking as a number default 0;
    image: null,
    imagePreviewUrl: '',
    link: '',
    location: '',
  })


  // Populate form data with franchise data when modal opens
  useEffect(() => {
    if (open && brokersData) {
      setFormData({
        name: brokersData.name || "",
        phoneNumber: brokersData.phoneNumber || "",
        location: brokersData.location || "",
        link: brokersData.link || "",
        ranking: brokersData.ranking || "",
      });

      setImagePreview(brokersData.image);
    }


  }, [open, brokersData,]);

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
      default:
        break
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target

    // Reset corresponding error when the user types
    switch (name) {
      case 'name':
        setNameError(value.trim() ? '' : 'Name is required')
        break
      case 'ranking':
        setRankingError(value.trim() ? '' : 'Ranking is required')
        break
      case 'location':
        setLocationError(value.trim() ? '' : 'Location is required')
        break
      case 'link':
        setLinkError(value.trim() ? '' : 'Link is required')
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
      setFormData({ ...formData, image: e.target.files[0] })
      setImagePreview(URL.createObjectURL(e.target.files[0]))
    }
    
  }

  const handleEdit = (e) => {
    e.preventDefault()
    const isNameValid = validateName(formData.name)
    const isRankingValid = validateRanking(formData.ranking)
    const isLocationValid = validateLocation(formData.location)
    const isLinkValid = validateLink(formData.link)

    if (!isNameValid || !isRankingValid || !isLocationValid || !isLinkValid) {
      return
    }

    try {
      const formDataToSend = new FormData()
      for (let key in formData) {
        formDataToSend.append(key, formData[key])
      }


      editBroker(brokersData._id, formDataToSend)

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

  const handleDeleteConfirmation = () => {
    setConfirmationOpen(true); // Open the confirmation dialog
  };

  const handleDeleteConfirmed = () => {
    deleteBroker(brokersData._id);
    setConfirmationOpen(false); // Close the confirmation dialog
  };

  const handleDeleteCancelled = () => {
    setConfirmationOpen(false); // Close the confirmation dialog
  };


  const handleClose = () => {
    setOpen(false)
    setImagePreview(null)
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

  const validateLocation = (location) => {
    if (!location.trim()) {
      setLocationError('Location is required')
      return false
    }
    setLocationError('')
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

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          {/* Edit form section */}
          <Typography variant="h6" gutterBottom>
            Edit Broker
          </Typography>
          <form encType="multipart/form-data" method="PUT">
            <TextField
              fullWidth
              label="Broker Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              onBlur={handleBlur}
            />
            <Typography color="error" variant="body2">
              {nameError}
            </Typography>
            <TextField
              fullWidth
              label="Ranking"
              name="ranking"
              variant="outlined"
              margin="normal"
              value={formData.ranking}
              type="tel"
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <Typography color="error" variant="body2">
              {rankingError}
            </Typography>
            <TextField
              fullWidth
              label="Location"
              name="location"
              variant="outlined"
              value={formData.location}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="normal"
              type="text"
            />
            <Typography color="error" variant="body2">
              {locationError}
            </Typography>
            <TextField
              fullWidth
              label="Link"
              name="link"
              variant="outlined"
              value={formData.link}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="normal"
              type="url"
            />
            <Typography color="error" variant="body2">
              {linkError}
            </Typography>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="upload-image"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: '50%', maxHeight: '50%', height: 'auto', marginTop: 8 }}
              />
            )}
            <label htmlFor="upload-image">
              <Button
                variant="outlined"
                startIcon={<Image />}
                component="span"
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                Update Image
              </Button>
            </label>

            <Button
              onClick={handleDeleteConfirmation}
              variant="contained"
              startIcon={<Delete />}
              sx={{
                marginRight: 1,
                marginTop: '10px',
                bgcolor: 'red',
                '&:hover': {
                  bgcolor: 'red',
                },
              }}
            >
              Delete
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmationOpen} onClose={handleDeleteCancelled}>
        <DialogContent>
          <Typography variant="body1">Are you sure you want to delete this broker?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancelled} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmed} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default EditDialog