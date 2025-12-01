// src/context/UserContext.js
// importação

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criar o Contexto
export const UserContext = createContext();

// Chave para o AsyncStorage
const STORAGE_KEY = '@CadastroApp:users';

// Criar o Provedor
export function UserProvider({ children }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);



    // Função para carregar os usuários
    const loadUsers = async () => {
        // ... lógica de carregamento ...
        try {
            setLoading(true);
            const storedUsers = await AsyncStorage.getItem(STORAGE_KEY);
            if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
            }
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        } finally {
            setLoading(false);
        }
    };

    // Função para salvar os usuários
    const saveUsers = async (newUsers) => {
        // ... lógica de salvamento ...
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUsers));
        } catch (error) {
            console.error('Erro ao salvar usuários:', error);
        }
    };

    // --- Funções CRUD ---

    // Exemplo de função para adicionar usuário
    const addUser = async (newUser) => {
        // ... lógica de adição ...
        const userWithId = { id: Date.now(), ...newUser }; // Garante ID único
        const updatedUsers = [...users, userWithId];
        setUsers(updatedUsers);
        await saveUsers(updatedUsers);
    };

    const deleteUser = async (idToDelete) => {
        const updatedUsers = users.filter(u => u.id !== idToDelete);
        setUsers(updatedUsers);
        await saveUsers(updatedUsers);
    };

    const editUser = async (updatedUser) => {
        const updatedUsers = users.map(user => {
            if (user.id === updatedUser.id) {
                return updatedUser;
            }
            return user;
        });
        setUsers(updatedUsers);
        await saveUsers(updatedUsers);
    };

    // Carregar dados na inicialização
    useEffect(() => {
        loadUsers();
    }, []);


    // O valor que será fornecido para os componentes
    const contextValue = {
        users,
        loading,
        addUser,
        editUser,   
        deleteUser, 




    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

// Criar o Hook personalizado para facilitar o uso
export function useUser() {
    return useContext(UserContext);
}

