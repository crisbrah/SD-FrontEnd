/**
 * Extrae un mensaje legible del error Axios/red para mostrarlo en toast.
 */
export function getErrorMessage(error: unknown): string {
  const e = error as {
    code?: string
    message?: string
    response?: { status: number; data?: { message?: string; data?: Record<string, string> } }
  }

  // Sin respuesta → backend caído o sin red
  if (!e?.response) {
    return 'No se pudo conectar al servidor. Asegúrate de que el backend esté iniciado en localhost:8080.'
  }

  const status = e.response.status
  const msg = e.response.data?.message

  // Errores de validación con detalle por campo
  const fieldErrors = e.response.data?.data
  if (fieldErrors && typeof fieldErrors === 'object') {
    const first = Object.values(fieldErrors)[0]
    if (first) return first
  }

  if (status === 400) return msg ?? 'Datos inválidos. Verifica los campos.'
  if (status === 401) return 'Sesión expirada. Inicia sesión nuevamente.'
  if (status === 403) return 'No tienes permisos para esta acción.'
  if (status === 404) return msg ?? 'Recurso no encontrado.'
  if (status === 409) return msg ?? 'El registro ya existe.'
  if (status === 422) return msg ?? 'Datos no procesables. Verifica la información.'
  if (status === 500) return 'Error interno del servidor. Contacta al administrador.'

  return msg ?? e.message ?? 'Error inesperado. Intenta nuevamente.'
}
