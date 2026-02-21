// ── Generic wrappers ───────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data: T
  status: number
  message?: string
  timestamp?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// ── Auth ───────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string
  refreshToken: string
}

export interface SignUpResponse {
  status: 'PENDING'
  mensaje: string
}

export interface GoogleAuthResponse {
  status: 'APPROVED' | 'PENDING' | 'NEW'
  token?: string
  refreshToken?: string
  email?: string
  nombres?: string
}

// ── User (decoded JWT) ─────────────────────────────────────────────────────────

export interface User {
  email: string
  roles: string[]
  personaId?: number
  miembroId?: number
  nombres?: string
}

// ── Persona ────────────────────────────────────────────────────────────────────

export type CargoIglesia =
  | 'PASTOR' | 'COPASTOR' | 'LIDER_CELULA' | 'LIDER_MINISTERIO'
  | 'MIEMBRO' | 'VISITANTE' | 'DIACONO' | 'ANCIANO'

export interface Persona {
  id: number
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  dni: string
  fechaNacimiento?: string
  fechaBautizo?: string
  celular?: string
  lugarNacimiento?: string
  estadoCivil?: string
  numeroHijos?: number
  ocupacion?: string
  direccion?: string
  distrito?: string
  provincia?: string
  departamento?: string
  cargo?: CargoIglesia
  iglesiaProcedenciaId?: number
  activo: boolean
  miembroId?: number
  estadoMembresia?: 'NO_MIEMBRO' | 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'
}

/** Campos para CREAR una persona (nombres los obtiene RENIEC por DNI) */
export interface CrearPersonaForm {
  dni: string
  fechaNacimiento: string
  celular?: string
  fechaBautizo?: string
  lugarNacimiento?: string
  estadoCivil?: string
  numeroHijos?: number
  ocupacion?: string
  direccion?: string
  distrito?: string
  provincia?: string
  departamento?: string
  cargo?: CargoIglesia
  iglesiaProcedenciaId?: number
}

/** Campos para ACTUALIZAR una persona */
export interface ActualizarPersonaForm {
  fechaNacimiento?: string
  celular?: string
  fechaBautizo?: string
  lugarNacimiento?: string
  estadoCivil?: string
  numeroHijos?: number
  ocupacion?: string
  direccion?: string
  distrito?: string
  provincia?: string
  departamento?: string
  cargo?: CargoIglesia
  iglesiaProcedenciaId?: number
}

// ── Miembro ────────────────────────────────────────────────────────────────────

export interface Miembro {
  idMiembro: number
  personaId: number
  email: string
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  dni: string
  aprobado: boolean
  fechaConversion?: string
  roles: string[]
}

export interface MiembroPendiente {
  idMiembro: number
  email: string
  nombres: string
  apePat: string
  apeMat: string
  dni: string
  fechaNacimiento: string
  fechaConversion: string
}

// ── Rol ────────────────────────────────────────────────────────────────────────

export interface Rol {
  id: number
  nombre: string
  descripcion?: string
}

export interface MiembroRol {
  miembroId: number
  rolId: number
  rolNombre: string
  fechaAsignacion?: string
}

// ── Célula ─────────────────────────────────────────────────────────────────────

export type TipoCelula = 'DAMAS' | 'VARONES' | 'JOVENES' | 'MATRIMONIOS' | 'ADOLESCENTES' | 'NINOS' | 'GENERAL'

export interface Celula {
  id: number
  nombre: string
  tipoCelula: TipoCelula
  descripcion?: string
  liderPersonaId?: number
  liderNombres?: string
  sedeId?: number
  sedeNombre?: string
  activo: boolean
}

export interface CelulaForm {
  nombre: string
  tipoCelula: TipoCelula
  descripcion?: string
  liderPersonaId?: number
  sedeId?: number
}

// ── Ministerio ─────────────────────────────────────────────────────────────────

export interface Ministerio {
  id: number
  nombre: string
  descripcion?: string
  encargadoPersonaId?: number
  encargadoNombres?: string
  activo: boolean
}

export interface MinisterioForm {
  nombre: string
  descripcion?: string
  encargadoPersonaId?: number
}

export interface MiembroMinisterio {
  personaId: number
  personaNombres: string
  ministerioId: number
  fechaIngreso?: string
  activo: boolean
}

// ── Sede ───────────────────────────────────────────────────────────────────────

export interface Sede {
  id: number
  nombre: string
  direccion?: string
  ciudad?: string
  activo: boolean
}

export interface SedeForm {
  nombre: string
  direccion?: string
  ciudad?: string
}

// ── Escuela ────────────────────────────────────────────────────────────────────

export type FaseEscuela = 'CONSOLIDACION' | 'DISCIPULADO' | 'LIDERAZGO' | 'MADURACION' | 'FORMACION'

export interface Escuela {
  id: number
  nombre: string
  descripcion?: string
  faseEscuela: FaseEscuela
  activo: boolean
}

export interface EscuelaForm {
  nombre: string
  descripcion?: string
  faseEscuela: FaseEscuela
}

