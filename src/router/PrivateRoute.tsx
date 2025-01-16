import {useAuth} from "../context/useAuth";
import {Redirect, Route} from "react-router-dom";
import React from "react";


export interface PrivateRouteProps {
    component: any;
    path: string;
    exact?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
    const { loggedIn } = useAuth();
    return (
        <Route {...rest} render={props => {
            if (loggedIn) {
                return <Component {...props} />;
            }
            return <Redirect to={{ pathname: '/login' }}/>
        }}/>
    )
}

export default PrivateRoute;