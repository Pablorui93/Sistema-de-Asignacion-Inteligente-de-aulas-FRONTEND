import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav style={{
            backgroundColor: '#0055a4',
            padding: '15px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white'
        }}>
            <h1 style={{ margin: 0, fontSize: '1.2rem' }}>UTN - Asignación de Aulas</h1>

            <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Panel</Link>
                <Link to="/aulas" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Aulas</Link>
                <Link to="/materias" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Materias</Link>
                <Link to="/comisiones" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Comisiones</Link>
                <Link to="/docentes" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Docentes</Link>
                <Link to="/simulador" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Simulador Inteligente</Link>
                <Link to="/cronograma" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Cronograma</Link>
                <Link to="/" style={{ color: 'red', textDecoration: 'none', fontWeight: 'bold' }}>Salir</Link>
            </div>

        </nav>
    );
};

export default NavBar;