export interface Profesor {
  personaId: number
  personaNombres: string
  escuelaId: number
  designadoEn?: string
}

// ── Curso ──────────────────────────────────────────────────────────────────────

export interface Curso {
  id: number
  nombre: string
  descripcion?: string
  escuelaId: number
  escuelaNombre?: string
  profesorPersonaId?: number
  profesorNombres?: string
  fechaInicio?: string
  fechaFin?: string
  activo: boolean
}

export interface CursoForm {
  nombre: string
  descripcion?: string
  escuelaId: number
  profesorPersonaId?: number
  fechaInicio?: string
  fechaFin?: string
}

export interface CursoPersona {
  cursoId: number
  personaId: number
  personaNombres: string
  nota?: number
  asistencias?: number
  activo: boolean
}

// ── Sesión de Culto ────────────────────────────────────────────────────────────

export type TipoCulto = 'DOMINICAL' | 'ORACION' | 'JOVEN' | 'NINOS' | 'EVANGELISMO' | 'CELULA' | 'ESPECIAL'

export interface SesionCulto {
  id: number
  nombreSesion: string
  tipoCulto: TipoCulto
  fechaInicio: string
  fechaFin?: string
  abierta: boolean
  sedeId?: number
  sedeNombre?: string
  totalAsistentes?: number
}

export interface SesionCultoForm {
  nombreSesion: string
  tipoCulto: TipoCulto
  sedeId?: number
}

// ── Asistencia ─────────────────────────────────────────────────────────────────

export type TipoRegistro = 'HUELLA_DACTILAR' | 'MANUAL' | 'CODIGO_QR'

export interface Asistencia {
  id: number
  personaId: number
  personaNombres?: string
  personaDni?: string
  sesionId?: number
  miembroId?: number
  registradoPorId?: number
  tipoRegistro: TipoRegistro
  fechaAsistencia?: string
}

// ── Evento ─────────────────────────────────────────────────────────────────────

export interface Evento {
  id: number
  nombre: string
  descripcion?: string
  fechaEvento: string
  lugarEvento?: string
  activo: boolean
}

export interface EventoForm {
  nombre: string
  descripcion?: string
  fechaEvento: string
  lugarEvento?: string
}

export interface PersonaEvento {
  eventoId: number
  personaId: number
  personaNombres: string
  confirmado: boolean
}

// ── Otra Iglesia ───────────────────────────────────────────────────────────────

export interface OtraIglesia {
  id: number
  nombre: string
  pastor?: string
  ciudad?: string
  pais?: string
  activo: boolean
}

export interface OtraIglesiaForm {
  nombre: string
  pastor?: string
  ciudad?: string
  pais?: string
}

// ── Finanzas ───────────────────────────────────────────────────────────────────

export type TipoIngreso = 'DIEZMO' | 'OFRENDA' | 'DONACION' | 'PRIMER_FRUTO' | 'OTRO'
export type MetodoPago = 'EFECTIVO' | 'TRANSFERENCIA' | 'YAPE' | 'PLIN' | 'OTRO'
export type TipoEgreso = 'ALQUILER' | 'SERVICIOS_BASICOS' | 'MATERIALES' | 'TRANSPORTE' | 'ALIMENTACION' | 'OTRO'

export interface Ingreso {
  id: number
  monto: number
  descripcion?: string
  tipoIngreso: TipoIngreso
  metodoPago: MetodoPago
  fecha: string
  personaId?: number
  personaNombres?: string
  registradoPorId?: number
}

export interface IngresoForm {
  monto: number
  descripcion?: string
  tipoIngreso: TipoIngreso
  metodoPago: MetodoPago
  fecha: string
  personaId?: number
}

export interface Egreso {
  id: number
  monto: number
  descripcion?: string
  tipoEgreso: TipoEgreso
  fecha: string
  registradoPorId?: number
  personaId?: number
  personaNombres?: string
}

export interface EgresoForm {
  monto: number
  descripcion?: string
  tipoEgreso: TipoEgreso
  fecha: string
  personaId?: number
}

// ── Reportes ───────────────────────────────────────────────────────────────────

export interface ReporteFinanciero {
  mes: number
  anio: number
  totalIngresos: number
  totalEgresos: number
  balance: number
  ingresosPorTipo: Record<string, number>
  egresosPorTipo: Record<string, number>
}

export interface ReporteAsistencia {
  desde: string
  hasta: string
  totalSesiones: number
  totalAsistencias: number
  promedioPorSesion: number
  detalles: { sesionId: number; sesionNombre: string; total: number; fecha: string }[]
}

// ── Huella Dactilar ────────────────────────────────────────────────────────────

export type DedoHuella = 'PULGAR_DER' | 'INDICE_DER' | 'MEDIO_DER' | 'ANULAR_DER' | 'MENIQUE_DER' |
  'PULGAR_IZQ' | 'INDICE_IZQ' | 'MEDIO_IZQ' | 'ANULAR_IZQ' | 'MENIQUE_IZQ'

export interface HuellaPersona {
  id: number
  personaId: number
  personaNombres: string
  dedo: DedoHuella
  activo: boolean
  registradoEn?: string
}
