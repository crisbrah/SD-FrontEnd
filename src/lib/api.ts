import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://sd-backend-s7yo.onrender.com'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Request interceptor: inject JWT ──────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response interceptor: handle errors ──────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    // Señalizar que el backend está disponible
    window.dispatchEvent(new CustomEvent('api:status', { detail: { online: true } }))
    return response
  },
  async (error) => {
    const original = error.config

    // Error de red: backend no disponible (ERR_CONNECTION_REFUSED, timeout, etc.)
    if (!error.response) {
      window.dispatchEvent(new CustomEvent('api:status', { detail: { online: false } }))
      return Promise.reject(error)
    }

    // Backend respondió → señalizar online
    window.dispatchEvent(new CustomEvent('api:status', { detail: { online: true } }))

    // 401 → intentar refresh o redirigir a login
    if (error.response.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken })
          const newToken = data.data.token
          localStorage.setItem('token', newToken)
          original.headers.Authorization = `Bearer ${newToken}`
          return api(original)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      } else {
        localStorage.clear()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authService = {
  signIn: (email: string, password: string) =>
    api.post('/auth/signin', { email, password }),

  signUp: (data: {
    email: string; password: string; nombres: string
    apePat: string; apeMat: string; dni: string; fechaNacimiento: string
  }) => api.post('/auth/signup', data),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh-token', { refreshToken }),

  googleLogin: (idToken: string) =>
    api.post('/auth/google', { idToken }),

  googleSignUp: (data: {
    idToken: string; email: string; nombres: string
    apePat: string; apeMat: string; dni: string; fechaNacimiento: string
  }) => api.post('/auth/google/signup', data),

  // Consulta RENIEC pública por DNI (sin auth) — para pre-rellenar formulario de registro
  consultarReniec: (dni: string) =>
    api.get(`/auth/reniec/${dni}`),

  // Bootstrap: promueve un usuario a SUPER_ADMIN (solo cuando no existe ninguno)
  bootstrap: (email: string) =>
    api.post(`/auth/bootstrap?email=${encodeURIComponent(email)}`),
}

// ── Admin — aprobación de miembros ────────────────────────────────────────────
export const adminService = {
  miembrosPendientes: () =>
    api.get('/api/v1/admin/miembros/pendientes'),

  aprobar: (id: number) =>
    api.put(`/api/v1/admin/miembros/${id}/aprobar`),

  rechazar: (id: number) =>
    api.put(`/api/v1/admin/miembros/${id}/rechazar`),
}

// ── Personas ──────────────────────────────────────────────────────────────────
export const personaService = {
  listar: (page = 0, size = 20) =>
    api.get(`/api/v1/personas?page=${page}&size=${size}`),

  buscarPorNombre: (nombre: string, page = 0, size = 20) =>
    api.get(`/api/v1/personas?nombre=${encodeURIComponent(nombre)}&page=${page}&size=${size}`),

  buscarPorId: (id: number) =>
    api.get(`/api/v1/personas/${id}`),

  buscarPorDni: (dni: string) =>
    api.get(`/api/v1/personas/dni/${dni}`),

  cumpleanios: (mes?: number) =>
    mes
      ? api.get(`/api/v1/personas/cumpleanios/mes/${mes}`)
      : api.get('/api/v1/personas/cumpleanios'),

  crear: (data: object) =>
    api.post('/api/v1/personas', data),

  actualizar: (id: number, data: object) =>
    api.put(`/api/v1/personas/${id}`, data),

  eliminar: (id: number) =>
    api.delete(`/api/v1/personas/${id}`),
}

// ── Miembros ──────────────────────────────────────────────────────────────────
export const miembroService = {
  listar: (page = 0, size = 20) =>
    api.get(`/api/v1/miembros?page=${page}&size=${size}`),

  buscarPorId: (id: number) =>
    api.get(`/api/v1/miembros/${id}`),

  crear: (data: object) =>
    api.post('/api/v1/miembros', data),

  actualizar: (id: number, data: object) =>
    api.put(`/api/v1/miembros/${id}`, data),

  eliminar: (id: number) =>
    api.delete(`/api/v1/miembros/${id}`),

  roles: (miembroId: number) =>
    api.get(`/api/v1/miembros/${miembroId}/roles`),

  asignarRol: (miembroId: number, rolId: number) =>
    api.post(`/api/v1/miembros/${miembroId}/roles`, { rolId }),

  quitarRol: (miembroId: number, rolId: number) =>
    api.delete(`/api/v1/miembros/${miembroId}/roles/${rolId}`),
}

// ── Roles ─────────────────────────────────────────────────────────────────────
export const rolService = {
  listar: () =>
    api.get('/api/v1/roles'),

  buscarPorId: (id: number) =>
    api.get(`/api/v1/roles/${id}`),

  crear: (data: object) =>
    api.post('/api/v1/roles', data),

  actualizar: (id: number, data: object) =>
    api.put(`/api/v1/roles/${id}`, data),

  eliminar: (id: number) =>
    api.delete(`/api/v1/roles/${id}`),
}

// ── Células ───────────────────────────────────────────────────────────────────
// Backend espera: { nombreCelula, tipoCelula }
export const celulaService = {
  listar: (page = 0, size = 20) =>
    api.get(`/api/v1/celulas?page=${page}&size=${size}`),

  buscarPorId: (id: number) =>
    api.get(`/api/v1/celulas/${id}`),

  crear: (data: { nombre: string; tipoCelula: string }) =>
    api.post('/api/v1/celulas', { nombreCelula: data.nombre, tipoCelula: data.tipoCelula }),

  actualizar: (id: number, data: { nombre: string; tipoCelula: string }) =>
    api.put(`/api/v1/celulas/${id}`, { nombreCelula: data.nombre, tipoCelula: data.tipoCelula }),

  eliminar: (id: number) =>
    api.delete(`/api/v1/celulas/${id}`),
}

// ── Ministerios ───────────────────────────────────────────────────────────────
// Backend espera: { nombreMinisterio }
export const ministerioService = {
  listar: (page = 0, size = 20) =>
    api.get(`/api/v1/ministerios?page=${page}&size=${size}`),

  buscarPorId: (id: number) =>
    api.get(`/api/v1/ministerios/${id}`),

  crear: (data: { nombre: string }) =>
    api.post('/api/v1/ministerios', { nombreMinisterio: data.nombre }),

  actualizar: (id: number, data: { nombre: string }) =>
    api.put(`/api/v1/ministerios/${id}`, { nombreMinisterio: data.nombre }),

  eliminar: (id: number) =>
    api.delete(`/api/v1/ministerios/${id}`),

  miembros: (ministerioId: number) =>
    api.get(`/api/v1/ministerios/${ministerioId}/miembros`),

  // Backend espera: { miembroId, fechaIngreso? }
  agregarMiembro: (ministerioId: number, miembroId: number) =>
    api.post(`/api/v1/ministerios/${ministerioId}/miembros`, { miembroId }),

  quitarMiembro: (ministerioId: number, miembroId: number) =>
    api.delete(`/api/v1/ministerios/${ministerioId}/miembros/${miembroId}`),
}

// ── Sedes ─────────────────────────────────────────────────────────────────────
// Backend espera: { nombreSede, direccion?, distrito?, ciudad?, pais? }
export const sedeService = {
  listar: (page = 0, size = 20) =>
    api.get(`/api/v1/sedes?page=${page}&size=${size}`),

  buscarPorId: (id: number) =>
    api.get(`/api/v1/sedes/${id}`),

  crear: (data: { nombre: string; direccion?: string; ciudad?: string }) =>
    api.post('/api/v1/sedes', { nombreSede: data.nombre, direccion: data.direccion, ciudad: data.ciudad }),

  actualizar: (id: number, data: { nombre: string; direccion?: string; ciudad?: string }) =>
    api.put(`/api/v1/sedes/${id}`, { nombreSede: data.nombre, direccion: data.direccion, ciudad: data.ciudad }),

  eliminar: (id: number) =>
    api.delete(`/api/v1/sedes/${id}`),
}

// ── Escuelas ──────────────────────────────────────────────────────────────────
// Backend espera: { nombreEscuela, fase }  (NOT nombre, NOT faseEscuela)
export const escuelaService = {
  listar: (page = 0, size = 20) =>
    api.get(`/api/v1/escuelas?page=${page}&size=${size}`),

  porFase: (fase: string) =>
    api.get(`/api/v1/escuelas/fase/${fase}`),

  buscarPorId: (id: number) =>
    api.get(`/api/v1/escuelas/${id}`),

  crear: (data: { nombre: string; faseEscuela?: string }) =>
    api.post('/api/v1/escuelas', { nombreEscuela: data.nombre, fase: data.faseEscuela }),

  actualizar: (id: number, data: { nombre: string; faseEscuela?: string }) =>
    api.put(`/api/v1/escuelas/${id}`, { nombreEscuela: data.nombre, fase: data.faseEscuela }),

  eliminar: (id: number) =>
    api.delete(`/api/v1/escuelas/${id}`),

  designarProfesor: (escuelaId: number, personaId: number) =>
    api.post(`/api/v1/escuelas/${escuelaId}/profesor`, { personaId }),
}

// ── Cursos ────────────────────────────────────────────────────────────────────
// Backend espera: { nombreCurso, fechaInicio?, fechaFin?, escuelaId?, profesorId?, esPago?, costo? }
export const cursoService = {
  listar: (page = 0, size = 20) =>
    api.get(`/api/v1/cursos?page=${page}&size=${size}`),

  buscarPorId: (id: number) =>
    api.get(`/api/v1/cursos/${id}`),

  crear: (data: { nombre: string; escuelaId?: number; profesorPersonaId?: number; fechaInicio?: string; fechaFin?: string }) =>
    api.post('/api/v1/cursos', {
      nombreCurso:  data.nombre,
      escuelaId:    data.escuelaId,
      profesorId:   data.profesorPersonaId,
      fechaInicio:  data.fechaInicio || undefined,
      fechaFin:     data.fechaFin    || undefined,
      esPago:       false,
    }),

  actualizar: (id: number, data: { nombre: string; escuelaId?: number; profesorPersonaId?: number; fechaInicio?: string; fechaFin?: string }) =>
    api.put(`/api/v1/cursos/${id}`, {
      nombreCurso:  data.nombre,
      escuelaId:    data.escuelaId,
      profesorId:   data.profesorPersonaId,
      fechaInicio:  data.fechaInicio || undefined,
      fechaFin:     data.fechaFin    || undefined,
      esPago:       false,
    }),

  eliminar: (id: number) =>
    api.delete(`/api/v1/cursos/${id}`),

  inscripciones: (cursoId: number) =>
    api.get(`/api/v1/cursos/${cursoId}/personas`),

  // Backend espera: { personaId, metodoPago }
  inscribir: (cursoId: number, personaId: number) =>
    api.post(`/api/v1/cursos/${cursoId}/inscripciones`, { personaId, metodoPago: 'EFECTIVO' }),

  // Backend espera: { nota, estado, fechaFin? }
  registrarNota: (cursoId: number, inscripcionId: number, nota: number) =>
    api.put(`/api/v1/cursos/${cursoId}/inscripciones/${inscripcionId}/nota`, {
      nota,
      estado: 'APROBADO',
    }),

  desinscribir: (cursoId: number, personaId: number) =>
    api.delete(`/api/v1/cursos/${cursoId}/personas/${personaId}`),
}

// ── Sesiones de Culto ─────────────────────────────────────────────────────────
export const sesionCultoService = {
  sesionAbierta: () =>
    api.get('/api/v1/sesiones-culto/abierta'),

  listar: (page = 0, size = 20) =>
    api.get(`/api/v1/sesiones-culto?page=${page}&size=${size}`),

  buscarPorId: (id: number) =>
    api.get(`/api/v1/sesiones-culto/${id}`),

  abrir: (nombreSesion: string, tipoCulto: string, sedeId?: number) =>
    api.post('/api/v1/sesiones-culto', { nombreSesion, tipoCulto, sedeId }),

  cerrar: (id: number) =>
    api.put(`/api/v1/sesiones-culto/${id}/cerrar`),

  eliminar: (id: number) =>
    api.delete(`/api/v1/sesiones-culto/${id}`),
}

// ── Asistencias ───────────────────────────────────────────────────────────────
export const asistenciaService = {
  registrarPorDni: (dni: string, sesionId?: number) =>
    api.post(`/api/v1/asistencias/barcode/${dni}`, sesionId ? { sesionId } : {}),

  registrarManual: (personaId: number, registradoPorId: number, sesionId?: number) =>
    api.post('/api/v1/asistencias/manual', { personaId, registradoPorId, sesionId }),

  porSesion: (sesionId: number, page = 0, size = 50) =>
    api.get(`/api/v1/asistencias/sesion/${sesionId}?page=${page}&size=${size}`),

  listar: (page = 0, size = 50) =>
    api.get(`/api/v1/asistencias?page=${page}&size=${size}`),
}

// ── Eventos ───────────────────────────────────────────────────────────────────
// Backend espera: { nombreEvento, estadoEvento }
export const eventoService = {
  listar: (page = 0, size = 20) =>
    api.get(`/api/v1/eventos?page=${page}&size=${size}`),

  buscarPorId: (id: number) =>
    api.get(`/api/v1/eventos/${id}`),

  crear: (data: { nombre: string }) =>
    api.post('/api/v1/eventos', { nombreEvento: data.nombre, estadoEvento: true }),

  actualizar: (id: number, data: { nombre: string }) =>
    api.put(`/api/v1/eventos/${id}`, { nombreEvento: data.nombre, estadoEvento: true }),

  eliminar: (id: number) =>
    api.delete(`/api/v1/eventos/${id}`),

  personas: (eventoId: number) =>
    api.get(`/api/v1/eventos/${eventoId}/personas`),

  // Backend espera: { personaId, fechaEvento? }
  agregarPersona: (eventoId: number, personaId: number) =>
    api.post(`/api/v1/eventos/${eventoId}/personas`, { personaId }),

  quitarPersona: (eventoId: number, personaId: number) =>
    api.delete(`/api/v1/eventos/${eventoId}/personas/${personaId}`),
}

// ── Otras Iglesias ────────────────────────────────────────────────────────────
export const otraIglesiaService = {
  listar: (page = 0, size = 20) =>
    api.get(`/api/v1/otras-iglesias?page=${page}&size=${size}`),

  buscarPorId: (id: number) =>
    api.get(`/api/v1/otras-iglesias/${id}`),

  crear: (data: object) =>
    api.post('/api/v1/otras-iglesias', data),

  actualizar: (id: number, data: object) =>
    api.put(`/api/v1/otras-iglesias/${id}`, data),

  eliminar: (id: number) =>
    api.delete(`/api/v1/otras-iglesias/${id}`),
}

// ── Ingresos ──────────────────────────────────────────────────────────────────
// Backend espera: { concepto, monto, tipoIngreso, metodoPago, fechaIngreso, personaId?, miembroId? }
export const ingresoService = {
  listar: (page = 0, size = 20) =>
    api.get(`/api/v1/ingresos?page=${page}&size=${size}`),

  porTipo: (tipo: string, page = 0, size = 20) =>
    api.get(`/api/v1/ingresos/tipo/${tipo}?page=${page}&size=${size}`),

  porMes: (mes: number, anio: number, page = 0, size = 50) =>
    api.get(`/api/v1/ingresos/mes?mes=${mes}&anio=${anio}&page=${page}&size=${size}`),

  crear: (data: { monto: number; descripcion?: string; tipoIngreso: string; metodoPago: string; fecha: string; personaId?: number }) =>
    api.post('/api/v1/ingresos', {
      concepto:    data.descripcion || data.tipoIngreso,
      monto:       data.monto,
      tipoIngreso: data.tipoIngreso,
      metodoPago:  data.metodoPago,
      fechaIngreso: data.fecha,
      personaId:   data.personaId,
    }),

  actualizar: (id: number, data: { monto: number; descripcion?: string; tipoIngreso: string; metodoPago: string; fecha: string; personaId?: number }) =>
    api.put(`/api/v1/ingresos/${id}`, {
      concepto:    data.descripcion || data.tipoIngreso,
      monto:       data.monto,
      tipoIngreso: data.tipoIngreso,
      metodoPago:  data.metodoPago,
      fechaIngreso: data.fecha,
      personaId:   data.personaId,
    }),

  eliminar: (id: number) =>
    api.delete(`/api/v1/ingresos/${id}`),
}

// ── Egresos ───────────────────────────────────────────────────────────────────
// Backend espera: { concepto, montoSalida, tipoEgreso, metodoSalida, fechaEgreso, personaId?, miembroId? }
export const egresoService = {
  listar: (page = 0, size = 20) =>
    api.get(`/api/v1/egresos?page=${page}&size=${size}`),

  porTipo: (tipo: string, page = 0, size = 20) =>
    api.get(`/api/v1/egresos/tipo/${tipo}?page=${page}&size=${size}`),

  porMes: (mes: number, anio: number, page = 0, size = 50) =>
    api.get(`/api/v1/egresos/mes?mes=${mes}&anio=${anio}&page=${page}&size=${size}`),

  crear: (data: { monto: number; descripcion?: string; tipoEgreso: string; fecha: string; personaId?: number }) =>
    api.post('/api/v1/egresos', {
      concepto:    data.descripcion || data.tipoEgreso,
      montoSalida: data.monto,
      tipoEgreso:  data.tipoEgreso,
      metodoSalida: 'EFECTIVO',
      fechaEgreso:  data.fecha,
      personaId:    data.personaId,
    }),

  actualizar: (id: number, data: { monto: number; descripcion?: string; tipoEgreso: string; fecha: string; personaId?: number }) =>
    api.put(`/api/v1/egresos/${id}`, {
      concepto:    data.descripcion || data.tipoEgreso,
      montoSalida: data.monto,
      tipoEgreso:  data.tipoEgreso,
      metodoSalida: 'EFECTIVO',
      fechaEgreso:  data.fecha,
      personaId:    data.personaId,
    }),

  eliminar: (id: number) =>
    api.delete(`/api/v1/egresos/${id}`),
}

// ── Reportes ──────────────────────────────────────────────────────────────────
export const reporteService = {
  financiero: (mes: number, anio: number) =>
    api.get(`/api/v1/reportes/financiero?mes=${mes}&anio=${anio}`),

  asistenciaPorRango: (desde: string, hasta: string) =>
    api.get(`/api/v1/reportes/asistencia?desde=${desde}&hasta=${hasta}`),
}

// ── Huellas ───────────────────────────────────────────────────────────────────
export const huellaService = {
  porPersona: (personaId: number) =>
    api.get(`/api/v1/huellas/persona/${personaId}`),

  listar: (page = 0, size = 20) =>
    api.get(`/api/v1/huellas?page=${page}&size=${size}`),

  registrar: (data: object) =>
    api.post('/api/v1/huellas', data),

  desactivar: (id: number) =>
    api.put(`/api/v1/huellas/${id}/desactivar`),
}
