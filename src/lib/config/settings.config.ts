export const SettingsConfig = {
	buttons: {
		back: 'Volver',
		save: 'Guardar'
	},
	common: {
		color: 'Color (#000000)',
		name: 'Nombre',
		no_data: 'Sin datos',
		plural: 'Plural',
		property: 'Propiedades',
		select: 'Seleccionar',
		title: 'Título',
		value: 'Valor',
		views: {
			card: 'Tarjeta',
			list: 'Lista'
		}
	},
    dialog: {
        city: {
            cityDelete: 'La ciudad va a ser eliminada permanentemente de la base de datos.',
            citySoftDelete: 'La ciudad va a ser eliminada de la base de datos.',
            cityRestore: 'La ciudad va a ser restaurada de la base de datos.',
        },
        impossibleRevertion: 'Esta acción es posible de revertir por el administrador',
        possibleRevertion: 'Esta acción es posible de revertir por el administrador',
        title: '¿Estás realmente seguro?',
    },
	sections: {
		businessType: 'Tipo de negocio',
		categoriesType: 'Tipo de categoría',
		cities: {
			form: {
				cityTitle: 'Crear ciudad',
                cityPlaceholder: 'Nombre',
                editCityTitle: 'Editar ciudad',
				stateTitle: 'Crear provincia',
                zipPlaceholder: 'Código Postal',
			},
			list: {
				cities: 'Ciudades',
				states: 'Provincias'
			},
			tableHeaders: ['#', 'Ciudad', 'Provincia', 'CP', 'Estado'],
			title: 'Gestión de ciudades'
		},
		dashboardLimit: {
			title: 'Límite de propiedades'
		},
		defaultView: {
			title: 'Vista predeterminada',
			subtitle: 'La vista actual es'
		},
		rowsPerPage: {
			title: 'Opciones de paginación',
			subtitle1: 'Elementos por página: ',
			subtitle2: 'Menú de opciones'
		},
		roles: {
			title: 'Roles de usuarios'
		}
	},
	showing: ['Mostrando', 'propiedades'],
	title: 'Configuraciones generales'
};
