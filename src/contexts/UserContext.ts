// react
import { createContext } from 'react';

// types
import { UserType } from 'types/user';

// null  -> loading
// true  -> info/true
// false -> no info/false

export const UserContext = createContext<any>(null);
export const UserLoadingContext = createContext<boolean>(true);
export const AdminContext = createContext<boolean | null>(null);
export const UserResponseContext = createContext<boolean>(false);
export const UsersContext = createContext<UserType[] | null>(null);
export const AdminIdsContext = createContext<string[] | null>(null);
