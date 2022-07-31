import { useState , useRef} from 'react'
import { Routes, Route, Link, useMatch, useNavigate} from 'react-router-dom'
import { useField } from './hooks'


const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Notification = ({notification}) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return notification ?  (
    <div style={style}>
      {notification}
    </div>
  ) : ''
}

const Menu = ({addNew, anecdotes, vote, notification}) => {
  const padding = {
    paddingRight: 5
  }

  const match = useMatch('/anecdotes/:id')
  const anecdote = match ? anecdotes.find(n=> n.id === Number(match.params.id)) : ''


  return (
    <div>
      <div>
        <Link to='/' style={padding}>anecdotes</Link>
        <Link to='/create' style={padding}>create new</Link>
        <Link to='/about' style={padding}>about</Link>
      </div>

      <Notification notification={notification}/>

      <Routes>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />}/>
        <Route path="/create" element={<CreateNew addNew={addNew}/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path='/anecdotes/:id' element={<Anecdote anecdote={anecdote} vote={vote}/>}/>
      </Routes>
    </div>
  )
}

const Anecdote = ({anecdote, vote}) => (
  <div key={anecdote.id}>
          <h2>
            {anecdote.content}
          </h2>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
)

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => <li key={anecdote.id} >
      <Link to={`anecdotes/${anecdote.id}`}>
      {anecdote.content}
      </Link>
      </li>)}
    </ul>
  </div>
)


const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const content = useField('content')
  const author = useField('author')
  const info = useField('info')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/')
  }


  const handleReset = (e) => {
    e.preventDefault()
    content.reset()
    author.reset()
    info.reset()
  }
  return (
    <div>
      <h2>create a new anecdote</h2>
      <form>
        <div>
          content
          <input {...content} reset='' />
        </div>
        <div>
          author
          <input {...author} reset='' />
        </div>
        <div>
          url for more info
          <input {...info} reset='' />
        </div>
        <button onClick={handleSubmit}>create</button>
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')
  const timer = useRef(null)

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    handleAddAnecdote(anecdote.content)
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  const handleAddAnecdote =async (anecdote) => {
    clearTimeout(timer.current)
    setNotification(`a new anecdote ${anecdote} CREATED!`)
    timer.current = setTimeout(()=> {
      setNotification('')
    }, 5000)
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu addNew={addNew} anecdotes={anecdotes} vote={vote} notification={notification}/>
      <Footer />
    </div>
  )
}

export default App
