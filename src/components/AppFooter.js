import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="http://Fx review/" target="_blank" rel="noopener noreferrer">
          The FX review
        </a>
        <span className="ms-1">&copy; 2024 creativeLabs.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="http://dhanwis.com/" target="_blank" rel="noopener noreferrer">
          Dhanwis TechInfo Solution
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
