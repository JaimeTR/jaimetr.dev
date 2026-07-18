'use client'
import { useState, useEffect } from 'react'
import { Reorder } from 'framer-motion'
import { FiX, FiMenu, FiEye, FiEyeOff, FiSave } from 'react-icons/fi'

export function ManageSectionsModal({ sections, onClose, onSave }) {
    const [localSections, setLocalSections] = useState([...sections])
    const [saving, setSaving] = useState(false)

    // Sincronizar el estado interno si las secciones externas cambian
    useEffect(() => {
        setLocalSections([...sections])
    }, [sections])

    const handleSave = async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/admin/sections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + (localStorage.getItem('adminToken'))
                },
                body: JSON.stringify({ sections: localSections })
            })
            
            if (response.ok) {
                onSave(localSections)
            }
        } catch (error) {
            console.error('Error guardando secciones', error)
        } finally {
            setSaving(false)
        }
    }

    const toggleVisibility = (id) => {
        setLocalSections(localSections.map(s => 
            s.id === id ? { ...s, is_hidden: !s.is_hidden } : s
        ))
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950">
                    <h2 className="text-lg font-bold text-dark-900 dark:text-white">Ordenar Secciones</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-dark-500 hover:text-dark-900 dark:hover:text-white hover:bg-dark-200 dark:hover:bg-dark-800 rounded-lg transition"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body (Reorder List) */}
                <div className="p-4 overflow-y-auto">
                    <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
                        Arrastra para reordenar las secciones. Este orden se reflejará tanto en tu Landing Page como en las pestañas del administrador.
                    </p>
                    
                    <Reorder.Group 
                        axis="y" 
                        values={localSections} 
                        onReorder={setLocalSections} 
                        className="flex flex-col gap-2"
                    >
                        {localSections.map(section => (
                            <Reorder.Item 
                                key={section.id} 
                                value={section}
                                className={"flex items-center justify-between p-3 rounded-lg border bg-dark-50 dark:bg-dark-800 cursor-grab active:cursor-grabbing transition " + (section.is_hidden ? 'border-dark-200 dark:border-dark-700 opacity-60' : 'border-blue-200 dark:border-blue-900/50')}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-dark-400">
                                        <FiMenu size={18} />
                                    </div>
                                    <span className={"font-medium text-dark-900 dark:text-white " + (section.is_hidden ? 'line-through' : '')}>
                                        {section.label}
                                    </span>
                                </div>
                                
                                <button 
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => { e.stopPropagation(); toggleVisibility(section.id) }}
                                    className={`p-2 rounded transition ${section.is_hidden ? 'text-dark-500 bg-dark-200 dark:bg-dark-700' : 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'}`}
                                    title={section.is_hidden ? "Sección oculta - Clic para mostrar" : "Sección visible - Clic para ocultar"}
                                >
                                    {section.is_hidden ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-950 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-800 rounded-lg transition"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-blue-600 rounded-lg transition"
                    >
                        {saving ? 'Guardando...' : (
                            <>
                                <FiSave size={16} />
                                Guardar Orden
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
