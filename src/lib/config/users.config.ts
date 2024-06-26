export const UsersConfig = {
	buttons: {
		editYourData: 'Editá tus datos'
	},
	dialog: {
		impossibleRevertion: 'Esta acción es imposible de revertir',
		possibleRevertion: 'Esta acción es posible de revertir por el administrador',
		userDelete: 'La cuenta del usuario va a ser eliminada permanentemente de la base de datos.',
		userSoftDelete: 'La cuenta del usuario va a ser eliminada en la base de datos, y ya no estará activa.',
		userRestore: 'La cuenta del usuario va a ser restaurada de la base de datos, y volverá a estar activa.',
		title: '¿Estás realmente seguro?'
	},
	form: {
		email: {
			title: 'E-mail',
			placeholder: 'Formato de e-mail'
		},
		name: {
			title: 'Nombre',
			placeholder: 'Mínimo 3 caracteres'
		},
		password: {
			title: 'Contraseña',
			placeholder: 'Mínimo 6 caracteres'
		},
		phone: {
			title: 'Teléfono',
			placeholder: 'Mínimo 10 números'
		},
		role: {
			title: 'Tipo',
			placeholder: 'Seleccioná un tipo'
		}
	},
	headers: ['#', 'Nombre', 'E-mail', 'Teléfono', 'Acciones'],
	noResults: 'Sin resultados',
	pages: {
		createUserTitle: 'Crear Usuario',
		updateUserTitle: 'Modificar Usuario'
	},
	pagination: {
		page: 'Página',
		of: 'de'
	},
	search: 'Buscar por nombre',
	schemas: {
		createUser: {
			emailFormat: 'Formato de e-mail inválido',
			emailMessage: 'El password debe poseer al menos 6 caracteres',
			nameMessage: 'El nombre debe poseer al menos 3 caracteres',
			roleMessage: 'Debes seleccionar un tipo'
		}
	},
	words: {
		since: 'desde el',
		of: 'de'
	}
};
