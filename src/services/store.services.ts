// Zustand store used for global states (sidebar, authorization, token and user loggedin)
// Values are stored in session storage, and can be accessed from any component at any level.
// TODO: see if store doesn't use session storage, how the app will act with refreshing the page
// Zustand imports
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
// Types
type State = {
	authToken: string;
	authorized: boolean;
	clicked: number;
	isOpen: boolean;
	tabActive: string;
	userId: number;
    username: string;
    role: string;
};

type Actions = {
	isClicked: (item: number) => void;
	reset: () => void;
	setAuthToken: (token: string) => void;
	setAuthorized: (token: boolean) => void;
	setTabActive: (tab: string) => void;
	setUserId: (id: number) => void;
	setUsername: (username: string) => void;
	toggleOpen: () => void;
    setRole: (role: string) => void;
};

const initialState: State = {
	authToken: '',
	authorized: false,
	clicked: 0,
	isOpen: false,
	tabActive: 'card',
	userId: 0,
    username: '',
    role: '',
};

export const store = create<State & Actions>()(
	persist(
		(set, get) => ({
			isOpen: false,
			toggleOpen: () => {
				const actualState = get().isOpen;
				set({ isOpen: !actualState });
			},
			clicked: 0,
			isClicked: (item) => {
				set(() => ({ clicked: item }));
			},
			authorized: false,
			setAuthorized: (token) => {
				set(() => ({ authorized: token }));
			},
			authToken: '',
			setAuthToken: (token) => {
				set(() => ({ authToken: token }));
			},
			userId: 0,
			setUserId: (id) => {
				set(() => ({ userId: id }));
			},
            username: '',
            setUsername: (username) => {
              set(() => ({ username: username }));
            },
            role: '',
            setRole: (role) => {
              set(() => ({ role: role }));  
            },
			tabActive: '',
			setTabActive: (tab: string) => {
				set(() => ({ tabActive: tab }));
			},
			reset: () => set(initialState)
		}),
		{
			name: 'sidebar-clicked',
			storage: createJSONStorage(() => sessionStorage)
		}
	)
);
