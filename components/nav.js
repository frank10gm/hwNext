import React from 'react'
import Router, {withRouter} from 'next/router'
import ActiveLink from './ActiveLink'
import {connect} from 'react-redux'
import { changeLogoAction } from '../store';
// import $ from 'jquery'

class Nav extends React.Component{  
    _canonical;
  
  constructor (props) {    
    super(props);        
    
    this.state = {
      logo: '/static/images/logo.png',
      currentUrl: this.props.router.pathname,
      menuNav: false,
      menuHeight: '0px',
      navHeight: null,
      lang: props.lang
    }               

    this._canonical = ((props.lang === '')?'/':'/'+props.lang)    

    //attach dispatch of redux
    const {dispatch} = this.props
    dispatch(changeLogoAction(this.changeLogo))     
  }

  componentWillMount(){            
    //
  }

  componentDidMount(){    
    //checking url to see if we need to put a different logo
    this.checkUrl(this.state.currentUrl)  

    //router listen on url change complete
    Router.onRouteChangeComplete = url => {         
      //checking the url and mobile menu         
      this.setState({
        currentUrl: url,
        menuNav: false
      })                  
      // this.checkUrl(url)      
    }        

    this.setHeights()    

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.setHeights()
      }, 50);      
    });    

    //controlling popstate
    Router.beforePopState(({ url, as, options }) => {
      this.checkUrl(as)
      return true
    });
  }

  setHeights = () => {    
    const menuHeight = document.querySelector('.navbar-collapse').scrollHeight
    const navHeight = document.querySelector('.navbar').scrollHeight        
    this.setState({
      menuHeight: menuHeight+'px',
      navHeight: navHeight+'px',
      menuNav: false
    })   
    // var style = document.createElement('style');
    // style.type = 'text/css';
    // style.innerHTML = '@media screen and (max-width: 767px) {'+
    //   '.frankieclass { color: #F00; }'+
    // '}';
    // document.getElementsByTagName('head')[0].prepend(style);  
  }

  checkUrl = (url) => {
    if(url.includes('park')) this.changeLogo('/static/images/logo-park.png')
    else this.changeLogo()
  }

  changeLogo = (img = '/static/images/logo.png') => {
    this.setState({
      logo: img
    })
  }
    
  handleClick = (href) => {        
    return (e) => {    
      e.preventDefault()  
      this.checkUrl(href)        
      const set_lang = (this.state.lang === '') ? '' : '/'+this.state.lang
      const query_lang = (this.state.lang === '') ? '?lang=' : '?lang='+this.state.lang   
      let mask = href;
      if (set_lang !== ''){        
          mask = mask.replace(set_lang, '')  
          href = href.replace(set_lang, '/')         
          if(mask !== '') mask = '/'+mask             
      }      
      Router.push(href+query_lang, set_lang+mask)
    }
  }  

  mobileMenu = (e = 'false') => {        
    // $('.navbar-collapse').slideDown()
    // const el = document.querySelector('.navbar-collapse')
    // const max_height = el.scrollHeight        
    // if(e === true){
    //   el.style.maxHeight = 'none'
    //   this.setState({
    //     menuNav: false
    //   })
    //   return
    // }     
    // el.style.maxHeight = (!this.state.menuNav) ? max_height+'px' : '0px'
    this.setState({
      menuNav: !this.state.menuNav
    })            
  }

  render(){           
    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">        
          <a className="navbar-brand" href={this._canonical} onClick={this.handleClick(this._canonical)} currenturl={this.state.currentUrl} >
            <img className="main-logo" id="main-logo" src={this.state.logo} alt="" />
          </a>        

          <button onClick={this.mobileMenu} className={'navbar-toggler navbar-toggler-right' + ((!this.state.menuNav) ? ' collapsed' : '')} type="button">
            {/* <span className="navbar-toggler-icon"></span> */}
            <span> </span>
            <span> </span>
            <span> </span>
          </button>

          <div className={ 'navbar-collapse collapse' + ((this.state.menuNav) ? ' show' : '') } >           

            <ul className="navbar-nav mr-auto">
              <li className="nav-item" >   
                <ActiveLink currenturl={this.state.currentUrl} lang={this.state.lang} checkUrl={this.checkUrl} href={this._canonical}>Home</ActiveLink>
              </li>            
              <li className="nav-item">
                <ActiveLink currenturl={this.state.currentUrl} lang={this.state.lang} checkUrl={this.checkUrl} href={this._canonical+"park"}>Park</ActiveLink>
              </li>
              <li className="nav-item">            
                <ActiveLink currenturl={this.state.currentUrl} lang={this.state.lang} checkUrl={this.checkUrl} mask_url="/about" href={this._canonical+"log-in"}>Log In</ActiveLink>
              </li>                       
            </ul>

            <div className="gino"></div>

            <form className="form-inline my-2 my-lg-0">   
              <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" id="search-box" />         
            </form>
          </div>
        </nav> 
        <style global jsx>{`        
          .main-class{
            ${(this.state.navHeight !== null) ? 'margin-top: '+this.state.navHeight : ''};
          }
          @media screen and (max-width: 767px) {
            .navbar-collapse {  
              max-height: ${this.state.menuHeight};
            }
          }          
        `}
        </style>
      </div>
    )
  }
}    

function mapStateToProps (state) {
  const {lang} = state
  return {lang}
}

export default connect(mapStateToProps)(withRouter(Nav))

const links = [
  { href: 'https://github.com/segmentio/create-next-app', label: 'Github' }
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`
  return link
})