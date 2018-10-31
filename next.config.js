// next.config.js
const withCSS = require('@zeit/next-css')

module.exports = withCSS({  
  webpack: (config) => {    
    config.node = {      
      fs: 'empty' // Fixes npm packages that depend on `fs` module
    }
    return config
  },
  useFileSystemPublicRoutes: false
})

//   exportPathMap: function () {
//     return {
//       '/': { page: '/' }
//     }
//   } 