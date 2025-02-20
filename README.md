# Games Library React App

## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Tools](#Tools)
- [Demos](#Demos)

## Description
Video game library in React with Vite using [RAWG](https://rawg.io/apidocs) api.   Hosted on [Netlify](https://react-final-gameslibrary.netlify.app/#/).  
Most info gets cached so it takes barely any time to load when refreshing or switching pages.  
The list is saved in localstorage as well as Dark/Light mode preference.   
Search happens on `Enter` key press while inside searchbar.  
To clear search results and go back to default games displayed, clear the searchbar field and press `Enter` or refresh the page.  
The games load automatically as you scroll.
  
Video [Demos](#Demos) can be viewed at the bottom of this README file.

## Installation

For local use:

First go to [RAWG](https://rawg.io/apidocs) register and get api key.  

clone the repo
```
git clone https://github.com/irakli-ka/react-final.git
cd react-final
```

install dependencies
```
npm install

```

dont run yet.   
create .env file and put your api key there like this.  
```
VITE_RAWG_API_KEY='YOUR_KEY_GOES_HERE'
```  
  
run development server on localhost
```
npm run dev
```

## Tools

External tools used:
  - react-router
  * mui/material
  + framer-motion


## Demos
All the demo videos were recorded on netlify hosted website.

https://github.com/user-attachments/assets/2f7410dd-7a98-4d1c-be18-06cc5b7e36c1

https://github.com/user-attachments/assets/a8547ebb-de51-45c5-ae25-6d9b4be132ec

https://github.com/user-attachments/assets/b4aaee03-1c08-493a-8920-c3b78663c727

https://github.com/user-attachments/assets/6e9f64a5-35a0-4743-b872-867b5fa38d2e

https://github.com/user-attachments/assets/27b6d3c0-fd11-4227-ae46-05140ab3974a

https://github.com/user-attachments/assets/361b7dc6-f8a1-49f9-abc8-a652af765d8a






