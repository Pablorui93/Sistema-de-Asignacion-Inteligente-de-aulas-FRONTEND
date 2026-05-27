import { useEffect, useState } from 'react';
import api from '../../services/api';

const DocentesList = () => {
    const [docentes, setDocentes] = useState([]);
    const [editandoId, setEditandoId] = useState(null);

    const [nuevoDocente, setNuevoDocente] = useState({ nombre: '', apellido: '', legajo: '', incompatibilidadesRecurrentes: '' });
    const [disponibilidadTemp, setDisponibilidadTemp] = useState([]);
    const [franjaActual, setFranjaActual] = useState({ dia: 'Lunes', horaInicio: '', horaFin: '' });

    const fetchDocentes = async () => {
        const respuesta = await api.get('/docentes');
        setDocentes(respuesta.data);
    };

    useEffect(() => { fetchDocentes(); }, []);

    const handleChangeDocente = (e) => setNuevoDocente({ ...nuevoDocente, [e.target.name]: e.target.value });
    const handleChangeFranja = (e) => setFranjaActual({ ...franjaActual, [e.target.name]: e.target.value });

    const agregarFranja = () => {
        if (franjaActual.horaInicio && franjaActual.horaFin) {
            setDisponibilidadTemp([...disponibilidadTemp, franjaActual]);
            setFranjaActual({ ...franjaActual, horaInicio: '', horaFin: '' });
        }
    };
    const eliminarFranja = (i) => setDisponibilidadTemp(disponibilidadTemp.filter((_, index) => index !== i));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...nuevoDocente, disponibilidad: disponibilidadTemp };
            if (editandoId) await api.put(`/docentes/${editandoId}`, payload);
            else await api.post('/docentes', payload);

            setEditandoId(null);
            setNuevoDocente({ nombre: '', apellido: '', legajo: '', incompatibilidadesRecurrentes: '' });
            setDisponibilidadTemp([]);
            fetchDocentes();
        } catch (err) { alert('Error al guardar'); }
    };

    const handleEdit = (d) => {
        setEditandoId(d._id);
        setNuevoDocente({ nombre: d.nombre, apellido: d.apellido, legajo: d.legajo, incompatibilidadesRecurrentes: d.incompatibilidadesRecurrentes || '' });
        setDisponibilidadTemp(d.disponibilidad || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar docente?')) {
            await api.delete(`/docentes/${id}`);
            fetchDocentes();
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2>Gestión de Docentes</h2>
            <div style={{ backgroundColor: editandoId ? '#fff3cd' : '#f4f4f4', padding: '20px', marginBottom: '20px', borderRadius: '5px' }}>
                <h3>{editandoId ? 'Editar Docente' : 'Nuevo Docente'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1 }}><label>Nombre:</label><br /><input type="text" name="nombre" value={nuevoDocente.nombre} onChange={handleChangeDocente} required style={{ width: '100%', padding: '8px' }} /></div>
                        <div style={{ flex: 1 }}><label>Apellido:</label><br /><input type="text" name="apellido" value={nuevoDocente.apellido} onChange={handleChangeDocente} required style={{ width: '100%', padding: '8px' }} /></div>
                        <div style={{ flex: 1 }}><label>Legajo:</label><br /><input type="text" name="legajo" value={nuevoDocente.legajo} onChange={handleChangeDocente} required style={{ width: '100%', padding: '8px' }} /></div>
                    </div>

                    <div style={{ padding: '15px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
                        <h4>Disponibilidad</h4>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                            <select name="dia" value={franjaActual.dia} onChange={handleChangeFranja} style={{ padding: '8px' }}>{['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(d => <option key={d}>{d}</option>)}</select>
                            <input type="time" name="horaInicio" value={franjaActual.horaInicio} onChange={handleChangeFranja} style={{ padding: '8px' }} />
                            <input type="time" name="horaFin" value={franjaActual.horaFin} onChange={handleChangeFranja} style={{ padding: '8px' }} />
                            <button type="button" onClick={agregarFranja} style={{ padding: '9px 15px', backgroundColor: '#17a2b8', color: 'white', border: 'none', cursor: 'pointer' }}>+ Agregar</button>
                        </div>
                        <ul>{disponibilidadTemp.map((f, i) => <li key={i}>{f.dia}: {f.horaInicio}-{f.horaFin} <button type="button" onClick={() => eliminarFranja(i)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>[X]</button></li>)}</ul>
                    </div>

                    <div><label>Notas:</label><br /><input type="text" name="incompatibilidadesRecurrentes" value={nuevoDocente.incompatibilidadesRecurrentes} onChange={handleChangeDocente} style={{ width: '100%', padding: '8px' }} /></div>

                    <div>
                        <button type="submit" style={{ padding: '10px 20px', backgroundColor: editandoId ? '#ffc107' : '#28a745', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>{editandoId ? 'Actualizar' : 'Guardar'}</button>
                        {editandoId && <button type="button" onClick={() => { setEditandoId(null); setNuevoDocente({ nombre: '', apellido: '', legajo: '', incompatibilidadesRecurrentes: '' }); setDisponibilidadTemp([]); }} style={{ padding: '10px 20px', marginLeft: '10px' }}>Cancelar</button>}
                    </div>
                </form>
            </div>

            <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#0055a4', color: 'white' }}><tr><th>Legajo</th><th>Nombre</th><th>Franjas</th><th>Acciones</th></tr></thead>
                <tbody>
                    {docentes.map(d => (
                        <tr key={d._id}><td>{d.legajo}</td><td>{d.apellido}, {d.nombre}</td><td>{d.disponibilidad?.length} franjas</td>
                            <td>
                                <button onClick={() => handleEdit(d)} style={{ marginRight: '5px', backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Editar</button>
                                <button onClick={() => handleDelete(d._id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Eliminar</button>
                            </td></tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default DocentesList;