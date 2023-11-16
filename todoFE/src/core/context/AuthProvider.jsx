import { createContext, useState/*, useEffect*/} from "react"
import Cookies from "js-cookie"


const AuthContext = createContext({})
export const AuthProvider = ({children}) => {


    //const[emailContext, setEmailContext] = useState("")
    const[tokenContext, setTokenContext] = useState(Cookies.get("token"))

    /*useEffect(() => {
        if(tokenContext)
        {
            const base64Url = tokenContext.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedJwt = JSON.parse(window.atob(base64));
            
            const email = decodedJwt["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] //UNDEFINED JE KAD MI TREBA?!?!?
            setEmailContext(email)
        }

    },[])
*/
    return(
        <AuthContext.Provider value={{tokenContext, setTokenContext}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
