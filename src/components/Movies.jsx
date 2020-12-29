import { Component } from 'react'
import { Link } from 'react-router-dom'
// Services
import { deleteMovie, getMovies } from '../services/movieService'
import { getGenres } from '../services/genreService'
// Common components
import MoviesTable from './common/MoviesTable'
import Pagination from './common/Pagination'
import { ListGroup } from './common/ListGroup'
import { SearchBox } from './common/SearchBox'
// Utils
import Paginate from '../utils/Paginate'
// Styles
import 'bootstrap/dist/css/bootstrap.css'
import { toast } from 'react-toastify'

import _ from 'lodash'

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 3,
    currentGenre: '',
    sortColumn: { path: 'title', order: 'asc' },
    searchQuery: '',
  }

  handleToggleLike = (movie) => {
    const movies = [...this.state.movies]
    const index = movies.indexOf(movie)
    movies[index].liked = !movies[index].liked
    this.setState({ movies })
  }

  handleDelete = async (id) => {
    const originalPosts = this.state.movies

    const movies = originalPosts.filter((m) => m._id !== id)
    this.setState({ movies })
    try {
      await deleteMovie(id)
      toast.success('Successfully deleted')
    } catch (e) {
      if (e.response && e.response.status === 404) {
        toast.error('This movie already deleted')
      } else if (e.response && e.response.status === 403) {
        toast.error("You aren't allowed to delete !")
      }
      this.setState({ movies: originalPosts })
    }
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page })
  }

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentGenre: '', currentPage: 1 })
  }

  handleItemSelect = (genre) => {
    this.setState({ currentGenre: genre, currentPage: 1, searchQuery: '' })
  }

  handleSort = (sortColumn) => {
    this.setState({ sortColumn })
  }

  getPageData = () => {
    const {
      movies,
      currentPage,
      pageSize,
      currentGenre,
      sortColumn,
      searchQuery,
    } = this.state

    let filtered = movies

    if (searchQuery !== '') {
      filtered = movies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
    } else if (currentGenre && currentGenre._id) {
      filtered = movies.filter((m) => m.genre._id === currentGenre._id)
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])

    const paging = Paginate(sorted, currentPage, pageSize)

    return { data: paging, count: filtered.length }
  }

  async componentDidMount() {
    const { data } = await getGenres()
    let genres = [{ name: 'All genres' }, ...data]

    const { data: movies } = await getMovies()

    this.setState({ movies, genres })
  }

  render() {
    const { length: count } = this.state.movies
    const {
      currentPage,
      pageSize,
      genres,
      currentGenre,
      sortColumn,
      searchQuery,
    } = this.state

    const { user } = this.props

    if (count === 0) {
      return (
        <h3 id="headElem" className="text-center font-weight-bold p-3">
          There isn't film in database.
        </h3>
      )
    }

    const { count: length, data: movies } = this.getPageData()
    return (
      <div className="container row ml-3">
        <div className="col-2">
          <h3 id="headElem" className="text-center font-weight-bold p-3">
            <i>Menu</i>
          </h3>
          <ListGroup
            items={genres}
            selectedItem={currentGenre}
            onItemSelect={this.handleItemSelect}
          />
        </div>
        <div className="col">
          <h3 id="headElem" className="text-center font-weight-bold p-3 d-flex">
            {user?.isAdmin && (
              <Link to="/movies/new" className="btn btn-primary mr-3">
                {' '}
                New Movie{' '}
              </Link>
            )}
            <i>
              There are <b>{length}</b> films in the database
            </i>
          </h3>
          <SearchBox searchQuery={searchQuery} onSearch={this.handleSearch} />
          <MoviesTable
            movies={movies}
            onDelete={this.handleDelete}
            onToggleLike={this.handleToggleLike}
            onSort={this.handleSort}
            sortColumn={sortColumn}
            user={user}
          />
          <Pagination
            itemsCount={length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    )
  }
}

export default Movies
