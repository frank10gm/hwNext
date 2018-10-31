import Head from '../components/head'
import Router, {withRouter} from 'next/router'

const About = (props) => {   

    return (    
    <div>        
        <Head title="hackweb | log in" />        
        <div className="text-center log_in">          
            <form className="form-signin">
                {/*<img className="mb-4" src="https://getbootstrap.com/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">*/}
                <h1 className="h3 mb-3 font-weight-normal">Please log in</h1>
                <label className="sr-only">Email address</label>
                <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required />
                <label className="sr-only">Password</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password" required />
                <div className="checkbox mb-3">
                <label>
                    <input type="checkbox" value="remember-me" /> Remember me
                </label>
                </div>
                <button className="btn btn-lg btn-primary btn-block" type="submit">Log in</button>
                <p className="mt-5 mb-3 text-muted">hackweb | Security Systems</p>
            </form>
        </div>
    </div>
)}

About.getInitialProps = async ({query}) => {        
    return {res: query}
}
        
export default (withRouter(About))