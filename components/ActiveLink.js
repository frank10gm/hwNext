import Router, { withRouter } from 'next/router'
//{ children, router, href, checkUrl, lang, mask_url }
const ActiveLink = (props) => {
    
    const set_lang = (props.lang === '') ? '' : '/'+props.lang
    const query_lang = (props.lang === '') ? '?lang=' : '?lang='+props.lang   
    let mask = props.href;
    let href = props.href;
    let currenturl = props.currenturl;    

    if (set_lang !== ''){        
        mask = mask.replace(set_lang, '')          
        href = href.replace(set_lang, '/') 
        currenturl = currenturl.replace(set_lang, '')
        if(currenturl === '') currenturl = '/'
        if(mask !== '') mask = '/'+mask                                           
    }     

    if(typeof window !== 'undefined') {        
        if(window.location.href === currenturl) currenturl = '/'
        // console.log(window.location.href.split('/')[3])
    }
    
    const active_url = (typeof props.mask_url === 'undefined') ? href : props.mask_url     
    const active = (currenturl === props.mask_url || currenturl === href) ? ' active' : ''  

    const onClickHandler = (e) => {        
        e.preventDefault()            
        props.checkUrl(href)                                                                      
        props.router.push(active_url+query_lang, set_lang+mask)  
    }

    return (        
        <a href={href} className={'nav-link'+active} onClick={onClickHandler}>
          {props.children}
        </a>
    )
}

export default withRouter(ActiveLink)