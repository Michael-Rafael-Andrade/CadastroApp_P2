// telas/TelaListaUsuarios.js
// importar
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Para usar ícone
import { useTheme } from '../src/context/ThemeContext';

// Função auxiliar para buscar usuários 
const buscarUsuarios = async () => {
    try {
        // const jsonUsuarios = await AsyncStorage.getItem('USUARIOS_CADASTRADOS');
        const jsonUsuarios = await AsyncStorage.getItem('@CadastroApp:users');
        // Se houver dados, retorna a lista parseada, senão, um array vazio.
        return jsonUsuarios != null ? JSON.parse(jsonUsuarios) : [];
    } catch (erro) {
        console.error("Erro ao buscar usuários: ", erro);
        return [];
    }
};

// Exporta a função
export function TelaListaUsuarios({ navigation }) {
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    const ultimoToque = useRef(null);
    const ATRASO_TOQUE_DUPLO = 300; // Foi definido 300 milissegundos entre os cliques para ser considerado toque duplo.

    const carregarDados = async () => {
        setLoading(true);
        const usuarios = await buscarUsuarios();
        setListaUsuarios(usuarios);
        setLoading(false);
    };

    // utilizar o useEffect para recarregar a lista sempre que a tela é focada
    useEffect(() => {
        // Adicona um listener para recarregar a lista sempre que a tela for visitada.
        const unsubscribe = navigation.addListener('focus', () => {
            carregarDados();
        });

        // Retorna a função de limpeza do listener
        return unsubscribe;
    }, [navigation]);

    // Função para excluir um usuário
    const handleExcluir = async (idUsuario) => {
        // Usando confirm() do JavaScript para garantia de compatibilidade na Web
        const confirmado = confirm("Tem certeza que deseja excluir este usuário?");

        if (confirmado) {
            try {
                // O restante da lógica de exclusão é a mesma
                const listaAtual = await buscarUsuarios();
                const listaAtualizada = listaAtual.filter(usuario => usuario.id !== idUsuario);

                // await AsyncStorage.setItem('USUARIOS_CADASTRADOS', JSON.stringify(listaAtualizada));
                await AsyncStorage.setItem('@CadastroApp:users', JSON.stringify(listaAtualizada));

                // Recarrega a lista
                carregarDados();

                alert("Usuário excluído com sucesso!");
            } catch (erro) {
                console.error("Erro ao excluir usuário:", erro);
                alert("Falha ao excluir. Tente novamente.");
            }
        }
    };

    // Futura função para Editar
    const handleEditar = (usuario) => {
        navigation.navigate('Edicao', { usuario: usuario });
        // Alert.alert("Ação", `Você clicou para editar o usuário: ${usuario.nome}`);
    };

    // Função para modificar um item cadastrado ao dar dois cliques em cima
    const handleDoubleTap = (usuario) => {
        const agora = Date.now();
        // verifica se há um toque anterior e se o tempo entre o toque atual é menor que o nosso anterior no limite (300ms).
        if(ultimoToque.current && (agora - ultimoToque.current) < ATRASO_TOQUE_DUPLO) {
            // É um toque duplo! chama a edição.
            handleEditar(usuario);
            // reseta o timestamp para evitar que o próximo toque seja considerado triplo, etc.
            ultimoToque.current = null;

        } else {
            // É um toque simples. apenas registramos o tempo.
            ultimoToque.current = agora;
        }
    };

    // Função para renderizar cada item na lista ( o visual de cada usuário )
    const renderizarItem = ({ item }) => (
        <TouchableOpacity
            style={[estilos.itemContainer, { backgroundColor: theme.colors.surface }]}
            
            onPress={() => handleDoubleTap(item)}
        >
            <View style={estilos.infoContainer}>
                <Text style={[estilos.nome, { color: theme.colors.primary}]}>{item.nome}</Text>
                <Text style={[estilos.detalhe, { color: theme.colors.text}]}>CPF: {item.cpf}</Text>
                <Text style={[estilos.detalhe, { color: theme.colors.text}]}>Nasc.: {item.dataNascimento}</Text>
            </View>
            <TouchableOpacity
                style={estilos.botaoEditar}
                onPress={() => handleEditar(item)}
            >
                <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>

            {/* botão para excluir */}
            <TouchableOpacity
                style={estilos.botaoAcao}
                onPress={() => handleExcluir(item.id)}
            >
                <Ionicons name="trash-outline" size={24} color="#dc3545" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    // Exibe um texto de carregamento se os dados ainda não vieram do AsyncStorage
    if (loading) {
        return <View style={estilos.container}>
            <Text style={estilos.listaVazia}>
                Carregando...
            </Text>
        </View>;
    }

    return (
        <View style={[estilos.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[estilos.titulo, { color: theme.colors.text}]}>Lista de Usuários</Text>
            <FlatList
                data={listaUsuarios}
                keyExtractor={(item) => item.id}
                renderItem={renderizarItem}
                ListEmptyComponent={() => (
                    <Text style={estilos.listaVazia}>Nenhum usuário cadastrado. Vá para a aba 'Cadastrar'.</Text>
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
    itemContainer: {
        flexDirection: 'row',
        padding: 15,
        // backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'center',
        // sombra mais sutil
        boxShadow: '0px 2px 3.84px rgb(0, 0, 0, 0.25)',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 3,
        elevation: 3,
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
        color: '#999',
    },
    botaoAcao: {
        padding: 5,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});