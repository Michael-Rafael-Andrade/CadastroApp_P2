// telas/TelaListaUsuarios.js
// importar
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Para usar ícone

// Função auxiliar para buscar usuários 
const buscarUsuarios = async () => {
    try {
        const jsonUsuarios = await AsyncStorage.getItem('USUARIOS_CADASTRADOS');
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

                await AsyncStorage.setItem('USUARIOS_CADASTRADOS', JSON.stringify(listaAtualizada));

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
        // Por enquanto, apenas alerta o nome. Será a funçãode navegação para a tela de edição
        Alert.alert("Ação", `Você clicou para editar o usuário: ${usuario.nome}`);
    };



    // Função para renderizar cada item na lista ( o visual de cada usuário )
    const renderizarItem = ({ item }) => (
        <View style={estilos.itemContainer}>
            <View style={estilos.infoContainer}>
                <Text style={estilos.nome}>{item.nome}</Text>
                <Text style={estilos.detalhe}>CPF: {item.cpf}</Text>
                <Text style={estilos.detalhe}>Nasc.: {item.dataNascimento}</Text>
            </View>
            <TouchableOpacity
                style={estilos.botaoEditar}
                onPress={() => handleEditar(item)}
            >
                <Ionicons name="create-outline" size={24} color="#007bff" />
            </TouchableOpacity>

            {/* botão para excluir */}
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
        return <View style={estilos.container}>
            <Text style={estilos.listaVazia}>
                Carregando...
            </Text>
        </View>;
    }

    return (
        <View style={estilos.container}>
            <Text style={estilos.titulo}>Lista de Usuários</Text>
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
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
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