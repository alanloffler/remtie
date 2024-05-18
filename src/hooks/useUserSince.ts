import { IRole } from '@/lib/interfaces/role.interface';
import { RolesServices } from '@/services/roles.services';
import { useCapitalize } from '@/hooks/useCapitalize';
import { useEffect, useState } from 'react';

export function useUserSince(role: string, date: string | undefined) {
	const [roleDB, setRoleDB] = useState<IRole>({} as IRole);
	const capitalize = useCapitalize();
	let since: string = '';

	useEffect(() => {
		RolesServices.findAll().then((response: IRole[]) => {
			response.find((r) => {
				if (role === r.value) setRoleDB(r);
			});
		});
	}, [role]);

	if (!date || !role) return;

	const newDate: Date = new Date(date);
	const locale = navigator.language.split('-')[0];

	if (locale === 'es') {
		since = `
            ${capitalize(roleDB.title)} desde el 
            ${newDate.getDate()} de 
            ${capitalize(newDate.toLocaleString('es-AR', { month: 'long' }))} de 
            ${newDate.getFullYear()}`;
	}

	if (locale === 'en') {
		since = `
            ${capitalize(roleDB.title)} since 
            ${capitalize(newDate.toLocaleString('en-US', { month: 'long' }))} 
            ${newDate.getDate()}, ${newDate.getFullYear()}
        `;
	}

	return since;
}
