export interface Distrito  { nombre: string }
export interface Provincia { nombre: string; distritos: string[] }
export interface Departamento { nombre: string; provincias: Provincia[] }

export const UBIGEO: Departamento[] = [
  {
    nombre: 'Amazonas',
    provincias: [
      { nombre: 'Chachapoyas', distritos: ['Chachapoyas','Asunción','Balsas','Cheto','Chiliquín','Chuquibamba','Granada','Huancas','La Jalca','Leimebamba','Levanto','Magdalena','Mariscal Castilla','Molinopampa','Montevideo','Olleros','Quinjalca','San Francisco de Daguas','San Isidro de Maino','Soloco','Sonche'] },
      { nombre: 'Bagua', distritos: ['Bagua','Aramango','Copallin','El Parco','Imaza','La Peca'] },
      { nombre: 'Bongará', distritos: ['Jumbilla','Chisquilla','Churuja','Corosha','Cuispes','Florida','Jazán','Recta','San Carlos','Shipasbamba','Valera','Yambrasbamba'] },
      { nombre: 'Condorcanqui', distritos: ['Nieva','El Cenepa','Río Santiago'] },
      { nombre: 'Luya', distritos: ['Lamud','Camporredondo','Cocabamba','Colcamar','Conila','Inguilpata','Longuita','Lonya Chico','Luya','Luya Viejo','María','Ocalli','Ocumal','Pisuquia','Providencia','San Cristóbal','San Francisco de Yeso','San Jerónimo','San Juan de Lopecancha','Santa Catalina','Santo Tomás','Tingo','Trita'] },
      { nombre: 'Rodríguez de Mendoza', distritos: ['San Nicolás','Chirimoto','Cochamal','Huambo','Limabamba','Longar','Mariscal Benavides','Milpuc','Omia','Santa Rosa','Totora','Vista Alegre'] },
      { nombre: 'Utcubamba', distritos: ['Bagua Grande','Cajaruro','Cumba','El Milagro','Jamalca','Lonya Grande','Yamón'] },
    ],
  },
  {
    nombre: 'Ancash',
    provincias: [
      { nombre: 'Huaraz', distritos: ['Huaraz','Cochabamba','Colcabamba','Huanchay','Independencia','Jangas','La Libertad','Llanganuco','Pampas','Pararín','Tarica','Pira'] },
      { nombre: 'Aija', distritos: ['Aija','Coris','Huacllán','La Merced','Succha'] },
      { nombre: 'Antonio Raimondi', distritos: ['Llamellín','Aczo','Chaccho','Chingas','Mirgas','San Juan de Rontoy'] },
      { nombre: 'Asunción', distritos: ['Chacas','Acochaca'] },
      { nombre: 'Bolognesi', distritos: ['Chiquián','Abelardo Pardo Lezameta','Antonio Raymondi','Aquia','Cajacay','Canis','Colquioc','Huallanca','Huasta','Huayllacayán','La Primavera','Mangas','Pacllon','San Miguel de Corpanqui','Ticllos'] },
      { nombre: 'Carhuaz', distritos: ['Carhuaz','Acopampa','Amashca','Anta','Ataquero','Marcará','Pampas','San Miguel de Aco','Shilla','Tinco','Yungar'] },
      { nombre: 'Carlos Fermín Fitzcarrald', distritos: ['San Luis','San Nicolás','Yauya'] },
      { nombre: 'Casma', distritos: ['Casma','Buena Vista Alta','Comandante Noel','Yaután'] },
      { nombre: 'Corongo', distritos: ['Corongo','Aco','Bambas','Cusca','La Pampa','Pampas','Yanac'] },
      { nombre: 'Huari', distritos: ['Huari','Anra','Cajay','Chavin de Huantar','Huacachi','Huacchis','Huachis','Huantar','Masin','Paucas','Ponto','Rahuapampa','Rapayan','San Marcos','San Pedro de Chana','Uco'] },
      { nombre: 'Huarmey', distritos: ['Huarmey','Cochapetí','Culebras','Huayan','Malvas'] },
      { nombre: 'Huaylas', distritos: ['Caraz','Huallanca','Huata','Huaylas','Mato','Pamparomas','Pueblo Libre','Santa Cruz','Santo Toribio','Yuracmarca'] },
      { nombre: 'Santa', distritos: ['Chimbote','Cáceres del Perú','Coishco','Macate','Moro','Nepeña','Samanco','Santa','Nuevo Chimbote'] },
      { nombre: 'Yungay', distritos: ['Yungay','Cascapara','Mancos','Matacoto','Quillo','Ranrahirca','Shupluy','Yanama'] },
    ],
  },
  {
    nombre: 'Apurímac',
    provincias: [
      { nombre: 'Abancay', distritos: ['Abancay','Chacoche','Circa','Curahuasi','Huanipaca','Lambrama','Pichirhua','San Pedro de Cachora','Tamburco'] },
      { nombre: 'Andahuaylas', distritos: ['Andahuaylas','Andarapa','Chiara','Huancarama','Huancaray','Huayana','Kaquiabamba','Kishuara','Pacobamba','Pacucha','Pampachiri','Pomacocha','San Antonio de Cachi','San Jerónimo','San Miguel de Chaccrampa','Santa María de Chicmo','Talavera','Tumay Huaraca','Turpo','Caraybamba'] },
      { nombre: 'Antabamba', distritos: ['Antabamba','El Oro','Huaquirca','Juan Espinoza Medrano','Oropesa','Pachaconas','Sabaino'] },
      { nombre: 'Aymaraes', distritos: ['Chalhuanca','Capaya','Caraybamba','Chapimarca','Colcabamba','Cotaruse','Ihuayllo','Lucre','Pocohuanca','San Juan de Chacña','Sañayca','Soraya','Tapairihua','Tintay','Toraya','Yanaca'] },
      { nombre: 'Cotabambas', distritos: ['Tambobamba','Cotabambas','Coyllurqui','Haquira','Mara','Challhuahuacho'] },
      { nombre: 'Chincheros', distritos: ['Chincheros','Anco_Huallo','Cocharcas','Huaccana','Ocobamba','Ongoy','Uranmarca','Ranracancha'] },
      { nombre: 'Grau', distritos: ['Chuquibambilla','Curpahuasi','Gamarra','Huayllati','Mamara','Micaela Bastidas','Pataypampa','Progreso','San Antonio','Santa Rosa','Turpay','Vilcabamba','Virundo','Curasco'] },
    ],
  },
  {
    nombre: 'Arequipa',
    provincias: [
      { nombre: 'Arequipa', distritos: ['Arequipa','Alto Selva Alegre','Cayma','Cerro Colorado','Characato','Chiguata','Jacobo Hunter','La Joya','Mariano Melgar','Miraflores','Mollebaya','Paucarpata','Pocsi','Polobaya','Quequeña','Sabandía','Sachaca','San Juan de Siguas','San Juan de Tarucani','Santa Isabel de Siguas','Santa Rita de Siguas','Socabaya','Tiabaya','Uchumayo','Vitor','Yanahuara','Yarabamba','Yura','José Luis Bustamante y Rivero'] },
      { nombre: 'Camaná', distritos: ['Camaná','José María Quimper','Mariano Nicolás Valcárcel','Mariscal Cáceres','Nicolás de Pierola','Ocoña','Quilca','Samuel Pastor'] },
      { nombre: 'Caravelí', distritos: ['Caravelí','Acarí','Atico','Atiquipa','Bella Unión','Cahuacho','Chala','Chaparra','Huanuhuanu','Jaqui','Lomas','Quicacha','Yauca'] },
      { nombre: 'Castilla', distritos: ['Aplao','Andagua','Ayo','Chachas','Chilcaymarca','Choco','Huancarqui','Machaguay','Orcopampa','Pampacolca','Puyca','Quechualla','Tipan','Uñon','Uraca','Viraco'] },
      { nombre: 'Caylloma', distritos: ['Chivay','Achoma','Cabanaconde','Callalli','Caylloma','Coporaque','Huambo','Huanca','Ichupampa','Lari','Lluta','Maca','Madrigal','San Antonio de Chuca','Sibayo','Tapay','Tisco','Tuti','Yanque','Majes'] },
      { nombre: 'Condesuyos', distritos: ['Chuquibamba','Andaray','Cayarani','Chichas','Iray','Río Grande','Salamanca','Yanaquihua'] },
      { nombre: 'Islay', distritos: ['Mollendo','Cocachacra','Dean Valdivia','Islay','Mejia','Punta de Bombón'] },
      { nombre: 'La Unión', distritos: ['Cotahuasi','Alca','Charcana','Huaynacotas','Pampamarca','Puyca','Quechualla','Sayla','Tauria','Tomepampa','Toro'] },
    ],
  },
  {
    nombre: 'Ayacucho',
    provincias: [
      { nombre: 'Huamanga', distritos: ['Ayacucho','Acocro','Acos Vinchos','Carmen Alto','Chiara','Jesús Nazareno','Lucanas (Ocros)','Ocros','Pacaycasa','Quinua','San José de Ticllas','San Juan Bautista','Santiago de Pischa','Socos','Tambillo','Vinchos','Jesús Nazareno'] },
      { nombre: 'Cangallo', distritos: ['Cangallo','Chuschi','Los Morochucos','María Parado de Bellido','Paras','Totos'] },
      { nombre: 'Huanta', distritos: ['Huanta','Ayahuanco','Huamanguilla','Iguain','Luricocha','Santillana','Sivia','Llochegua','Canayre','Uchuraccay','Pucacolpa','Chaca'] },
      { nombre: 'La Mar', distritos: ['San Miguel','Anco','Ayna','Chilcas','Chungui','Luis Carranza','Santa Rosa','Tambo','Samugari','Anchihuay','Oronccoy'] },
      { nombre: 'Lucanas', distritos: ['Puquio','Aucara','Cabana','Carmen Salcedo','Chaviña','Chipao','Huac-Huas','Laramate','Leoncio Prado','Llauta','Lucanas','Ocaña','Otoca','Saisa','San Cristóbal','San Juan','San Pedro','San Pedro de Palco','Sancos','Santa Ana de Huaycahuacho','Santa Lucia'] },
      { nombre: 'Parinacochas', distritos: ['Coracora','Chumpi','Coronel Castañeda','Pacapausa','Puyusca','San Francisco de Rivacayco','Upahuacho'] },
      { nombre: 'Víctor Fajardo', distritos: ['Huancapi','Alcamenca','Apongo','Asquipata','Canaria','Cayara','Colca','Huamanquiquia','Huancaraylla','Huaya','Sarhua','Vilcanchos'] },
    ],
  },
  {
    nombre: 'Cajamarca',
    provincias: [
      { nombre: 'Cajamarca', distritos: ['Cajamarca','Asunción','Chetilla','Cospán','Encañada','Jesús','Llacanora','Los Baños del Inca','Magdalena','Namora','San Juan'] },
      { nombre: 'Cajabamba', distritos: ['Cajabamba','Cachachi','Condebamba','Sitacocha'] },
      { nombre: 'Celendín', distritos: ['Celendín','Chumuch','Cortegana','Huasmin','Jorge Chávez','José Gálvez','Miguel Iglesias','Oxamarca','Sorochuco','Sucre','Utco','La Libertad de Pallán'] },
      { nombre: 'Chota', distritos: ['Chota','Anguia','Chadin','Chiguirip','Chimban','Choropampa','Cochabamba','Conchan','Huambos','Lajas','Llama','Miracosta','Paccha','Pion','Querocoto','San Juan de Licupis','Tacabamba','Tocmoche','Chalamarca'] },
      { nombre: 'Contumazá', distritos: ['Contumazá','Chilete','Cupisnique','Guzmango','San Benito','Santa Cruz de Toled','Trinidad','Yonán'] },
      { nombre: 'Cutervo', distritos: ['Cutervo','Callayuc','Cujillo','La Ramada','Pimpingos','Querocotillo','San Andrés de Cutervo','San Juan de Cutervo','San Luis de Lucma','Santa Cruz','Santo Tomás','Socota','Toribio Casanova'] },
      { nombre: 'Jaén', distritos: ['Jaén','Bellavista','Chontali','Colasay','Huabal','Las Pirias','Pomahuaca','Pucara','Sallique','San Felipe','San José del Alto','Santa Rosa'] },
      { nombre: 'San Ignacio', distritos: ['San Ignacio','Chirinos','Huarango','La Coipa','Namballe','San José de Lourdes','Tabaconas'] },
      { nombre: 'San Marcos', distritos: ['Pedro Gálvez','Chancay','Eduardo Villanueva','Gregorio Pita','Ichocán','José Manuel Quiroz','José Sabogal'] },
      { nombre: 'San Miguel', distritos: ['San Miguel','Bolívar','Calquis','Catilluc','El Prado','La Florida','Llapa','Nanchoc','Niepos','San Gregorio','San Silvestre de Cochan','Tongod','Unión Agua Blanca'] },
      { nombre: 'Santa Cruz', distritos: ['Santa Cruz','Andabamba','Catache','Chancaybaños','La Esperanza','Ninabamba','Pulan','Saucepampa','Sexi','Uticyacu','Yauyucán'] },
    ],
  },
  {
    nombre: 'Callao',
    provincias: [
      { nombre: 'Callao', distritos: ['Callao','Bellavista','Carmen de la Legua Reynoso','La Perla','La Punta','Mi Perú','Ventanilla'] },
    ],
  },
  {
    nombre: 'Cusco',
    provincias: [
      { nombre: 'Cusco', distritos: ['Cusco','Ccorca','Poroy','San Jerónimo','San Sebastián','Santiago','Saylla','Wanchaq'] },
      { nombre: 'Acomayo', distritos: ['Acomayo','Acopia','Acos','Mosoc Llacta','Pomacanchi','Rondocan','Sangarará'] },
      { nombre: 'Anta', distritos: ['Anta','Ancahuasi','Cachimayo','Chinchaypujio','Huarocondo','Limatambo','Mollepata','Pucyura','Zurite'] },
      { nombre: 'Calca', distritos: ['Calca','Coya','Lamay','Lares','Pisac','San Salvador','Taray','Yanatile'] },
      { nombre: 'Canas', distritos: ['Yanaoca','Checca','Kunturkanki','Langui','Layo','Pampamarca','Quehue','Túpac Amaru'] },
      { nombre: 'Canchis', distritos: ['Sicuani','Checacupe','Combapata','Marangani','Pitumarca','San Pablo','San Pedro','Tinta'] },
      { nombre: 'Chumbivilcas', distritos: ['Santo Tomás','Capacmarca','Chamaca','Colquemarca','Livitaca','Llusco','Quiñota','Velille'] },
      { nombre: 'Espinar', distritos: ['Espinar','Condoroma','Coporaque','Ocoruro','Pallpata','Pichigua','Suyckutambo','Alto Pichigua'] },
      { nombre: 'La Convención', distritos: ['Santa Ana','Echarate','Huayopata','Maranura','Ocobamba','Quellouno','Kimbiri','Santa Teresa','Vilcabamba','Pichari','Inkawasi','Villa Kintiarina','Villa Virgen'] },
      { nombre: 'Paruro', distritos: ['Paruro','Accha','Ccapi','Colcha','Huanoquite','Omacha','Paccaritambo','Pillpinto','Yaurisque'] },
      { nombre: 'Paucartambo', distritos: ['Paucartambo','Caicay','Challabamba','Colquepata','Huancarani','Kosñipata'] },
      { nombre: 'Quispicanchi', distritos: ['Urcos','Andahuaylillas','Camanti','Ccarhuayo','Ccatca','Cusipata','Huaro','Lucre','Marcapata','Ocongate','Oropesa','Quiquijana'] },
      { nombre: 'Urubamba', distritos: ['Urubamba','Chinchero','Huayllabamba','Machupicchu','Maras','Ollantaytambo','Yucay'] },
    ],
  },
  {
    nombre: 'Huancavelica',
    provincias: [
      { nombre: 'Huancavelica', distritos: ['Huancavelica','Acobambilla','Acoria','Conayca','Cuenca','Huachocolpa','Huayllahuara','Izcuchaca','Laria','Manta','Mariscal Cáceres','Moya','Nuevo Occoro','Palca','Pilchaca','Vilca','Yauli','Ascensión','Huando'] },
      { nombre: 'Acobamba', distritos: ['Acobamba','Andabamba','Anta','Caja','Marcas','Paucara','Pomacocha','Rosario'] },
      { nombre: 'Angaraes', distritos: ['Lircay','Anchonga','Callanmarca','Ccochaccasa','Chincho','Congalla','Huanca-Huanca','Huayllay Grande','Julcamarca','San Antonio de Antaparco','Santo Tomás de Pata','Secclla'] },
      { nombre: 'Castrovirreyna', distritos: ['Castrovirreyna','Arma','Aurahua','Capillas','Chupamarca','Cocas','Huachos','Huamatambo','Mollepampa','San Juan','Santa Ana','Tantará','Ticrapo'] },
      { nombre: 'Churcampa', distritos: ['Churcampa','Anco','Chinchihuasi','El Carmen','La Merced','Locroja','Paucarbamba','San Miguel de Mayocc','San Pedro de Coris','Pachamarca','Cosme'] },
      { nombre: 'Tayacaja', distritos: ['Pampas','Acostambo','Acraquia','Ahuaycha','Colcabamba','Daniel Hernández','Huachocolpa','Huaribamba','Ñawinpuquio','Pazos','Quishuar','Salcabamba','Salcahuasi','San Marcos de Rocchac','Surcubamba','Tintay Puncu','Quichuas','Andaymarca','Roble','Pichos','Santiago de Tucuma'] },
    ],
  },
  {
    nombre: 'Huánuco',
    provincias: [
      { nombre: 'Huánuco', distritos: ['Huánuco','Amarilis','Chinchao','Churubamba','Margos','Quisqui','San Francisco de Cayran','San Pedro de Chaulan','Santa María del Valle','Yarumayo','Pillco Marca','Yacus','San Pablo de Pillao'] },
      { nombre: 'Ambo', distritos: ['Ambo','Cayna','Colpas','Conchamarca','Huácar','San Francisco','San Rafael','Tomay Kichwa'] },
      { nombre: 'Dos de Mayo', distritos: ['La Unión','Chuquis','Marias','Pachas','Quivilla','Ripan','Shunqui','Sillapata','Yanas'] },
      { nombre: 'Leoncio Prado', distritos: ['Rupa-Rupa','Daniel Alomía Robles','Hermílio Valdizán','José Crespo y Castillo','Luyando','Mariano Dámaso Beraún','Pucayacu','Castillo Grande','Pueblo Nuevo','Santo Domingo de Anda'] },
      { nombre: 'Pachitea', distritos: ['Panao','Chaglla','Molino','Umari'] },
    ],
  },
  {
    nombre: 'Ica',
    provincias: [
      { nombre: 'Ica', distritos: ['Ica','La Tinguiña','Los Aquijes','Ocucaje','Pachacútec','Parcona','Pueblo Nuevo','Salas','San José de Los Molinos','San Juan Bautista','Santiago','Subtanjalla','Tate','Yauca del Rosario'] },
      { nombre: 'Chincha', distritos: ['Chincha Alta','Alto Larán','Chavín','Chincha Baja','El Carmen','Grocio Prado','Pueblo Nuevo','San Juan de Yanac','San Pedro de Huacarpana','Sunampe','Tambo de Mora'] },
      { nombre: 'Nasca', distritos: ['Nasca','Changuillo','El Ingenio','Marcona','Vista Alegre'] },
      { nombre: 'Palpa', distritos: ['Palpa','Llipata','Río Grande','Santa Cruz','Tibillo'] },
      { nombre: 'Pisco', distritos: ['Pisco','Huancano','Humay','Independencia','Paracas','San Andrés','San Clemente','Túpac Amaru Inca'] },
    ],
  },
  {
    nombre: 'Junín',
    provincias: [
      { nombre: 'Huancayo', distritos: ['Huancayo','Carhuacallanga','Chacapampa','Chicche','Chilca','Chongos Alto','Chupuro','Colca','Cullhuas','El Tambo','Huacrapuquio','Hualhuas','Huancan','Huasicancha','Huayucachi','Ingenio','Pariahuanca','Pilcomayo','Pucara','Quichuay','Quilcas','San Agustín','San Jerónimo de Tunan','Saño','Sapallanga','Sicaya','Santo Domingo de Acobamba','Viques'] },
      { nombre: 'Chanchamayo', distritos: ['Chanchamayo','Perené','Pichanaqui','San Luis de Shuaro','San Ramón','Vitoc'] },
      { nombre: 'Chupaca', distritos: ['Chupaca','Ahuac','Chongos Bajo','Huachac','Huamancaca Chico','San Juan de Jarpa','Tres de Diciembre','Yanacancha'] },
      { nombre: 'Concepción', distritos: ['Concepción','Aco','Andamarca','Chambara','Cochas','Comas','Heroínas Toledo','Manzanares','Mariscal Castilla','Matahuasi','Mito','Nueve de Julio','Orcotuna','San José de Quero','Santa Rosa de Ocopa'] },
      { nombre: 'Junín', distritos: ['Junín','Carhuamayo','Junín','Ondores','Ulcumayo'] },
      { nombre: 'Satipo', distritos: ['Satipo','Coviriali','Llaylla','Mazamari','Pampa Hermosa','Pangoa','Río Negro','Río Tambo','Vizcatan del Ene'] },
      { nombre: 'Tarma', distritos: ['Tarma','Acobamba','Huaricolca','Huasahuasi','La Unión','Palca','Palcamayo','San Pedro de Cajas','Tapo'] },
      { nombre: 'Yauli', distritos: ['La Oroya','Chacapalpa','Huay-Huay','Marcapomacocha','Morococha','Paccha','Santa Bárbara de Carhuacayán','Santa Rosa de Sacco','Suitucancha','Yauli'] },
    ],
  },
  {
    nombre: 'La Libertad',
    provincias: [
      { nombre: 'Trujillo', distritos: ['Trujillo','El Porvenir','Florencia de Mora','Huanchaco','La Esperanza','Laredo','Moche','Poroto','Salaverry','Simbal','Víctor Larco Herrera'] },
      { nombre: 'Ascope', distritos: ['Ascope','Casa Grande','Chicama','Chocope','Magdalena de Cao','Paiján','Rázuri','Santiago de Cao'] },
      { nombre: 'Chepén', distritos: ['Chepén','Pacanga','Pueblo Nuevo'] },
      { nombre: 'Julcán', distritos: ['Julcán','Calamarca','Carabamba','Huaso'] },
      { nombre: 'Otuzco', distritos: ['Otuzco','Agallpampa','Charat','Huaranchal','La Cuesta','Paranday','Salpo','Sinsicap','Usquil'] },
      { nombre: 'Pacasmayo', distritos: ['San Pedro de Lloc','Guadalupe','Jequetepeque','Pacasmayo','San José'] },
      { nombre: 'Pataz', distritos: ['Tayabamba','Buldibuyo','Chillia','Huaylillas','Huancaspata','Huayo','Ongon','Parcoy','Pataz','Pias','Santiago de Challas','Taurija','Urpay'] },
      { nombre: 'Sánchez Carrión', distritos: ['Huamachuco','Chugay','Cochorco','Curgos','Marcabal','Sanagoran','Sarin','Sartimbamba'] },
      { nombre: 'Santiago de Chuco', distritos: ['Santiago de Chuco','Angasmarca','Cachicadan','Mollebamba','Mollepata','Quiruvilca','Santa Cruz de Chuca','Sitabamba'] },
      { nombre: 'Virú', distritos: ['Virú','Chao','Guadalupito'] },
    ],
  },
  {
    nombre: 'Lambayeque',
    provincias: [
      { nombre: 'Chiclayo', distritos: ['Chiclayo','Cayaltí','Chongoyape','Éten','Éten Puerto','José Leonardo Ortiz','La Victoria','Lagunas','Monsefú','Nueva Arica','Oyotún','Picsi','Pimentel','Reque','Santa Rosa','Saña','Pomalca','Pátapo','Tumán'] },
      { nombre: 'Ferreñafe', distritos: ['Ferreñafe','Cañaris','Incahuasi','Manuel Antonio Mesones Muro','Pítipo','Pueblo Nuevo'] },
      { nombre: 'Lambayeque', distritos: ['Lambayeque','Chochope','Illimo','Jayanca','Mochumí','Mórrope','Motupe','Olmos','Pacora','Salas','San José','Túcume'] },
    ],
  },
  {
    nombre: 'Lima',
    provincias: [
      { nombre: 'Lima', distritos: ['Lima','Ancón','Ate','Barranco','Breña','Carabayllo','Chaclacayo','Chorrillos','Cieneguilla','Comas','El Agustino','Independencia','Jesús María','La Molina','La Victoria','Lince','Los Olivos','Lurigancho','Lurín','Magdalena del Mar','Miraflores','Pachacámac','Pucusana','Pueblo Libre','Puente Piedra','Punta Hermosa','Punta Negra','Rímac','San Bartolo','San Borja','San Isidro','San Juan de Lurigancho','San Juan de Miraflores','San Luis','San Martín de Porres','San Miguel','Santa Anita','Santa María del Mar','Santa Rosa','Santiago de Surco','Surquillo','Villa El Salvador','Villa María del Triunfo'] },
      { nombre: 'Barranca', distritos: ['Barranca','Ámbar','Haucho','Paramonga','Pativilca','Supe','Supe Puerto'] },
      { nombre: 'Cajatambo', distritos: ['Cajatambo','Copa','Gorgor','Huancapon','Manas'] },
      { nombre: 'Canta', distritos: ['Canta','Arahuay','Huamantanga','Huaros','Lachaqui','San Buenaventura','Santa Rosa de Quives'] },
      { nombre: 'Cañete', distritos: ['San Vicente de Cañete','Asia','Calango','Cerro Azul','Chilca','Coayllo','Imperial','Lunahuaná','Mala','Nuevo Imperial','Pacarán','Quilmaná','San Antonio','San Luis','San Luis','Santa Cruz de Flores','Zúñiga'] },
      { nombre: 'Huaral', distritos: ['Huaral','Atavillos Alto','Atavillos Bajo','Aucallama','Chancay','Ihuarí','Lampián','Pacaraos','San Miguel de Acos','Santa Cruz de Andamarca','Sumbilca','Végueta'] },
      { nombre: 'Huarochirí', distritos: ['Matucana','Antioquia','Callahuanca','Carampoma','Chicla','Cuenca','Huachupampa','Huanza','Huarochirí','Lahuaytambo','Langa','Laraos','Mariatana','Ricardo Palma','San Andrés de Tupicocha','San Antonio','San Damián','San Juan de Iris','San Juan de Tantaranche','San Lorenzo de Quinti','San Mateo','San Mateo de Otao','San Pedro de Casta','San Pedro de Huancayre','Sangallaya','Santa Eulalia','Santo Domingo de los Olleros','Surco','Tupicocha'] },
      { nombre: 'Huaura', distritos: ['Huacho','Ambar','Caleta de Carquín','Checras','Hualmay','Huaura','Leoncio Prado','Paccho','Santa Leonor','Santa María','Sayán','Vegueta'] },
      { nombre: 'Oyón', distritos: ['Oyón','Andajes','Caujul','Cochamarca','Navan','Pachangara'] },
      { nombre: 'Yauyos', distritos: ['Yauyos','Alis','Allauca','Ayaviri','Azángaro','Cacra','Carania','Catahuasi','Chocos','Cochas','Colonia','Hongos','Huampara','Huancaya','Huangáscar','Huantán','Huañec','Laraos','Lincha','Madean','Miraflores','Omas','Putinza','Quinches','Quinocay','San Joaquín','San Pedro de Pilas','Tanta','Tauripampa','Tomas','Tupe','Viñac','Vitis'] },
    ],
  },
  {
    nombre: 'Loreto',
    provincias: [
      { nombre: 'Maynas', distritos: ['Iquitos','Alto Nanay','Fernando Lores','Indiana','Las Amazonas','Mazan','Napo','Punchana','Torres Causana','Belén','San Juan Bautista'] },
      { nombre: 'Alto Amazonas', distritos: ['Yurimaguas','Balsapuerto','Jeberos','Lagunas','Santa Cruz','Teniente César López Rojas'] },
      { nombre: 'Loreto', distritos: ['Nauta','Parinari','Tigre','Trompeteros','Urarinas'] },
      { nombre: 'Mariscal Ramón Castilla', distritos: ['Ramón Castilla','Pebas','Yavari','San Pablo'] },
      { nombre: 'Requena', distritos: ['Requena','Alto Tapiche','Capelo','Emilio San Martín','Maquia','Puinahua','Saquena','Soplin','Tapiche','Jenaro Herrera','Yaquerana'] },
      { nombre: 'Ucayali', distritos: ['Contamana','Inahuaya','Padre Márquez','Pampa Hermosa','Sarayacu','Vargas Guerra'] },
      { nombre: 'Datem del Marañón', distritos: ['San Lorenzo','Andoas','Barranca','Cahuapanas','Manseriche','Morona','Pastaza','Ratón'] },
      { nombre: 'Putumayo', distritos: ['San Antonio del Estrecho','Teniente Manuel Clavero','Yaguas','Rosa Panduro','Leguizamo'] },
    ],
  },
  {
    nombre: 'Madre de Dios',
    provincias: [
      { nombre: 'Tambopata', distritos: ['Tambopata','Inambari','Las Piedras','Laberinto'] },
      { nombre: 'Manu', distritos: ['Manu','Fitzcarrald','Madre de Dios','Huepetuhe'] },
      { nombre: 'Tahuamanu', distritos: ['Iñapari','Iberia','Tahuamanu'] },
    ],
  },
  {
    nombre: 'Moquegua',
    provincias: [
      { nombre: 'Mariscal Nieto', distritos: ['Moquegua','Carumas','Cuchumbaya','Samegua','San Cristóbal','Torata'] },
      { nombre: 'General Sánchez Cerro', distritos: ['Omate','Chojata','Coalaque','Ichuña','La Capilla','Lloque','Matalaque','Puquina','Quinistaquillas','Ubinas','Yunga'] },
      { nombre: 'Ilo', distritos: ['Ilo','El Algarrobal','Pacocha'] },
    ],
  },
  {
    nombre: 'Pasco',
    provincias: [
      { nombre: 'Pasco', distritos: ['Chaupimarca','Huachon','Huariaca','Huayllay','Ninacaca','Pallanchacra','Paucartambo','San Francisco de Asís de Yarusyacán','Simón Bolívar','Ticlacayán','Tinyahuarco','Vicco','Yanacancha'] },
      { nombre: 'Daniel Alcides Carrión', distritos: ['Yanahuanca','Chacayan','Goyllarisquizga','Paucar','San Pedro de Pillao','Santa Ana de Tusi','Tapuc','Vilcabamba'] },
      { nombre: 'Oxapampa', distritos: ['Oxapampa','Chontabamba','Huancabamba','Palcazu','Pozuzo','Puerto Bermúdez','Villa Rica','Constitución'] },
    ],
  },
  {
    nombre: 'Piura',
    provincias: [
      { nombre: 'Piura', distritos: ['Piura','Castilla','Catacaos','Cura Mori','El Tallán','La Arena','La Unión','Las Lomas','Tambogrande','Veintiseis de Octubre'] },
      { nombre: 'Ayabaca', distritos: ['Ayabaca','Frias','Jilili','Lagunas','Montero','Pacaipampa','Paimas','Sapillica','Sicchez','Suyo'] },
      { nombre: 'Huancabamba', distritos: ['Huancabamba','Canchaque','El Carmen de la Frontera','Huarmaca','Lalaquiz','San Miguel de El Faique','Sondor','Sondorillo'] },
      { nombre: 'Morropón', distritos: ['Chulucanas','Buenos Aires','Chalaco','La Matanza','Morropón','Salitral','San Juan de Bigote','Santa Catalina de Mossa','Santo Domingo','Yamango'] },
      { nombre: 'Paita', distritos: ['Paita','Amotape','Arenal','Colan','La Huaca','Tamarindo','Vichayal'] },
      { nombre: 'Sechura', distritos: ['Sechura','Bellavista de la Unión','Bernal','Cristo Nos Valga','Rinconada Llicuar','Vice'] },
      { nombre: 'Sullana', distritos: ['Sullana','Bellavista','Ignacio Escudero','Lancones','Marcavelica','Miguel Checa','Querecotillo','Salitral'] },
      { nombre: 'Talara', distritos: ['Pariñas','El Alto','La Brea','Lobitos','Los Órganos','Mancora'] },
    ],
  },
  {
    nombre: 'Puno',
    provincias: [
      { nombre: 'Puno', distritos: ['Puno','Acora','Amantani','Atuncolla','Capachica','Chucuito','Coata','Huata','Mañazo','Paucarcolla','Pichacani','Platería','San Antonio','Tiquillaca','Vilque'] },
      { nombre: 'Azángaro', distritos: ['Azángaro','Achaya','Arapa','Asillo','Caminaca','Chupa','José Domingo Choquehuanca','Muñani','Potoni','Saman','San Antón','San José','San Juan de Salinas','Santiago de Pupuja','Tirapata'] },
      { nombre: 'Chucuito', distritos: ['Juli','Desaguadero','Huacullani','Kelluyo','Pisacoma','Pomata','Zepita'] },
      { nombre: 'El Collao', distritos: ['Ilave','Capazo','Pilcuyo','Santa Rosa','Conduriri'] },
      { nombre: 'Huancané', distritos: ['Huancané','Cojata','Huatasani','Inchupalla','Pusi','Rosaspata','Taraco','Vilque Chico'] },
      { nombre: 'Lampa', distritos: ['Lampa','Cabanilla','Calapuja','Nicasio','Ocuviri','Palca','Paratía','Pucará','Santa Lucía','Vilavila'] },
      { nombre: 'Melgar', distritos: ['Ayaviri','Antauta','Cupi','Llalli','Macari','Nuñoa','Orurillo','Santa Rosa','Umachiri'] },
      { nombre: 'San Román', distritos: ['Juliaca','Cabana','Cabanillas','Caracoto','San Miguel'] },
      { nombre: 'Sandia', distritos: ['Sandia','Cuyocuyo','Limbani','Patambuco','Phara','Quiaca','San Juan del Oro','Yanahuaya','Alto Inambari','San Pedro de Putina Punco'] },
    ],
  },
  {
    nombre: 'San Martín',
    provincias: [
      { nombre: 'Moyobamba', distritos: ['Moyobamba','Calzada','Habana','Jepelacio','Soritor','Yantalo'] },
      { nombre: 'Bellavista', distritos: ['Bellavista','Alto Biavo','Bajo Biavo','Huallaga','San Pablo','San Rafael'] },
      { nombre: 'El Dorado', distritos: ['San José de Sisa','Agua Blanca','San Martín','Santa Rosa','Shatoja'] },
      { nombre: 'Huallaga', distritos: ['Saposoa','Alto Saposoa','El Eslabón','Piscoyacu','Sacanche','Tingo de Saposoa'] },
      { nombre: 'Lamas', distritos: ['Lamas','Alonso de Alvarado','Barranquita','Caynarachi','Cuñumbuqui','Pinto Recodo','Rumisapa','San Roque de Cumbaza','Shanao','Tabalosos','Zapatero'] },
      { nombre: 'Mariscal Cáceres', distritos: ['Juanjui','Campanilla','Huicungo','Pachiza','Pajarillo'] },
      { nombre: 'Picota', distritos: ['Picota','Buenos Aires','Caspizapa','Pucacaca','San Cristóbal','San Hilarión','Shamboyacu','Tingo de Ponasa','Tres Unidos'] },
      { nombre: 'Rioja', distritos: ['Rioja','Awajun','Elías Soplin Vargas','Nueva Cajamarca','Pardo Miguel','Posic','San Fernando','Valle de la Conquista','Yorongos','Yuracyacu'] },
      { nombre: 'San Martín', distritos: ['Tarapoto','Alberto Leveau','Cacatachi','Chazuta','Chipurana','El Porvenir','Huimbayoc','Juan Guerra','La Banda de Shilcayo','Morales','Papaplaya','San Antonio','Sauce','Shapaja'] },
      { nombre: 'Tocache', distritos: ['Tocache','Nuevo Progreso','Polvora','Shunte','Uchiza'] },
    ],
  },
  {
    nombre: 'Tacna',
    provincias: [
      { nombre: 'Tacna', distritos: ['Tacna','Alto de la Alianza','Calana','Ciudad Nueva','Inclán','Pachia','Palca','Pocollay','Sama','Coronel Gregorio Albarracin Lanchipa','La Yarada Los Palos'] },
      { nombre: 'Candarave', distritos: ['Candarave','Cairani','Camilaca','Curibaya','Huanuara','Quilahuani'] },
      { nombre: 'Jorge Basadre', distritos: ['Locumba','Ilabaya','Ite'] },
      { nombre: 'Tarata', distritos: ['Tarata','Héroe Albarracín','Estique','Estique-Pampa','Sitajara','Susapaya','Tarucachi','Ticaco'] },
    ],
  },
  {
    nombre: 'Tumbes',
    provincias: [
      { nombre: 'Tumbes', distritos: ['Tumbes','Corrales','La Cruz','Pampas de Hospital','San Jacinto','San Juan de la Virgen'] },
      { nombre: 'Contralmirante Villar', distritos: ['Zorritos','Casitas','Canoas de Punta Sal'] },
      { nombre: 'Zarumilla', distritos: ['Zarumilla','Aguas Verdes','La Palma','Matapalo'] },
    ],
  },
  {
    nombre: 'Ucayali',
    provincias: [
      { nombre: 'Coronel Portillo', distritos: ['Callería','Campoverde','Iparía','Masisea','Yarinacocha','Nueva Requena','Manantay'] },
      { nombre: 'Atalaya', distritos: ['Raymondi','Sepahua','Tahuania','Yurúa'] },
      { nombre: 'Padre Abad', distritos: ['Padre Abad','Irazola','Curimaná','Neshuya','Alexander Von Humboldt'] },
      { nombre: 'Purús', distritos: ['Purús'] },
    ],
  },
]

/** Obtiene provincias de un departamento */
export function getProvincias(departamento: string): Provincia[] {
  return UBIGEO.find(d => d.nombre === departamento)?.provincias ?? []
}

/** Obtiene distritos de una provincia en un departamento */
export function getDistritos(departamento: string, provincia: string): string[] {
  return getProvincias(departamento).find(p => p.nombre === provincia)?.distritos ?? []
}

export const DEPARTAMENTOS = UBIGEO.map(d => d.nombre)
