import Head from '../components/head'
import {connect} from 'react-redux'


class Park extends React.Component {  
    
    static async getInitialProps({query}){          
        return {resp: query}
    }    

    // if(typeof window !== 'undefined') document.getElementById('main-logo').src = 'ciao'

    constructor(props){
        super(props)
    }

    componentWillMount(){        
        this.props.changeLogo('/static/images/logo-park.png')    
    }

    render(){
        return (
            <div>
                <Head title="Park // Automobile Database" />
                <br />
                <div className="container">
                    Park {this.props.resp.title}
                </div>
            </div>
        )
    }    
}

// se fosse un functional component
// Park.getInitialProps = async ({query}) => {          
//     return {resp: query}
// }

function mapStateToProps (state) {
    const {changeLogo} = state
    return {changeLogo}
}
  
export default connect(mapStateToProps)(Park)