import { useEffect, useState } from 'react';
import api from '../../services/api';

const MateriasList = () => {
    const [materias, setMaterias] = useState([]);
    const [editandoId, setEditandoId] = useState(null);

    const [nuevaMateria, setNuevaMateria] = useState({
        nombre: '', carrera: '', anioAcademico: '1', tipoCursada: 'Anual', cargaHorariaSemanal: '', necesidadesInfraestructura: ''
    });

    const fetchMaterias = async () => {
        const respuesta = await api.get('/materias');
        setMaterias(respuesta.data);
    };

    useEffect(() => { fetchMaterias(); }, []);

    const handleChange = (e) => setNuevaMateria({ ...nuevaMateria, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const infraArray = typeof nuevaMateria.necesidadesInfraestructura === 'string'
                ? nuevaMateria.necesidadesInfraestructura.split(',').map(i => i.trim()).filter(i => i !== '')
                : nuevaMateria.necesidadesInfraestructura;

            const payload = { ...nuevaMateria, anioAcademico: Number(nuevaMateria.anioAcademico), cargaHorariaSemanal: Number(nuevaMateria.cargaHorariaSemanal), necesidadesInfraestructura: infraArray };

            if (editandoId) {
                await api.put(`/materias/${editandoId}`, payload);
                setEditandoId(null);
            } else {
                await api.post('/materias', payload);
            }
            setNuevaMateria({ nombre: '', carrera: '', anioAcademico: '1', tipoCursada: 'Anual', cargaHorariaSemanal: '', necesidadesInfraestructura: '' });
            fetchMaterias();
        } catch (err) { alert('Error al guardar la materia'); }
    };

    const handleEdit = (m) => {
        setEditandoId(m._id);
        setNuevaMateria({ ...m, necesidadesInfraestructura: m.necesidadesInfraestructura?.join(', ') || '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar materia?')) {
            await api.delete(`/materias/${id}`);
            fetchMaterias();
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2>Gestión de Materias</h2>
            <div style={{ backgroundColor: editandoId ? '#fff3cd' : '#f4f4f4', padding: '20px', marginBottom: '20px', borderRadius: '5px' }}>
                <h3>{editandoId ? 'Editar Materia' : 'Nueva Materia'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ flex: '1 1 250px' }}><label>Nombre:</label><br /><input type="text" name="nombre" value={nuevaMateria.nombre} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} /></div>
                    <div style={{ flex: '1 1 250px' }}><label>Carrera:</label><br /><input type="text" name="carrera" value={nuevaMateria.carrera} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} /></div>
                    <div style={{ flex: '1 1 120px' }}><label>Año:</label><br /><select name="anioAcademico" value={nuevaMateria.anioAcademico} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>{['1', '2', '3', '4', '5'].map(a => <option key={a} value={a}>{a}° Año</option>)}</select></div>
                    <div style={{ flex: '1 1 180px' }}><label>Cursada:</label><br /><select name="tipoCursada" value={nuevaMateria.tipoCursada} onChange={handleChange} style={{ width: '100%', padding: '8px' }}><option value="Anual">Anual</option><option value="Primer Cuatrimestre">1° Cuatrimestre</option><option value="Segundo Cuatrimestre">2° Cuatrimestre</option></select></div>
                    <div style={{ flex: '1 1 120px' }}><label>Hs Semanales:</label><br /><input type="number" name="cargaHorariaSemanal" value={nuevaMateria.cargaHorariaSemanal} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} /></div>
                    <div style={{ flex: '1 1 250px' }}><label>Requisitos:</label><br /><input type="text" name="necesidadesInfraestructura" value={nuevaMateria.necesidadesInfraestructura} onChange={handleChange} style={{ width: '100%', padding: '8px' }} /></div>
                    <div style={{ flex: '1 1 100%' }}>
                        <button type="submit" style={{ padding: '10px 20px', backgroundColor: editandoId ? '#ffc107' : '#28a745', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>{editandoId ? 'Actualizar' : 'Guardar'}</button>
                        {editandoId && <button type="button" onClick={() => { setEditandoId(null); setNuevaMateria({ nombre: '', carrera: '', anioAcademico: '1', tipoCursada: 'Anual', cargaHorariaSemanal: '', necesidadesInfraestructura: '' }); }} style={{ padding: '10px 20px', marginLeft: '10px' }}>Cancelar</button>}
                    </div>
                </form>
            </div>

            <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#0055a4', color: 'white' }}><tr><th>Materia</th><th>Carrera</th><th>Régimen</th><th>Requisitos</th><th>Acciones</th></tr></thead>
                <tbody>
                    {materias.map(m => (
                        <tr key={m._id}><td>{m.nombre}</td><td>{m.carrera} ({m.anioAcademico}°)</td><td>{m.tipoCursada}</td><td>{m.necesidadesInfraestructura?.join(', ')}</td>
                            <td>
                                <button onClick={() => handleEdit(m)} style={{ marginRight: '5px', backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Editar</button>
                                <button onClick={() => handleDelete(m._id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Eliminar</button>
                            </td></tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default MateriasList;