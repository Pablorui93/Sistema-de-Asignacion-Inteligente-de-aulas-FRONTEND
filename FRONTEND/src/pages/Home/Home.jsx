import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh', // Ocupa toda la altura de la pantalla
            backgroundColor: '#e9ecef',
            textAlign: 'center',
            padding: '20px'
        }}>

            <h1 style={{ color: '#0055a4', fontSize: '3rem', marginBottom: '10px' }}>
                Sistema de Asignación Inteligente de Aulas
            </h1>

            <h2 style={{ color: '#333', fontWeight: 'normal', marginBottom: '40px' }}>
                Universidad Tecnológica Nacional <br />
                Facultad Regional La Plata
            </h2>

            <p style={{ maxWidth: '600px', fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>
                Plataforma centralizada para optimizar la planificación académica, gestionar espacios físicos y automatizar la asignación de horarios sin superposiciones.
            </p>

            <Link
                to="/dashboard"
                style={{
                    padding: '15px 40px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '5px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
            >
                Ingresar al Sistema
            </Link>

        </div>
    );
};

export default Home;