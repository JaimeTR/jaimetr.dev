'use client'
import { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiCheck, FiX } from 'react-icons/fi'
import { AVAILABLE_ICONS } from '@/helpers/iconsMap'

export function ManageSkills() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    const token = localStorage.getItem('adminToken')
    const res = await fetch('/api/admin/db/skills', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const json = await res.json()
    if (json.success) {
      setSkills(json.data.sort((a, b) => a.sort_order - b.sort_order))
    }
    setLoading(false)
  }

  const startCreate = () => {
    setIsCreating(true)
    setEditForm({ name: '', category: 'frontend', icon_name: 'SiJavascript', sort_order: 0, proficiency: 100 })
    setEditingId('new')
  }

  const startEdit = (skill) => {
    setEditForm(skill)
    setEditingId(skill.id)
    setIsCreating(false)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
    setIsCreating(false)
  }

  const saveSkill = async () => {
    const token = localStorage.getItem('adminToken')
    const method = isCreating ? 'POST' : 'PUT'
    const payload = isCreating ? editForm : { id: editingId, ...editForm }

    const res = await fetch('/api/admin/db/skills', {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      fetchSkills()
      cancelEdit()
    }
  }

  const deleteSkill = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta tecnología?')) return
    const token = localStorage.getItem('adminToken')
    const res = await fetch(`/api/admin/db/skills?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) fetchSkills()
  }

  if (loading) return <div className="text-center py-10">Cargando habilidades...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-dark-900 dark:text-white">Gestión de Tecnologías</h2>
        <button 
          onClick={startCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FiPlus /> Nueva Tecnología
        </button>
      </div>

      <div className="bg-white dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-dark-50 dark:bg-dark-800 border-b border-dark-200 dark:border-dark-700">
            <tr>
              <th className="px-4 py-3 text-dark-600 dark:text-dark-300">Nombre</th>
              <th className="px-4 py-3 text-dark-600 dark:text-dark-300">Categoría</th>
              <th className="px-4 py-3 text-dark-600 dark:text-dark-300">Icono (react-icons)</th>
              <th className="px-4 py-3 text-dark-600 dark:text-dark-300">Orden</th>
              <th className="px-4 py-3 text-right text-dark-600 dark:text-dark-300">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-200 dark:divide-dark-800">
            {isCreating && (
              <tr className="bg-blue-50/50 dark:bg-blue-900/10">
                <td className="px-4 py-3">
                  <input 
                    type="text" 
                    value={editForm.name || ''} 
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-transparent border-b border-blue-500 focus:outline-none"
                    placeholder="Ej. React"
                  />
                </td>
                <td className="px-4 py-3">
                  <select 
                    value={editForm.category || 'frontend'} 
                    onChange={e => setEditForm({...editForm, category: e.target.value})}
                    className="bg-transparent border-b border-blue-500 focus:outline-none"
                  >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="learning">Aprendiendo</option>
                    <option value="tools">Herramientas</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select 
                    value={editForm.icon_name || ''} 
                    onChange={e => setEditForm({...editForm, icon_name: e.target.value})}
                    className="w-full bg-transparent border-b border-blue-500 focus:outline-none"
                  >
                    <option value="">Selecciona icono</option>
                    {AVAILABLE_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input 
                    type="number" 
                    value={editForm.sort_order || 0} 
                    onChange={e => setEditForm({...editForm, sort_order: parseInt(e.target.value)})}
                    className="w-16 bg-transparent border-b border-blue-500 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={saveSkill} className="p-1 text-green-600 hover:bg-green-100 rounded"><FiCheck size={18} /></button>
                    <button onClick={cancelEdit} className="p-1 text-red-600 hover:bg-red-100 rounded"><FiX size={18} /></button>
                  </div>
                </td>
              </tr>
            )}

            {skills.map(skill => (
              <tr key={skill.id} className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                {editingId === skill.id ? (
                  <>
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        value={editForm.name || ''} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                        className="w-full bg-transparent border-b border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select 
                        value={editForm.category || 'frontend'} 
                        onChange={e => setEditForm({...editForm, category: e.target.value})}
                        className="bg-transparent border-b border-blue-500 focus:outline-none"
                      >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="learning">Aprendiendo</option>
                        <option value="tools">Herramientas</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select 
                        value={editForm.icon_name || ''} 
                        onChange={e => setEditForm({...editForm, icon_name: e.target.value})}
                        className="w-full bg-transparent border-b border-blue-500 focus:outline-none"
                      >
                        <option value="">Selecciona icono</option>
                        {AVAILABLE_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        value={editForm.sort_order || 0} 
                        onChange={e => setEditForm({...editForm, sort_order: parseInt(e.target.value)})}
                        className="w-16 bg-transparent border-b border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={saveSkill} className="p-1 text-green-600 hover:bg-green-100 rounded"><FiCheck size={18} /></button>
                        <button onClick={cancelEdit} className="p-1 text-red-600 hover:bg-red-100 rounded"><FiX size={18} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-medium text-dark-900 dark:text-white">{skill.name}</td>
                    <td className="px-4 py-3 text-dark-600 dark:text-dark-300 capitalize">{skill.category}</td>
                    <td className="px-4 py-3 text-dark-600 dark:text-dark-300">{skill.icon_name}</td>
                    <td className="px-4 py-3 text-dark-600 dark:text-dark-300">{skill.sort_order}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(skill)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg"><FiEdit2 /></button>
                        <button onClick={() => deleteSkill(skill.id)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg"><FiTrash2 /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
