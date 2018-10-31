import Head from '../components/head'
import Router from 'next/router'
import {connect} from 'react-redux'
import fetch from 'isomorphic-unfetch'
import { saveHomepageArticles, setLang } from '../store';

class Index extends React.Component {  
    
    _mounted = false
    _page_title = 'hackweb'
    
    static async getInitialProps ({ req, query }) {    
        
        return {
            // title: title,
            params: query            
        }        
    }
    
    constructor(props){    
        super(props)    

        console.log(props)
        
        //setting lang
        // if(typeof this.props.params.lang != 'undefined'){
        //   lang = this.props.params.lang
        // }else{
        //   lang = this.props.lang
        // }    
        
        this.state = {      
            articles: props.articles,
            main_article: props.main_article,      
            lang: props.lang
        };          
        
        this.loading = <div className="spinner"><div className="bounce1"></div><div className="bounce2"></div><div className="bounce3"></div></div>    
    }
    
    componentWillMount(){      
        
    }
    
    componentDidMount () {           
        // const {dispatch} = this.props
        // this.timer = startClock(dispatch)
        this.loadCMS(this.state.lang)    
        this.updateLinks()    
        this._mounted = true
    }
    
    componentDidUpdate() {        
        this.updateLinks()
    }
    
    componentDidCatch(error, info) {
        console.log('error')
    }
    
    componentWillUnmount () {
        // clearInterval(this.timer)  
        this._mounted = false  
    }
    
    handleClick = (href, props) => {    
        return (e) => {
            e.preventDefault()      
            Router.push(href+'?title='+props.title, href+'/'+props.title)
        }    
    }
    
    loadCMS = async (l = '') => {
        let cms_lang = (l !== '') ? '&lang='+l : ''    
        
        //sticky
        let dataURL = this.props.wp_endpoint+'posts/?_embed'+cms_lang+'&slug=hw'       
        if(this.props.main_article.length <= 0){
            await fetch(dataURL)
            .then(res => res.json())
            .then(res => {          
                if(this._mounted) this.setState({
                    main_article: res                 
                })        
                //attach dispatch of redux       
                this.props.dispatch(saveHomepageArticles({          
                    main_article: res,
                    articles: null
                }))   
            })
        }
        
        // 3 posts
        dataURL = this.props.wp_endpoint+'posts/?_embed'+cms_lang+'&per_page=3&sticky=false'
        if(this.props.articles.length <= 0){
            await fetch(dataURL)
            .then(res => res.json())
            .then(res => {                
                if(this._mounted) this.setState({
                    articles: res
                })        
                //attach dispatch of redux       
                this.props.dispatch(saveHomepageArticles({          
                    main_article: null,
                    articles: res
                }))
            })
        }     
        
    } // loadCMS END
    
    // update links
    updateLinks = () => {        
        let pageContent = document.getElementById('articles')
        let main_article = document.getElementById('main_article')
        let links = Array.from(pageContent.querySelectorAll('a'))          
        Array.from(main_article.querySelectorAll('a')).forEach((el) => {
            links.push(el)
        })
        links.map( (node) => node.onclick = (e) => {       
            this.handleLinkClick(e)
        });        
    }
    
    //handlelinkclick
    handleLinkClick = (e) => {          
        e.preventDefault()                    
        let link = (e.target.attributes.href.value.startsWith('/')) ? e.target.attributes.href.value : '/'+e.target.attributes.href.value
        const set_lang = (this.state.lang === '') ? '' : '/'+this.state.lang
        const query_lang = (this.state.lang === '') ? '?lang=' : '?lang='+this.state.lang    
        const slug = link.replace('/articles/','')    
        if(slug !== '') link = link.replace('/'+slug,'')
        const query_slug = '&slug='+slug
        console.log(link+query_lang+query_slug)
        if(e.target.attributes.href.value.includes('//')) window.open(e.target.attributes.href.value, '_blank')        
        else Router.push(link+query_lang+query_slug, set_lang+link+'/'+slug)  
    } 
    
    render(){  
        const handleClick = this.handleClick;   
        
        const main_article = (this.state.main_article.length <= 0) ? this.loading : <div>
        <h1 className="display-3" >{this.state.main_article[0].title.rendered}</h1>
        <div dangerouslySetInnerHTML={{ __html: this.state.main_article[0].content.rendered }}></div>            
        </div>
        
        let articles = this.state.articles.map((el, index) => {            
            let content = el.excerpt.rendered
            return <div key={el.slug} className="col-md-4">
            <h2>{el.title.rendered}</h2>
            <div dangerouslySetInnerHTML={{ __html: content }}></div>  
            <p><a className="btn btn-secondary" href={'/articles/'+el.slug}>Read »</a></p>          
            </div>
        });    
        
        return(
            <div>
            <Head title={this._page_title} />
            {/* <p><button className="btn btn-primary btn-lg" onClick={handleClick('/about', {title: 'cane'})} role="button">Learn more &raquo;</button></p> */}
            
            <div className="jumbotron">
            <div className="container" id="main_article">             
            {main_article}
            </div>
            </div>        
            
            <div className="container">  
            <div id="articles" className="row">
            {articles}
            </div>        
            </div> 
            
            </div>
        )
    }
}

function mapStateToProps (state) {
    const {main_article, articles, lang, wp_endpoint} = state
    return {main_article, articles, lang, wp_endpoint}
}

export default connect(mapStateToProps)(Index)