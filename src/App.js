import { Component } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { getCurrentUser } from './services/authService'

// Components
import { MoviesGet } from './components/MoviesGet'
import Movie from './components/Movie'
import Navbar from './components/Navbar'
import Login from './components//form/Login'
import RegisterForm from './components/form/RegisterForm'
import logOut from './components/LogOut'
import { ProtectRoute } from './components/common/ProtectRoute'

// Styles
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'

export class App extends Component {
  state = {}

  componentDidMount() {
    try {
      const user = getCurrentUser()
      this.setState({ user })
    } catch (err) {}
  }

  render() {
    const { user } = this.state
    return (
      <>
        <BrowserRouter>
          <ToastContainer />
          <Navbar user={user} />
          <Switch>
            <Route
              exact
              path="/movies"
              render={(props) => <MoviesGet {...props} user={user} />}
            />
            <ProtectRoute path="/movies/:id" component={Movie} />
            <Route exact path="/Login" component={Login} />
            <Route exact path="/LogOut" component={logOut} />
            <Route exact path="/register" component={RegisterForm} />
            <Redirect to="/movies" from="/" />
          </Switch>
        </BrowserRouter>
      </>
    )
  }
}

export default App
