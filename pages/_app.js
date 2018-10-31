import React from 'react'
import App, { Container } from 'next/app'
import Nav from '../components/nav'
import withReduxStore from '../lib/with-redux-store'
import { Provider } from 'react-redux'
import { setLang } from '../store';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../static/css/style.css'

class MyApp extends App {

    static async getInitialProps ({ Component, router, ctx }) {
        let pageProps = {}
        if (Component.getInitialProps) {
          pageProps = await Component.getInitialProps(ctx)
        }            
                                          
        return {
            pageProps,
            lang: ctx.query.lang,
            pathname: ctx.pathname           
        }
    }

    constructor(props){
        super(props)       
        
        const lang = (typeof props.lang === 'undefined') ? '' : props.lang

        //setting lang for the app
        this.props.reduxStore.dispatch(setLang(lang))  
    }

    componentDidMount = () => {  
        //
    }
    
    render(){
        const { Component, pageProps, reduxStore, mainlogo } = this.props     
           
        return <Container>
            <Provider store={reduxStore}>
                <div>
                    <Nav img={mainlogo} />
                    <main role="main" className="main-class">
                    <Component {...pageProps} />
                    <div className="container">  
                        <hr />
                    </div>
                    </main>            
                    <footer className="container">
                        <p>&copy; hackweb 2018</p>
                    </footer>
                </div>
            </Provider>
        </Container>
    }
}

export default withReduxStore(MyApp)