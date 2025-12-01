// src/context/UserContext.js
// importação

import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criar o Contexto
export const UserContext = createContext();

// Chave para o AsyncStorage
const STORAGE_KEY = '@CadastroApp:users';

// Criar o Provedor
export function UserProvider({ children }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [termoBusca, setTermoBusca] = useState('');


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
        // 💡 LOG 1: Veja o ID que chegou para ser deletado
        console.log('ID para DELETAR:', idToDelete, ' | Tipo:', typeof idToDelete);

        let newUsersList = [];

        setUsers(prevUsers => {
            newUsersList = prevUsers.filter(u => {

                // 💡 LOG 2: Veja o ID do usuário atual na lista
                if (u.id == idToDelete) {
                    console.log('--- ENCONTROU UM MATCH! ---');
                    console.log('ID do Usuário:', u.id, ' | Tipo:', typeof u.id);
                }

                // Usamos a comparação não estrita para este teste
                return u.id != idToDelete;
            });

            // 💡 LOG 3: Verifique o tamanho da lista após o filtro
            console.log('Tamanho da lista ANTES:', prevUsers.length, ' | Tamanho DEPOIS:', newUsersList.length);

            return newUsersList;
        });

        await saveUsers(newUsersList);
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

    // LÓGICA DE FILTRAGEM // MUDOU!!!!
    const usuariosFiltrados = useMemo(() => {
        // Se não houver termo de busca, retorna a lista completa
        if (!termoBusca) {
            return users;
        }

        const lowerCaseTermo = termoBusca.toLowerCase();

        // Filtra a lista com base no termo
        return users.filter(usuario => {
            const termo = termoBusca ? termoBusca.toLowerCase() : '';
            return (
                (usuario.nome && usuario.nome.toLowerCase().includes(termo)) ||
                (usuario.cpf && usuario.cpf.toLowerCase().includes(termo)) ||
                (usuario.dataNascimento && usuario.dataNascimento.toLowerCase().includes(termo))
            );
        });
        // ...
    }, [users, termoBusca]);

    // Carregar dados na inicialização
    useEffect(() => {
        loadUsers();
    }, []);

    // Carregar dados na inicialização
    useEffect(() => {
        loadUsers();
    }, []);


    // O valor que será fornecido para os componentes
    const contextValue = {
        users: usuariosFiltrados,
        loading,
        addUser,
        editUser,
        deleteUser,
        termoBusca,
        setTermoBusca,

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

