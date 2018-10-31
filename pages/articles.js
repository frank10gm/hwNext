import Head from '../components/head'
import Router from 'next/router'
import { connect } from 'react-redux'
import fetch from 'isomorphic-unfetch'
import { setLang } from '../store';

const isServer = typeof window === 'undefined'

class Articles extends React.Component {  

    _mounted = false
    _page_title = 'hackweb'    
  
    static async getInitialProps ({ req, query }) {          
          
        let title = ''
        const cms_lang = (query.lang !== '') ? '&lang='+query.lang : ''    
        let dataURL = this.props.wp_endpoint+'posts/?_embed'+cms_lang+'&slug='+query.slug       
        if(isServer) title = await fetch(dataURL)
        .then(res => res.json())
        .then(res => {          
            return ' | '+res[0].title.rendered
        })
      
        return {
            title: title,
            params: query            
        }        
    }
  
    constructor(props){    
      super(props)         
      this._page_title += props.title; 
      this._page_slug = props.params.slug
      this.state = {      
        page_title: this._page_title
      };      
    }

    componentDidMount () {       
        if(this.props.title === ''){
            this.loadCMS(this.props.lang)
        }
    }

    loadCMS = async (l = '') => {
        let cms_lang = (l !== '') ? '&lang='+l : ''            
        let dataURL = this.props.wp_endpoint+'posts/?_embed'+cms_lang+'&slug='+this.props.params.slug               
        await fetch(dataURL)
        .then(res => res.json())
        .then(res => {          
            this.setState({
                page_title: this._page_title += ' | '+(res[0].title.rendered )
            })                           
        })        
    }

    render(){
        return (
            <div>
                <Head title={this.state.page_title} />
                <br />
                <div className="container">
                    Articolo
                </div>
            </div>
        )
    }    

}


function mapStateToProps (state) {
    const {lang, wp_endpoint} = state
    return {lang, wp_endpoint}
}
  
export default connect(mapStateToProps)(Articles)