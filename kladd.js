// Helper function to set display style for elements by selector
const setDisplayStyle = (selector, displayValue) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.style.display = displayValue
  })
}

// Helper function to set flex direction for elements by selector
const setFlexDirection = (selector, flexDirection) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.style.flexDirection = flexDirection
  })
}

openSubcategories = (categoryId, categoryName) => {
  // Hide the main dropdown product link
  document.getElementById('dropdown-product-link').style.display = 'none'

  // Set display properties for headings for categories and departments
  document.querySelectorAll('[id^="parent-"]').forEach((element) => {
    element.style.display = element.id === `parent-${categoryId}` ? 'flex' : 'none'
  })

  // Adjust button visibility
  document.getElementById('go-back-button').style.display = 'none'
  document.getElementById('back-to-menu-button').style.display = 'block'
  document.getElementById('back-to-menu-placeholder').textContent = `${categoryName}`

  // Set display properties for categories and departments and their buttons
  const categoryElement = document.getElementById(`category-${categoryId}`)
  const categoryButton = document.getElementById(`category-button-${categoryId}`)
  if (categoryElement && categoryButton) {
    categoryElement.style.display = 'flex'
    categoryButton.style.display = 'none'
  }

  const departmentElement = document.getElementById(`department-list-${categoryId}`)
  const departmentButton = document.getElementById(`department-button-${categoryId}`)
  if (departmentElement && departmentButton) {
    departmentElement.style.display = 'flex'
    departmentButton.style.display = 'none'
  }

  // Set explore link properties
  const desktopLink = document.getElementById(`desktop-link-${categoryId}`)
  let link = ''
  if (desktopLink) {
    link = desktopLink.getAttribute('href')
  }

  if (link) {
    const exploreContainer = document.querySelector('.explore-categories')
    const exploreLink = document.querySelector('.explore-link')
    exploreLink.setAttribute('href', link)
    exploreLink.textContent = `Utforska ${categoryName}`
    exploreContainer.style.display = 'block'
  }
}

const resetMobileDropdown = () => {
  //Show the main product link
  document.querySelector('.dropdown-product-link').style.display = 'block'

  // Set display and flex direction properties for various elements
  setDisplayStyle('[id^="parent-"]', 'flex')
  setFlexDirection('.parent', 'row')
  setFlexDirection('.department', 'row')
  setDisplayStyle('.category', 'none')
  setDisplayStyle('.department-list', 'none')
  setDisplayStyle('.parent-button', 'inline')
  setDisplayStyle('.parent-link.desktop', 'none')
  setDisplayStyle('.dropdown-a.desktop', 'none')
  setDisplayStyle('.explore-categories', 'none')

  //Adjust button visibility
  document.getElementById('go-back-button').style.display = 'block'
  document.getElementById('back-to-menu-button').style.display = 'none'
}

const resetDesktopDropdown = () => {
  // Set display properties for buttons and links
  setDisplayStyle('.parent-button', 'none')
  setDisplayStyle('.parent-link.desktop', 'block')
  setDisplayStyle('.dropdown-a.desktop', 'block')

  // Hide the go-back button
  document.getElementById('go-back-button').style.display = 'none'

  // Set display and flex direction properties for categories and departments
  setDisplayStyle('.category', 'flex')
  setDisplayStyle('.department-list', 'flex')
  setFlexDirection('.parent', 'column')
  setFlexDirection('.department', 'column')

  // Hide the main product link
  document.querySelector('.dropdown-product-link').style.display = 'none'
}

onBackToMenu = () => {
  resetMobileDropdown()
}

const handleResize = () => {
  updateDeviceType()
  closeMenu()
  closeMobileMenuModal()
}

window.addEventListener('resize', handleResize)
