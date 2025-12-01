// telas/TelaListaUsuarios.js
// importar
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native'; // 
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/context/ThemeContext';
import { useUser } from '../src/context/UserContext'; // MUDOU!!!! Importa o Contexto de Usuários



// Exporta a função
export function TelaListaUsuarios({ navigation }) {
    const {
        users, // É a lista JÁ FILTRADA pelo termoBusca
        loading,
        deleteUser, // Função de exclusão do Contexto
        setTermoBusca // Função para definir o termo de busca
    } = useUser();

    const { theme } = useTheme();

    const ultimoToque = useRef(null);
    const ATRASO_TOQUE_DUPLO = 300;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Opcional: Limpar a busca ao focar na tela de lista
            setTermoBusca('');
        });
        return unsubscribe;
    }, [navigation, setTermoBusca]);

    const handleExcluir = (idUsuario) => {
        const confirmado = confirm("Tem certeza que deseja excluir este usuário?");
        if (confirmado) {
            (async () => {
                try {
                    await deleteUser(idUsuario);
                    setTermoBusca('');
                    alert("Usuário excluído com sucesso!");
                } catch (erro) {
                    console.error("Erro ao excluir usuário:", erro);
                    alert("Falha ao excluir. Tente novamente.");
                }
            })();
        }
    };

    // função para Editar
    const handleEditar = (usuario) => {
        navigation.navigate('TelaEdicaoUsuario', { usuario: usuario });
    };

    const handleDoubleTap = (usuario) => {
        const agora = Date.now();
        if (ultimoToque.current && (agora - ultimoToque.current) < ATRASO_TOQUE_DUPLO) {
            handleEditar(usuario);
            ultimoToque.current = null;
        } else {
            ultimoToque.current = agora;
        }
    };

    // Função para renderizar cada item na lista ( o visual de cada usuário )
    const renderizarItem = ({ item }) => (
        // O contêiner principal da linha agora é uma View (para estilos)
        <View
            style={[estilos.itemContainer, { backgroundColor: theme.colors.surface }]}
        >
            {/* É um TouchableOpacity para o toque duplo */}
            <TouchableOpacity
                style={estilos.infoContainer} // Estilo do container de info
                onPress={() => handleDoubleTap(item)} // RESTAURAMOS O TOQUE DUPLO AQUI
            >
                <Text style={[estilos.nome, { color: theme.colors.primary }]}>{item.nome}</Text>
                <Text style={[estilos.detalhe, { color: theme.colors.text }]}>CPF: {item.cpf}</Text>
                <Text style={[estilos.detalhe, { color: theme.colors.text }]}>
                    {item.dataNascimento ? `Nasc.: ${item.dataNascimento}` : 'Nasc.: N/A'}
                </Text>
            </TouchableOpacity>

            {/* Botão de Editar (Irmão, não aninhado) */}
            <TouchableOpacity
                style={estilos.botaoEditar}
                onPress={() => handleEditar(item)}
            >
                <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>

            {/* Botão de Excluir (Irmão, não aninhado) */}
            <TouchableOpacity
                style={estilos.botaoAcao}
                onPress={() => handleExcluir(item.id)}
            >
                <Ionicons name="trash-outline" size={24} color="#dc3545" />
            </TouchableOpacity>
        </View>
    );
    // Exibe um texto de carregamento se os dados ainda não vieram do AsyncStorage
    if (loading) {
        return <View style={[estilos.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[estilos.listaVazia, { color: theme.colors.text }]}>
                Carregando...
            </Text>
        </View>;
    }

    return (
        <View style={[estilos.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[estilos.titulo, { color: theme.colors.text }]}>Lista de Usuários</Text>

            {/* CAMPO DE BUSCA (FILTRO) */}
            <TextInput
                style={[estilos.inputBusca, {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card
                }]}
                placeholder="🔍 Buscar por nome, CPF ou email..."
                placeholderTextColor={theme.colors.textSecondary}
                onChangeText={setTermoBusca}
            />

            <FlatList
                data={users}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderizarItem}
                ListEmptyComponent={() => (
                    <Text style={[estilos.listaVazia, { color: theme.colors.textSecondary }]}>Nenhum usuário encontrado. Vá para a aba 'Cadastrar'.</Text>
                )}
            />
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center',
    },
    inputBusca: {
        height: 45,
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        borderRadius: 8,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'center',
        // elevation: 3,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 3,
        boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
    },
    infoContainer: {
        flex: 1,
    },
    nome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
    },
    detalhe: {
        fontSize: 14,
        color: '#666',
    },
    botaoEditar: {
        padding: 5,
        marginLeft: 10,
    },
    listaVazia: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
    },
    botaoAcao: {
        padding: 5,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});