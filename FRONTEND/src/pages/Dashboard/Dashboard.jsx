import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Dashboard = () => {
    const [metricas, setMetricas] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const fetchMetricas = async () => {
        try {
            const respuesta = await api.get('/dashboard');
            setMetricas(respuesta.data);
        } catch (err) {
            setError('Error al cargar las estadísticas del sistema.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchMetricas();
    }, []);

    const handleLiberarCuatrimestre = async (cuatrimestre) => {
        const confirmacion = window.confirm(`¡ATENCIÓN! Estás a punto de eliminar todas las asignaciones de aulas de las materias del ${cuatrimestre}. Las materias Anuales no se verán afectadas. ¿Continuar?`);

        if (confirmacion) {
            try {
                const respuesta = await api.post('/asignaciones/liberar-cuatrimestre', { cuatrimestre });
                alert(`${respuesta.data.mensaje} Se liberaron ${respuesta.data.asignacionesEliminadas} reservas de aulas.`);
                // Recargamos los datos para ver cómo baja el número de asignaciones
                fetchMetricas();
            } catch (err) {
                alert(err.response?.data?.mensaje || 'Error al liberar las aulas.');
            }
        }
    };

    if (cargando) return <p style={{ padding: '20px' }}>Cargando métricas del sistema...</p>;
    if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

    const cardStyle = {
        backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'center', flex: '1 1 200px', borderTop: '5px solid #0055a4'
    };
    const numberStyle = { fontSize: '3rem', fontWeight: 'bold', color: '#333', margin: '10px 0' };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '5px' }}>Panel de Control Administrativo</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>Resumen general y herramientas de gestión del ciclo lectivo.</p>

            {/* METRICAS */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
                <div style={cardStyle}>
                    <h3>Aulas</h3><p style={numberStyle}>{metricas.aulas}</p>
                    <Link to="/aulas" style={{ textDecoration: 'none', color: '#0055a4', fontWeight: 'bold' }}>Gestionar ➔</Link>
                </div>
                <div style={cardStyle}>
                    <h3>Materias</h3><p style={numberStyle}>{metricas.materias}</p>
                    <Link to="/materias" style={{ textDecoration: 'none', color: '#0055a4', fontWeight: 'bold' }}>Gestionar ➔</Link>
                </div>
                <div style={cardStyle}>
                    <h3>Comisiones</h3><p style={numberStyle}>{metricas.comisiones}</p>
                    <Link to="/comisiones" style={{ textDecoration: 'none', color: '#0055a4', fontWeight: 'bold' }}>Gestionar ➔</Link>
                </div>
                <div style={cardStyle}>
                    <h3>Docentes</h3><p style={numberStyle}>{metricas.docentes}</p>
                    <Link to="/docentes" style={{ textDecoration: 'none', color: '#0055a4', fontWeight: 'bold' }}>Gestionar ➔</Link>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

                {/* CRONOGRAMA */}
                <div style={{ flex: '1 1 400px', backgroundColor: '#e9ecef', padding: '30px', borderRadius: '8px', textAlign: 'center' }}>
                    <h3>Asignaciones Consolidadas</h3>
                    <p style={{ fontSize: '1.2rem', margin: '15px 0' }}>
                        Actualmente el sistema administra <strong>{metricas.asignaciones}</strong> reservas en el cronograma oficial.
                    </p>
                    <Link to="/cronograma" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
                        Ver Cronograma Completo
                    </Link>
                </div>

                {/* HERRAMIENTAS ADMINISTRATIVAS */}
                <div style={{ flex: '1 1 400px', backgroundColor: '#fff3cd', padding: '30px', borderRadius: '8px', border: '1px solid #ffeeba', textAlign: 'center' }}>
                    <h3 style={{ color: '#856404' }}>Cierre de Ciclo Lectivo</h3>
                    <p style={{ color: '#856404', margin: '15px 0' }}>
                        Libera masivamente las aulas ocupadas por materias de duración cuatrimestral.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button onClick={() => handleLiberarCuatrimestre('Primer Cuatrimestre')} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Cerrar 1° Cuatrimestre
                        </button>
                        <button onClick={() => handleLiberarCuatrimestre('Segundo Cuatrimestre')} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Cerrar 2° Cuatrimestre
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;