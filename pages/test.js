
const Test = (props) => {            

    return (    
    <div>                
        <br />
        <div className="container">          
            ciao {props.res.title}
        </div>
    </div>
)}

Test.getInitialProps = async ({query}) => {        
    return {res: query}
}
        
export default Test