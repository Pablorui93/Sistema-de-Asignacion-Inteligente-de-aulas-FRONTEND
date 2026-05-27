import { useEffect, useState } from 'react';
import api from '../../services/api';

const ComisionesList = () => {
    const [comisiones, setComisiones] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [editandoId, setEditandoId] = useState(null);

    const [nuevaComision, setNuevaComision] = useState({
        materia: '', codigo: '', cantidadEstimadaAlumnos: '', docenteId: '', requerimientosEspecificos: ''
    });

    const fetchData = async () => {
        const [resC, resM, resD] = await Promise.all([api.get('/comisiones'), api.get('/materias'), api.get('/docentes')]);
        setComisiones(resC.data); setMaterias(resM.data); setDocentes(resD.data);
    };

    useEffect(() => { fetchData(); }, []);

    const handleChange = (e) => setNuevaComision({ ...nuevaComision, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const reqArray = typeof nuevaComision.requerimientosEspecificos === 'string'
                ? nuevaComision.requerimientosEspecificos.split(',').map(i => i.trim()).filter(i => i !== '')
                : nuevaComision.requerimientosEspecificos;

            const payload = { ...nuevaComision, cantidadEstimadaAlumnos: Number(nuevaComision.cantidadEstimadaAlumnos), docentes: nuevaComision.docenteId ? [nuevaComision.docenteId] : [], requerimientosEspecificos: reqArray };

            if (editandoId) await api.put(`/comisiones/${editandoId}`, payload);
            else await api.post('/comisiones', payload);

            setEditandoId(null);
            setNuevaComision({ materia: '', codigo: '', cantidadEstimadaAlumnos: '', docenteId: '', requerimientosEspecificos: '' });
            fetchData();
        } catch (err) { alert('Error al guardar'); }
    };

    const handleEdit = (c) => {
        setEditandoId(c._id);
        setNuevaComision({
            materia: c.materia?._id || '',
            codigo: c.codigo,
            cantidadEstimadaAlumnos: c.cantidadEstimadaAlumnos,
            docenteId: c.docentes?.length > 0 ? c.docentes[0]._id : '',
            requerimientosEspecificos: c.requerimientosEspecificos?.join(', ') || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar comisión?')) {
            await api.delete(`/comisiones/${id}`);
            fetchData();
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2>Gestión de Comisiones</h2>
            <div style={{ backgroundColor: editandoId ? '#fff3cd' : '#f4f4f4', padding: '20px', marginBottom: '20px', borderRadius: '5px' }}>
                <h3>{editandoId ? 'Editar Comisión' : 'Nueva Comisión'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    <div style={{ flex: '1 1 250px' }}><label>Materia:</label><br /><select name="materia" value={nuevaComision.materia} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}><option value="">-- Seleccione --</option>{materias.map(m => <option key={m._id} value={m._id}>{m.nombre}</option>)}</select></div>
                    <div style={{ flex: '1 1 120px' }}><label>Código:</label><br /><input type="text" name="codigo" value={nuevaComision.codigo} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} /></div>
                    <div style={{ flex: '1 1 120px' }}><label>Cupo:</label><br /><input type="number" name="cantidadEstimadaAlumnos" value={nuevaComision.cantidadEstimadaAlumnos} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} /></div>
                    <div style={{ flex: '1 1 250px' }}><label>Docente:</label><br /><select name="docenteId" value={nuevaComision.docenteId} onChange={handleChange} style={{ width: '100%', padding: '8px' }}><option value="">-- Seleccione --</option>{docentes.map(d => <option key={d._id} value={d._id}>{d.apellido}, {d.nombre}</option>)}</select></div>
                    <div style={{ flex: '1 1 100%' }}><label>Requerimientos:</label><br /><input type="text" name="requerimientosEspecificos" value={nuevaComision.requerimientosEspecificos} onChange={handleChange} style={{ width: '100%', padding: '8px' }} /></div>
                    <div style={{ flex: '1 1 100%' }}>
                        <button type="submit" style={{ padding: '10px 20px', backgroundColor: editandoId ? '#ffc107' : '#28a745', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>{editandoId ? 'Actualizar' : 'Guardar'}</button>
                        {editandoId && <button type="button" onClick={() => { setEditandoId(null); setNuevaComision({ materia: '', codigo: '', cantidadEstimadaAlumnos: '', docenteId: '', requerimientosEspecificos: '' }); }} style={{ padding: '10px 20px', marginLeft: '10px' }}>Cancelar</button>}
                    </div>
                </form>
            </div>

            <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#0055a4', color: 'white' }}><tr><th>Código</th><th>Materia</th><th>Alumnos</th><th>Docente</th><th>Acciones</th></tr></thead>
                <tbody>
                    {comisiones.map(c => (
                        <tr key={c._id}><td>{c.codigo}</td><td>{c.materia?.nombre}</td><td>{c.cantidadEstimadaAlumnos}</td><td>{c.docentes?.map(d => d.apellido).join('/')}</td>
                            <td>
                                <button onClick={() => handleEdit(c)} style={{ marginRight: '5px', backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Editar</button>
                                <button onClick={() => handleDelete(c._id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Eliminar</button>
                            </td></tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default ComisionesList;