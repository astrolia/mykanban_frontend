import './styles.css'
import { Link } from 'react-router-dom'

type Workspace = {
  id: string
  name: string
  typeWS: string
}

// so pra testar
const workspaces: Workspace[] = [
  {
    id: '1',
    name: 'primeiro ambiente',
    typeWS: 'Default',
  },
]

function Home() {
  return (
    <div className="homePage">
      <h2 className="homeTitle">Meus workspaces</h2>

      {workspaces.length === 0 ? (
        <p className="homeEmpty">Nenhum workspace cadastrado ainda.</p>
      ) : (
        <div className="workspaceGrid">
          {workspaces.map((ws) => (
            <Link key={ws.id} to={`/workspace/${ws.id}`} className="workspaceCard">
              <h3>{ws.name}</h3>
              <p>{ws.typeWS}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home