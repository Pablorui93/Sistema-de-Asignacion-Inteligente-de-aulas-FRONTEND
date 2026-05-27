import { useState, useEffect } from 'react';
import api from '../../services/api';

const SimuladorAsignacion = () => {
    // Estados para manejar los datos
    const [comisiones, setComisiones] = useState([]);
    const [sugerencias, setSugerencias] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' }); // tipo: 'exito' | 'error'

    // Estado del formulario
    const [formData, setFormData] = useState({
        comisionId: '',
        dia: 'Lunes',
        horaInicio: '18:00',
        horaFin: '22:00'
    });

    // Cargar las comisiones apenas entramos a la pantalla
    useEffect(() => {
        const fetchComisiones = async () => {
            try {
                const respuesta = await api.get('/comisiones');
                setComisiones(respuesta.data);
            } catch (error) {
                setMensaje({ texto: 'Error al cargar las comisiones.', tipo: 'error' });
            }
        };
        fetchComisiones();
    }, []);

    // Manejar cambios en los inputs del formulario
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Buscar sugerencias de aulas (llama al motor inteligente)
    const handleSugerir = async (e) => {
        e.preventDefault();
        setCargando(true);
        setMensaje({ texto: '', tipo: '' });
        setSugerencias([]);

        try {
            const respuesta = await api.post('/asignaciones/sugerir', formData);
            setSugerencias(respuesta.data);
            if (respuesta.data.length === 0) {
                setMensaje({ texto: 'No se encontraron aulas disponibles para esos requisitos.', tipo: 'error' });
            }
        } catch (error) {
            setMensaje({ texto: error.response?.data?.mensaje || 'Error al buscar aulas.', tipo: 'error' });
        } finally {
            setCargando(false);
        }
    };

    // Confirmar la asignación oficial
    const handleAsignar = async (aulaId) => {
        try {
            await api.post('/asignaciones', {
                comision: formData.comisionId,
                aula: aulaId,
                dia: formData.dia,
                horaInicio: formData.horaInicio,
                horaFin: formData.horaFin,
                tipo: 'Oficial'
            });

            setMensaje({ texto: '¡Aula asignada con éxito!', tipo: 'exito' });
            setSugerencias([]); // Limpiamos la lista para evitar doble asignación
        } catch (error) {
            setMensaje({ texto: error.response?.data?.mensaje || 'Error al asignar el aula.', tipo: 'error' });
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Simulador y Asignación Inteligente</h2>
            <p>Seleccioná una comisión y un horario para buscar los espacios óptimos.</p>

            {/* Mensajes de Feedback */}
            {mensaje.texto && (
                <div style={{
                    padding: '10px',
                    marginBottom: '15px',
                    backgroundColor: mensaje.tipo === 'exito' ? '#d4edda' : '#f8d7da',
                    color: mensaje.tipo === 'exito' ? '#155724' : '#721c24',
                    borderRadius: '5px'
                }}>
                    {mensaje.texto}
                </div>
            )}

            {/* Formulario de Simulación */}
            <form onSubmit={handleSugerir} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>

                <div>
                    <label><strong>Comisión:</strong></label><br />
                    <select name="comisionId" value={formData.comisionId} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                        <option value="">-- Seleccione una comisión --</option>
                        {comisiones.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.materia?.nombre} - Comisión: {c.codigo} ({c.cantidadEstimadaAlumnos} alumnos)
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label><strong>Día:</strong></label><br />
                        <select name="dia" value={formData.dia} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(dia => (
                                <option key={dia} value={dia}>{dia}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label><strong>Hora Inicio:</strong></label><br />
                        <input type="time" name="horaInicio" value={formData.horaInicio} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                    </div>

                    <div style={{ flex: 1 }}>
                        <label><strong>Hora Fin:</strong></label><br />
                        <input type="time" name="horaFin" value={formData.horaFin} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                    </div>
                </div>

                <button type="submit" disabled={cargando} style={{ padding: '10px', backgroundColor: '#0055a4', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    {cargando ? 'Buscando aulas...' : 'Buscar Aulas Sugeridas'}
                </button>
            </form>

            {/* Resultados del Motor Inteligente */}
            {sugerencias.length > 0 && (
                <div>
                    <h3>Aulas Sugeridas</h3>
                    <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f4f4f4' }}>
                                <th>Aula</th>
                                <th>Capacidad</th>
                                <th>Equipamiento</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sugerencias.map(aula => (
                                <tr key={aula._id}>
                                    <td><strong>{aula.nombre}</strong> <br /> <small>{aula.tipoEspacio}</small></td>
                                    <td>{aula.capacidad}</td>
                                    <td>{aula.equipamiento.join(', ') || 'Ninguno'}</td>
                                    <td>
                                        <button
                                            onClick={() => handleAsignar(aula._id)}
                                            style={{ padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
                                        >
                                            Asignar Oficialmente
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SimuladorAsignacion;