import React from 'react';
import {Switch,Route} from 'react-router-dom'

const Home = ({handleLogged}) => {
    return(
        <div>
            <Header isLogged={handleLogged}/>
            <Switch>
                <Route exact path='/' component={NewHome}/>
                <Route exact path='/explore' component={Explore}/>
                <Route path='/:username' component={Profile}/>
            </Switch>
        </div>
    )
}

export default Home;