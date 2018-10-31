const express = require('express')
const next = require('next')
const compression = require('compression')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const accepted_langs = ['it','en']

function checkLang(str){
  const isLang = (accepted_langs.indexOf(str) > -1)    
  let lang = (isLang) ? str : ''
  const page = (isLang) ? '' : '/'+str
  if(lang == 'it') lang = ''  
  return {page: page, lang: lang}
}

app.prepare().then(() => {
    const server = express()
    server.use(compression())

    // server.get('/posts/:id', (req, res) => {
    //     return app.render(req, res, '/posts', { id: req.params.id })
    // })

    // server.get('/about/:name', (req, res) => {
    //     const actualPage = '/about'
    //     const queryParams = { title: req.params.name }     
    //     app.render(req, res, actualPage, queryParams)
    // })


    //hw routing starts here
    server.get('/log-in', (req, res) => {        
        return app.render(req, res, '/about', { lang: '' })
    }) 

    server.get('/:lang/log-in', (req, res) => {        
        const check = checkLang(req.params.lang)    
        return app.render(req, res, check.page+'/about', { lang: check.lang })
    })

    //articles
    server.get('/articles/:slug', (req, res) => {          
        return app.render(req, res, '/articles', { lang: '', slug: req.params.slug })
    }) 

    server.get('/:lang/articles/:slug', (req, res) => {        
        const check = checkLang(req.params.lang)    
        return app.render(req, res, check.page+'/articles', { lang: check.lang, slug: req.params.slug })
    })


    //default routing
    server.get('/', (req, res) => {        
        return app.render(req, res, '/', { lang: '' })
    })    
    
    server.get('/:lang/', (req, res) => {        
        const check = checkLang(req.params.lang) 
        console.log(check)       
        return app.render(req, res, check.page+'/', { lang: check.lang })
    })        
    
    //defalut handler
    server.get('*', (req, res) => {        
        return handle(req, res)
    })

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})