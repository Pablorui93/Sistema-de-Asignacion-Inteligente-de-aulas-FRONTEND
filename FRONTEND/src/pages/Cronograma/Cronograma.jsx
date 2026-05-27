import { useEffect, useState } from 'react';
import api from '../../services/api';

const Cronograma = () => {
    const [asignaciones, setAsignaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const fetchAsignaciones = async () => {
        try {
            const respuesta = await api.get('/asignaciones?tipo=Oficial');
            // Mantenemos el filtro protector
            const asignacionesValidas = respuesta.data.filter(asig => asig.aula && asig.comision && asig.comision.materia);
            setAsignaciones(asignacionesValidas);
        } catch (err) {
            setError('Hubo un problema al cargar el cronograma.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { fetchAsignaciones(); }, []);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de cancelar esta reserva? El aula volverá a estar disponible.')) {
            try {
                await api.delete(`/asignaciones/${id}`);
                fetchAsignaciones(); // Recargamos la tabla
            } catch (err) {
                alert('Error al cancelar la asignación.');
            }
        }
    };

    if (cargando) return <p>Cargando cronograma...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2>Cronograma Oficial de Asignaciones</h2>
            <p>Vista general de la planificación académica vigente.</p>

            {asignaciones.length === 0 ? (
                <p>Aún no hay asignaciones oficiales registradas.</p>
            ) : (
                <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#0055a4', color: 'white' }}>
                        <tr>
                            <th>Día</th>
                            <th>Horario</th>
                            <th>Materia y Comisión</th>
                            <th>Aula</th>
                            <th>Acciones</th> {/* Nueva columna */}
                        </tr>
                    </thead>
                    <tbody>
                        {asignaciones.map((asig) => (
                            <tr key={asig._id}>
                                <td><strong>{asig.dia}</strong></td>
                                <td>{asig.horaInicio} - {asig.horaFin}</td>
                                <td>
                                    <strong>{asig.comision.materia.nombre}</strong> <br />
                                    <small>Comisión: {asig.comision.codigo} ({asig.comision.cantidadEstimadaAlumnos} alumnos)</small>
                                </td>
                                <td>
                                    <strong>{asig.aula.nombre}</strong> <br />
                                    <small>{asig.aula.tipoEspacio}</small>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(asig._id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
                                        Cancelar Reserva
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Cronograma;