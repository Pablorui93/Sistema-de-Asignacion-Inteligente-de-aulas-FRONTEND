import { useEffect, useState } from 'react';
import api from '../../services/api';

const AulasList = () => {
    const [aulas, setAulas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Nuevo estado para saber si estamos creando o editando
    const [editandoId, setEditandoId] = useState(null);

    const [nuevaAula, setNuevaAula] = useState({
        nombre: '', capacidad: '', tipoEspacio: 'Aula Común', estadoOperativo: 'Disponible', equipamiento: ''
    });

    const fetchAulas = async () => {
        try {
            const respuesta = await api.get('/aulas');
            setAulas(respuesta.data);
        } catch (err) {
            setError('Hubo un problema al cargar las aulas.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchAulas();
    }, []);

    const handleChange = (e) => {
        setNuevaAula({ ...nuevaAula, [e.target.name]: e.target.value });
    };

    // Función Guardar (Sirve tanto para Crear como para Editar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const equipamientoArray = typeof nuevaAula.equipamiento === 'string'
                ? nuevaAula.equipamiento.split(',').map(item => item.trim()).filter(item => item !== '')
                : nuevaAula.equipamiento;

            const payload = {
                ...nuevaAula,
                capacidad: Number(nuevaAula.capacidad),
                equipamiento: equipamientoArray
            };

            if (editandoId) {
                // Si hay un ID, estamos EDITANDO (PUT)
                await api.put(`/aulas/${editandoId}`, payload);
                setEditandoId(null); // Salimos del modo edición
            } else {
                // Si no hay ID, estamos CREANDO (POST)
                await api.post('/aulas', payload);
            }

            setNuevaAula({ nombre: '', capacidad: '', tipoEspacio: 'Aula Común', estadoOperativo: 'Disponible', equipamiento: '' });
            fetchAulas();
        } catch (err) {
            alert(err.response?.data?.mensaje || 'Error al guardar el aula');
        }
    };

    // Función para cargar los datos en el formulario al tocar "Editar"
    const handleEdit = (aula) => {
        setEditandoId(aula._id);
        setNuevaAula({
            nombre: aula.nombre,
            capacidad: aula.capacidad,
            tipoEspacio: aula.tipoEspacio,
            estadoOperativo: aula.estadoOperativo,
            equipamiento: aula.equipamiento ? aula.equipamiento.join(', ') : ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube la pantalla hasta el formulario
    };

    // Función para Eliminar
    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseás eliminar esta aula? Esta acción no se puede deshacer.')) {
            try {
                await api.delete(`/aulas/${id}`);
                fetchAulas();
            } catch (err) {
                alert('Error al eliminar el aula');
            }
        }
    };

    // Función para cancelar la edición
    const cancelarEdicion = () => {
        setEditandoId(null);
        setNuevaAula({ nombre: '', capacidad: '', tipoEspacio: 'Aula Común', estadoOperativo: 'Disponible', equipamiento: '' });
    };

    if (cargando) return <p>Cargando aulas...</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2>Gestión de Aulas</h2>

            <div style={{ backgroundColor: editandoId ? '#fff3cd' : '#f4f4f4', padding: '20px', marginBottom: '20px', borderRadius: '5px', border: editandoId ? '1px solid #ffeeba' : 'none' }}>
                <h3>{editandoId ? 'Editar Aula' : 'Registrar Nueva Aula'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>

                    <div style={{ flex: '1 1 200px' }}>
                        <label>Nombre:</label><br />
                        <input type="text" name="nombre" value={nuevaAula.nombre} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                    </div>

                    <div style={{ flex: '1 1 100px' }}>
                        <label>Capacidad:</label><br />
                        <input type="number" name="capacidad" value={nuevaAula.capacidad} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} min="1" />
                    </div>

                    <div style={{ flex: '1 1 200px' }}>
                        <label>Tipo de Espacio:</label><br />
                        <select name="tipoEspacio" value={nuevaAula.tipoEspacio} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                            <option value="Aula Común">Aula Común</option>
                            <option value="Laboratorio">Laboratorio</option>
                            <option value="Gabinete">Gabinete</option>
                            <option value="Auditorio">Auditorio</option>
                            <option value="Salón Especial">Salón Especial</option>
                        </select>
                    </div>

                    <div style={{ flex: '1 1 200px' }}>
                        <label>Equipamiento (comas):</label><br />
                        <input type="text" name="equipamiento" value={nuevaAula.equipamiento} onChange={handleChange} placeholder="Ej: Proyector, PCs" style={{ width: '100%', padding: '8px' }} />
                    </div>

                    <div style={{ flex: '1 1 100%', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                        <button type="submit" style={{ padding: '10px 20px', backgroundColor: editandoId ? '#ffc107' : '#28a745', color: editandoId ? 'black' : 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            {editandoId ? 'Actualizar Aula' : 'Guardar Aula'}
                        </button>
                        {editandoId && (
                            <button type="button" onClick={cancelarEdicion} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {aulas.length === 0 ? (
                <p>No hay aulas registradas en el sistema.</p>
            ) : (
                <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#0055a4', color: 'white' }}>
                        <tr>
                            <th>Nombre</th>
                            <th>Capacidad</th>
                            <th>Tipo</th>
                            <th>Equipamiento</th>
                            <th>Estado</th>
                            <th>Acciones</th> {/* NUEVA COLUMNA */}
                        </tr>
                    </thead>
                    <tbody>
                        {aulas.map((aula) => (
                            <tr key={aula._id}>
                                <td><strong>{aula.nombre}</strong></td>
                                <td>{aula.capacidad} al.</td>
                                <td>{aula.tipoEspacio}</td>
                                <td>{aula.equipamiento?.join(', ') || '-'}</td>
                                <td>
                                    <span style={{ color: aula.estadoOperativo === 'Disponible' ? 'green' : 'red' }}>{aula.estadoOperativo}</span>
                                </td>
                                <td>
                                    <button onClick={() => handleEdit(aula)} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', cursor: 'pointer' }}>
                                        Editar
                                    </button>
                                    <button onClick={() => handleDelete(aula._id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
                                        Eliminar
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

export default AulasList;